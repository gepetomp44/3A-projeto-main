(() => {
  'use strict';

  const API_URL =
    'https://script.google.com/macros/s/AKfycbzHST8dAN9lWEAPzRiZ-B7CFE92AZntVhPYndbtAXNFEw6D3GDriLesygsYucTKhuVO/exec';
  const REFRESH_INTERVAL_MS = 60_000;

  const DIA_SEMANA_MAP = {
    1: { nome: 'Domingo', jsDay: 0 },
    2: { nome: 'Segunda', jsDay: 1 },
    3: { nome: 'Terca', jsDay: 2 },
    4: { nome: 'Quarta', jsDay: 3 },
    5: { nome: 'Quinta', jsDay: 4 },
    6: { nome: 'Sexta', jsDay: 5 },
    7: { nome: 'Sabado', jsDay: 6 },
  };
  const WEEK_DAYS = [1, 2, 3, 4, 5, 6, 7];

  const SELECTORS = {
    list: '#eventos-lista, [data-eventos-lista], .eventos-lista, .grid.grid-cols-1.gap-4',
    card: '.evento-card, [data-evento-card], .group',
    dateBox: '[data-evento-data], .evento-data',
    dayNumber: '[data-evento-dia-numero], .evento-dia-numero, .evento-dia',
    dayLabel: '[data-evento-dia-label], .evento-dia-label',
    dayName: '[data-evento-dia-nome], .evento-dia-nome',
    title: '[data-evento-titulo], .evento-titulo, h3',
    description: '[data-evento-descricao], .evento-descricao, p',
    meta: '[data-evento-meta], .evento-meta, .flex.flex-wrap',
    timeWrap: '[data-evento-hora-wrap], .evento-hora-wrap',
    localWrap: '[data-evento-local-wrap], .evento-local-wrap',
    linkWrap: '[data-evento-link-wrap], .evento-link-wrap',
    refreshButton: '#btn-atualizar-eventos, [data-eventos-atualizar]',
    lastUpdate: '#eventos-atualizado-em, [data-eventos-atualizado-em]',
  };

  let listEl = null;
  let templateCard = null;
  let refreshButton = null;
  let lastUpdateEl = null;
  let loading = false;

  const toText = (value) => String(value ?? '').trim();

  const setVisible = (element, visible) => {
    if (!element) return;
    element.style.display = visible ? '' : 'none';
  };

  const setText = (element, value, hideWhenEmpty = true) => {
    if (!element) return;
    const text = toText(value);
    if (!text && hideWhenEmpty) {
      setVisible(element, false);
      return;
    }
    element.textContent = text;
    setVisible(element, true);
  };

  const parseTimeToMinutes = (value) => {
    const time = toText(value);
    if (!time) return Number.POSITIVE_INFINITY;
    const match = time.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
    if (!match) return Number.POSITIVE_INFINITY;
    return Number(match[1]) * 60 + Number(match[2]);
  };

  const getDateInCurrentWeek = (diaSemana) => {
    const dayInfo = DIA_SEMANA_MAP[diaSemana];
    if (!dayInfo) return null;

    const now = new Date();
    const sunday = new Date(now);
    sunday.setHours(0, 0, 0, 0);
    sunday.setDate(now.getDate() - now.getDay());

    const eventDate = new Date(sunday);
    eventDate.setDate(sunday.getDate() + dayInfo.jsDay);
    return eventDate;
  };

  const formatMonth = (date) =>
    new Intl.DateTimeFormat('pt-BR', { month: 'short' })
      .format(date)
      .replace('.', '')
      .toUpperCase();

  const sortEventos = (eventos) =>
    [...eventos].sort((a, b) => {
      const dayA = Number(a?.dia_semana) || 99;
      const dayB = Number(b?.dia_semana) || 99;
      if (dayA !== dayB) return dayA - dayB;

      const timeA = parseTimeToMinutes(a?.hora_inicio);
      const timeB = parseTimeToMinutes(b?.hora_inicio);
      if (timeA !== timeB) return timeA - timeB;

      return toText(a?.id).localeCompare(toText(b?.id));
    });

  const isVisible = (value) => {
    if (value === undefined || value === null || toText(value) === '') return true;
    if (typeof value === 'boolean') return value;
    const normalized = toText(value).toLowerCase();
    return !['0', 'false', 'nao', 'não', 'n', 'off'].includes(normalized);
  };

  const normalizeWeekEvents = (rawEventos) => {
    const eventos = sortEventos(rawEventos).filter((item) => {
      const day = Number(item?.dia_semana);
      return DIA_SEMANA_MAP[day] && isVisible(item?.visivel);
    });

    const grouped = new Map();
    WEEK_DAYS.forEach((day) => grouped.set(day, []));
    eventos.forEach((item) => grouped.get(Number(item.dia_semana)).push(item));

    return WEEK_DAYS.map((day) => {
      const list = grouped.get(day);
      if (!list || !list.length) {
        return {
          id: `sem-eventos-${day}`,
          dia_semana: day,
          titulo: 'Sem eventos',
          descricao: 'Nenhum evento cadastrado para este dia.',
          local: '',
          link: '',
          hora_inicio: '',
          hora_fim: '',
          _isPlaceholder: true,
        };
      }

      const primary = { ...list[0], dia_semana: day };
      if (list.length > 1) {
        const extra = list.length - 1;
        const suffix = extra === 1 ? '(+1 evento)' : `(+${extra} eventos)`;
        const baseDescription = toText(primary.descricao);
        primary.descricao = baseDescription ? `${baseDescription} ${suffix}` : suffix;
      }

      return primary;
    });
  };

  const writeMetaText = (wrapper, value) => {
    if (!wrapper) return;
    const text = toText(value);
    if (!text) {
      setVisible(wrapper, false);
      return;
    }

    const textTarget = wrapper.querySelector('[data-evento-texto]');
    if (textTarget) {
      textTarget.textContent = text;
      setVisible(wrapper, true);
      return;
    }

    const icon = wrapper.querySelector('svg, i, img');
    const iconClone = icon ? icon.cloneNode(true) : null;

    wrapper.textContent = '';
    if (iconClone) {
      wrapper.appendChild(iconClone);
      wrapper.appendChild(document.createTextNode(' '));
    }
    wrapper.appendChild(document.createTextNode(text));
    setVisible(wrapper, true);
  };

  const writeLink = (wrapper, rawUrl) => {
    if (!wrapper) return;
    const url = toText(rawUrl);
    if (!url) {
      setVisible(wrapper, false);
      return;
    }

    let anchor = wrapper;
    if (wrapper.tagName !== 'A') {
      anchor = wrapper.querySelector('a');
      if (!anchor) {
        anchor = document.createElement('a');
        wrapper.appendChild(anchor);
      }
    }

    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';

    if (!toText(anchor.textContent)) {
      const icon = anchor.querySelector('svg, i, img');
      const iconClone = icon ? icon.cloneNode(true) : null;
      anchor.textContent = '';
      if (iconClone) {
        anchor.appendChild(iconClone);
        anchor.appendChild(document.createTextNode(' '));
      }
      anchor.appendChild(document.createTextNode('Link do Evento'));
    }

    setVisible(wrapper, true);
  };

  const resolveMetaFields = (card) => {
    const metaContainer = card.querySelector(SELECTORS.meta);
    const metaChildren = metaContainer ? Array.from(metaContainer.children) : [];

    return {
      timeWrap: card.querySelector(SELECTORS.timeWrap) || metaChildren[0] || null,
      localWrap: card.querySelector(SELECTORS.localWrap) || metaChildren[1] || null,
      linkWrap: card.querySelector(SELECTORS.linkWrap) || metaChildren[2] || null,
    };
  };

  const renderCard = (card, evento) => {
    const diaSemana = Number(evento?.dia_semana);
    const dayInfo = DIA_SEMANA_MAP[diaSemana];
    const eventDate = getDateInCurrentWeek(diaSemana);

    const dateBox = card.querySelector(SELECTORS.dateBox) || card.firstElementChild;
    const spans = dateBox ? dateBox.querySelectorAll('span') : [];

    const dayNumberEl = card.querySelector(SELECTORS.dayNumber) || spans[0] || null;
    const dayLabelEl = card.querySelector(SELECTORS.dayLabel) || spans[1] || null;
    const dayNameEl = card.querySelector(SELECTORS.dayName);

    if (eventDate) {
      setText(dayNumberEl, String(eventDate.getDate()).padStart(2, '0'), false);
      setText(dayLabelEl, formatMonth(eventDate), false);
    }
    setText(dayNameEl, dayInfo ? dayInfo.nome : '');

    setText(card.querySelector(SELECTORS.title), toText(evento?.titulo) || 'Evento', false);
    setText(card.querySelector(SELECTORS.description), evento?.descricao);

    const { timeWrap, localWrap, linkWrap } = resolveMetaFields(card);
    const horaInicio = toText(evento?.hora_inicio);
    const horaFim = toText(evento?.hora_fim);
    const horario = horaInicio ? `${horaInicio}${horaFim ? ` - ${horaFim}` : ''}` : '';

    writeMetaText(timeWrap, horario);
    writeMetaText(localWrap, evento?.local);
    writeLink(linkWrap, evento?.link);
  };

  const renderEventos = (eventos) => {
    listEl.innerHTML = '';

    if (!eventos.length) {
      const emptyCard = templateCard.cloneNode(true);
      setText(emptyCard.querySelector(SELECTORS.title), 'Nenhum evento cadastrado', false);
      setText(
        emptyCard.querySelector(SELECTORS.description),
        'Atualize a planilha para publicar novos eventos.',
        false,
      );

      const { timeWrap, localWrap, linkWrap } = resolveMetaFields(emptyCard);
      setVisible(timeWrap, false);
      setVisible(localWrap, false);
      setVisible(linkWrap, false);

      listEl.appendChild(emptyCard);
      return;
    }

    eventos.forEach((evento) => {
      const card = templateCard.cloneNode(true);
      renderCard(card, evento);
      listEl.appendChild(card);
    });
  };

  const updateLastUpdate = () => {
    if (!lastUpdateEl) return;
    lastUpdateEl.textContent = `Atualizado em: ${new Date().toLocaleTimeString('pt-BR', {
      hour12: false,
    })}`;
  };

  const setLoadingState = (isLoading) => {
    if (!refreshButton) return;
    refreshButton.disabled = isLoading;
    refreshButton.setAttribute('aria-busy', String(isLoading));
    refreshButton.classList.toggle('is-loading', isLoading);

    if (refreshButton.dataset.generated === 'true') {
      refreshButton.textContent = isLoading ? 'Atualizando...' : 'Atualizar';
    }
  };

  const fetchEventos = async () => {
    const separator = API_URL.includes('?') ? '&' : '?';
    const requestUrl = `${API_URL}${separator}_=${Date.now()}`;
    const response = await fetch(requestUrl, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Falha HTTP ${response.status}`);
    }

    const payload = await response.json();
    const eventos = Array.isArray(payload?.eventos) ? payload.eventos : [];
    return normalizeWeekEvents(eventos);
  };

  const atualizarEventos = async () => {
    if (loading) return;

    loading = true;
    setLoadingState(true);

    try {
      const eventos = await fetchEventos();
      renderEventos(eventos);
      updateLastUpdate();
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      loading = false;
      setLoadingState(false);
    }
  };

  const ensureRefreshButton = () => {
    const existingButton = document.querySelector(SELECTORS.refreshButton);
    if (existingButton) return existingButton;

    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'btn-atualizar-eventos';
    button.textContent = 'Atualizar';
    button.dataset.generated = 'true';
    button.className =
      'px-4 py-2 mb-4 rounded-full border border-purple-500 text-purple-600 text-sm font-semibold';
    listEl.parentElement?.insertBefore(button, listEl);
    return button;
  };

  const init = () => {
    listEl = document.querySelector(SELECTORS.list);
    if (!listEl) {
      console.error('Nao foi possivel localizar a lista de eventos.');
      return;
    }

    const currentCard = listEl.querySelector(SELECTORS.card) || listEl.firstElementChild;
    if (!currentCard) {
      console.error('Nao foi possivel localizar um card modelo na lista de eventos.');
      return;
    }

    templateCard = currentCard.cloneNode(true);
    refreshButton = ensureRefreshButton();
    lastUpdateEl = document.querySelector(SELECTORS.lastUpdate);

    refreshButton.addEventListener('click', atualizarEventos);
    atualizarEventos();
    window.setInterval(atualizarEventos, REFRESH_INTERVAL_MS);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
