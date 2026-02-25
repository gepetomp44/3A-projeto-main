/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  BookOpen, 
  Instagram, 
  MapPin, 
  Clock, 
  GraduationCap, 
  HelpCircle,
  ChevronRight,
  Github,
  Mail,
  Phone,
  Search,
  Menu,
  X,
  ExternalLink,
  Atom,
  Calculator,
  Microscope,
  Globe,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  format, 
  startOfYear, 
  endOfYear, 
  eachMonthOfInterval, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  parseISO
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

// --- Types ---

type Tab = 'inicio' | 'eventos' | 'calendario' | 'ajuda' | 'plataformas';

interface Event {
  id: string;
  title: string;
  date: string;
  type: 'prova' | 'trabalho' | 'evento' | 'feriado';
  description: string;
  local?: string;
  link?: string;
  hora_inicio?: string;
  hora_fim?: string;
}

interface Resource {
  title: string;
  category: string;
  icon: React.ReactNode;
  links: { name: string; url: string }[];
}

// --- Mock Data ---

const EVENTS: Event[] = [
  { id: '1', title: 'Volta as aulas', date: '2026-02-24', type: 'evento', description: 'Lembrando que teremos o rodízio ainda.' },
  { id: '2', title: 'Aula normal', date: '2026-02-25', type: 'evento', description: 'Dia de aula regular.' },
  { id: '3', title: 'Aula normal / Trote de Carnaval', date: '2026-02-26', type: 'evento', description: 'Primeiro trote oficial do Terceirão.' },
  { id: '4', title: 'Aula normal', date: '2026-02-27', type: 'evento', description: 'Dia de aula regular.' },
  { id: '5', title: 'Aula online', date: '2026-02-28', type: 'evento', description: 'Entre no sala do futuro para ver se temos lições upadas.' },
  { id: '6', title: 'Baile de Formatura', date: '2026-12-18', type: 'evento', description: 'A noite mais esperada do ano. (Data indefinida por enquanto)' },
];

const RESOURCES: Resource[] = [
  {
    title: 'Livros & Apostilas',
    category: 'Material Didático',
    icon: <BookOpen className="w-6 h-6" />,
    links: [
      { name: 'Apostilas (Online)', url: 'https://crimsonzerohub.xyz/livrodoestudante?cmsphacks.xyz' }
    ]
  },
  {
    title: 'Tarefas & Automação',
    category: 'Produtividade',
    icon: <Calculator className="w-6 h-6" />,
    links: [
      { name: 'Tarefasp (Automático)', url: 'https://crimsonzerohub.xyz/tarefas' },
      { name: 'Sala do Futuro', url: 'https://saladofuturo.educacao.sp.gov.br/' }
    ]
  }
];

const PLATFORMS = [
  { name: 'Sala de Aula Virtual', url: 'https://cmsp.educacao.sp.gov.br/', description: 'Centro de Mídias SP' },
  { name: 'Alura', url: 'https://www.alura.com.br/', description: 'Plataforma de cursos de tecnologia' },
  { name: 'SPeak', url: 'https://speak.educacao.sp.gov.br/', description: 'Plataforma de idiomas' },
  { name: 'Educação Profissional', url: 'https://educacaoprofissional.educacao.sp.gov.br/', description: 'Cursos técnicos e profissionalizantes' },
  { name: 'Prepara SP', url: 'https://preparasp.educacao.sp.gov.br/', description: 'Preparatório para o ENEM e vestibulares' },
  { name: 'Khan Academy', url: 'https://pt.khanacademy.org/', description: 'Aprendizado personalizado gratuito' },
  { name: 'São Paulo em Ação', url: 'https://saopauloemacao.educacao.sp.gov.br/', description: 'Programas educacionais de SP' },
  { name: 'LeiaSP', url: 'https://leiasp.educacao.sp.gov.br/', description: 'Plataforma de leitura digital' },
];

const WEEKLY_SCHEDULE = {
  'Segunda': [
    { time: '07:00 - 07:50', subject: 'Projeto Multidisciplinar' },
    { time: '07:50 - 08:40', subject: 'Matemática' },
    { time: '08:40 - 09:30', subject: 'Língua Portuguesa' },
    { time: '09:30 - 10:20', subject: 'Versionamento de Código e Sistemas de Mensageria' },
    { time: '10:20 - 10:40', subject: 'Intervalo', isBreak: true },
    { time: '10:40 - 11:30', subject: 'Versionamento de Código e Sistemas de Mensageria' },
    { time: '11:30 - 12:20', subject: 'Versionamento de Código e Sistemas de Mensageria' },
  ],
  'Terça': [
    { time: '07:00 - 07:50', subject: 'Programação Mobile' },
    { time: '07:50 - 08:40', subject: 'Programação Mobile' },
    { time: '08:40 - 09:30', subject: 'Programação Mobile' },
    { time: '09:30 - 10:20', subject: 'Programação Mobile' },
    { time: '10:20 - 10:40', subject: 'Intervalo', isBreak: true },
    { time: '10:40 - 11:30', subject: 'Programação Front-End' },
    { time: '11:30 - 12:20', subject: 'Educação Física' },
  ],
  'Quarta': [
    { time: '07:00 - 07:50', subject: 'Programação Back-End' },
    { time: '07:50 - 08:40', subject: 'Programação Back-End' },
    { time: '08:40 - 09:30', subject: 'Língua Portuguesa' },
    { time: '09:30 - 10:20', subject: 'Língua Portuguesa' },
    { time: '10:20 - 10:40', subject: 'Intervalo', isBreak: true },
    { time: '10:40 - 11:30', subject: 'Programação Front-End' },
    { time: '11:30 - 12:20', subject: 'Programação Front-End' },
  ],
  'Quinta': [
    { time: '07:00 - 07:50', subject: 'Projeto Integrador' },
    { time: '07:50 - 08:40', subject: 'Matemática' },
    { time: '08:40 - 09:30', subject: 'Matemática' },
    { time: '09:30 - 10:20', subject: 'Modelagem e Desenvolvimento de Banco de Dados' },
    { time: '10:20 - 10:40', subject: 'Intervalo', isBreak: true },
    { time: '10:40 - 11:30', subject: 'Modelagem e Desenvolvimento de Banco de Dados' },
    { time: '11:30 - 12:20', subject: 'Modelagem e Desenvolvimento de Banco de Dados' },
  ],
  'Sexta': [
    { time: '07:00 - 07:50', subject: 'Programação Back-End' },
    { time: '07:50 - 08:40', subject: 'Projeto Multidisciplinar' },
    { time: '08:40 - 09:30', subject: 'Modelagem e Desenvolvimento de Banco de Dados' },
    { time: '09:30 - 10:20', subject: 'Projeto Multidisciplinar' },
    { time: '10:20 - 10:40', subject: 'Intervalo', isBreak: true },
    { time: '10:40 - 11:30', subject: 'Projeto Integrador' },
    { time: '11:30 - 12:20', subject: 'Projeto Integrador' },
  ],
};

// --- Components ---

const Countdown = ({ isDark }: { isDark: boolean }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2026-11-01T00:00:00');
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-5 md:p-6 text-white shadow-xl">
      <h3 className="font-bold mb-1 md:mb-2 text-sm md:text-base">Contagem Regressiva</h3>
      <p className="text-purple-100 text-xs md:text-sm mb-4">Faltam {timeLeft.days} dias para o ENEM 2026</p>
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Dias', val: timeLeft.days.toString() },
          { label: 'Hrs', val: timeLeft.hours.toString().padStart(2, '0') },
          { label: 'Min', val: timeLeft.minutes.toString().padStart(2, '0') },
          { label: 'Seg', val: timeLeft.seconds.toString().padStart(2, '0') },
        ].map(t => (
          <div key={t.label} className="bg-black/20 rounded-lg p-2 text-center">
            <div className="text-base md:text-lg font-bold leading-none">{t.val}</div>
            <div className="text-[9px] md:text-[10px] opacity-60 uppercase mt-1">{t.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const useData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://script.google.com/macros/s/AKfycby8G0CUQ4tI-q7nrdB-9AXO90dxKSfyGJrfHc6Gd-xgXl-1M-hWmnowROFpEni4Rt1d/exec');
      const data = await response.json();
      
      if (data && data.eventos) {
        const now = new Date();
        const weekStart = startOfWeek(now, { weekStartsOn: 0 });

        const mappedEvents: Event[] = data.eventos.map((e: any) => {
          // Map dia_semana to date in current week
          // 1=Sábado, 2=Domingo, 3=Segunda, 4=Terça, 5=Quarta, 6=Quinta, 7=Sexta
          const offset = (e.dia_semana + 5) % 7;
          const eventDate = new Date(weekStart);
          eventDate.setDate(weekStart.getDate() + offset);

          return {
            id: e.id.toString(),
            title: e.titulo,
            date: format(eventDate, 'yyyy-MM-dd'),
            type: 'evento',
            description: e.descricao,
            local: e.local,
            link: e.link,
            hora_inicio: e.hora_inicio,
            hora_fim: e.hora_fim
          };
        });

        // Sort by dia_semana and hora_inicio
        mappedEvents.sort((a, b) => {
          const dayA = data.eventos.find((ev: any) => ev.id.toString() === a.id).dia_semana;
          const dayB = data.eventos.find((ev: any) => ev.id.toString() === b.id).dia_semana;
          
          // Adjust dia_semana for sorting (Sun=0, Mon=1, ..., Sat=6)
          const sortA = (dayA + 5) % 7;
          const sortB = (dayB + 5) % 7;
          
          if (sortA !== sortB) return sortA - sortB;
          return (a.hora_inicio || '').localeCompare(b.hora_inicio || '');
        });

        setEvents(mappedEvents);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Auto update every 60s
    return () => clearInterval(interval);
  }, []);

  return { events, loading, lastUpdate, refresh: fetchData };
};

const Navbar = ({ activeTab, setActiveTab, isDark, toggleTheme }: { 
  activeTab: Tab, 
  setActiveTab: (t: Tab) => void,
  isDark: boolean,
  toggleTheme: () => void
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'inicio', label: 'Início', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'eventos', label: 'Eventos', icon: <Clock className="w-4 h-4" /> },
    { id: 'calendario', label: 'Calendário', icon: <CalendarIcon className="w-4 h-4" /> },
    { id: 'plataformas', label: 'Plataformas', icon: <Globe className="w-4 h-4" /> },
    { id: 'ajuda', label: 'Ajuda/Estudos', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-500 ${
      isDark ? 'bg-purple-950/80 border-purple-900/50' : 'bg-white/80 border-purple-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-9 h-9 md:w-11 md:h-11 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-900/40">
              <span className="text-white font-bold text-lg md:text-2xl">3A</span>
            </div>
            <span className={`font-bold tracking-tight hidden sm:block text-sm md:text-base ${isDark ? 'text-white' : 'text-purple-900'}`}>Portal da Turma</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
                    : isDark 
                      ? 'text-purple-200 hover:bg-purple-900/50 hover:text-white'
                      : 'text-purple-700 hover:bg-purple-50 hover:text-purple-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
            <div className={`w-px h-6 mx-2 ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`} />
            <a
              href="https://www.instagram.com/3a_2k26jr/"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                isDark 
                  ? 'text-purple-200 hover:bg-purple-900/50 hover:text-white'
                  : 'text-purple-700 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </a>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all ${
                isDark 
                  ? 'text-purple-200 hover:bg-purple-900/50 hover:text-white'
                  : 'text-purple-700 hover:bg-purple-50 hover:text-purple-900'
              }`}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all ${isDark ? 'text-purple-200' : 'text-purple-700'}`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 transition-all rounded-lg ${isDark ? 'text-purple-200 hover:bg-purple-900/50' : 'text-purple-700 hover:bg-purple-50'}`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`md:hidden border-b transition-colors duration-500 shadow-xl ${isDark ? 'bg-purple-950 border-purple-900' : 'bg-white border-purple-100'}`}
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-4 w-full px-4 py-4 rounded-xl text-base font-semibold transition-all ${
                    activeTab === tab.id 
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' 
                      : isDark ? 'text-purple-200 hover:bg-purple-900/50' : 'text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === tab.id ? 'bg-white/20' : isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                    {tab.icon}
                  </div>
                  {tab.label}
                </button>
              ))}
              <div className={`h-px w-full my-4 ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`} />
              <a
                href="https://www.instagram.com/3a_2k26jr/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 w-full px-4 py-4 rounded-xl text-base font-semibold transition-all ${
                  isDark ? 'text-purple-200 hover:bg-purple-900/50' : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                  <Instagram className="w-5 h-5" />
                </div>
                Instagram
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const CalendarView = ({ 
  events, 
  isDark, 
  selectedDate, 
  onSelectDate 
}: { 
  events: Event[], 
  isDark: boolean,
  selectedDate: Date,
  onSelectDate: (date: Date) => void
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  const prevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));

  return (
    <div className={`border rounded-2xl p-4 md:p-6 backdrop-blur-sm transition-all duration-500 ${
      isDark ? 'bg-purple-900/10 border-purple-900/30' : 'bg-purple-50/50 border-purple-100'
    }`}>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h3 className={`text-xl md:text-2xl font-bold capitalize ${isDark ? 'text-white' : 'text-purple-900'}`}>
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        <div className="flex gap-1 md:gap-2">
          <button onClick={prevMonth} className={`p-1.5 md:p-2 rounded-full transition-colors ${isDark ? 'hover:bg-purple-800/30 text-white' : 'hover:bg-purple-100 text-purple-600'}`}>
            <ChevronRight className="rotate-180 w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button onClick={nextMonth} className={`p-1.5 md:p-2 rounded-full transition-colors ${isDark ? 'hover:bg-purple-800/30 text-white' : 'hover:bg-purple-100 text-purple-600'}`}>
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
          <div key={i} className={`text-center text-[10px] md:text-xs font-bold uppercase tracking-wider ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {days.map(day => {
          const hasEvent = events.some(e => e.date === format(day, 'yyyy-MM-dd'));
          const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
          
          return (
            <button 
              key={day.toString()} 
              onClick={() => onSelectDate(day)}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg md:rounded-xl border transition-all relative
                ${isSelected 
                  ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20 scale-105 z-10' 
                  : isToday(day)
                    ? 'bg-purple-900/20 border-purple-600/50 text-purple-100'
                    : isDark 
                      ? 'bg-purple-950/40 border-purple-900/30 text-purple-100 hover:border-purple-600/50'
                      : 'bg-white border-purple-100 text-purple-900 hover:border-purple-400'}
              `}
            >
              <span className="text-xs md:text-sm font-medium">{format(day, 'd')}</span>
              {hasEvent && (
                <div className={`absolute bottom-1 md:bottom-1.5 w-0.5 md:w-1 h-0.5 md:h-1 rounded-full shadow-[0_0_8px_white] ${isSelected || isDark ? 'bg-white' : 'bg-purple-600'}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const Footer = ({ isDark }: { isDark: boolean }) => (
  <footer className={`relative z-10 border-t pt-12 md:pt-16 pb-8 mt-12 md:mt-20 transition-all duration-500 ${
    isDark ? 'bg-purple-950/40 backdrop-blur-xl border-purple-900/30' : 'bg-purple-50/80 backdrop-blur-md border-purple-100'
  }`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-purple-600 rounded flex items-center justify-center shadow-lg shadow-purple-900/40">
              <span className="text-white font-bold text-lg md:text-xl">3A</span>
            </div>
            <span className={`font-bold tracking-tight ${isDark ? 'text-white' : 'text-purple-900'}`}>Portal da Turma</span>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className={`font-bold text-xs md:text-sm mb-2 uppercase tracking-wider ${isDark ? 'text-white' : 'text-purple-900'}`}>Alunos</h4>
              <p className={`text-[10px] md:text-xs leading-relaxed ${isDark ? 'text-purple-200/60' : 'text-purple-800/70'}`}>
                Lucas Andrade • Mariana Silva • Pedro Henrique • Ana Beatriz • João Victor • Isabella Rocha • Gabriel Souza • Fernanda Lima • Rafael Costa • Letícia Martins
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center md:text-left">
          <h4 className={`font-bold mb-4 md:mb-6 flex items-center justify-center md:justify-start gap-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>
            <MapPin className="w-4 h-4 text-purple-500" />
            Localização
          </h4>
          <p className={`text-xs md:text-sm mb-4 ${isDark ? 'text-purple-300/70' : 'text-purple-800/70'}`}>
            Alameda da Saudade nº30, Sala 1<br />
            Cidade Escolar - SP
          </p>
          <div className={`w-full h-40 md:h-48 rounded-xl overflow-hidden border grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500 ${
            isDark ? 'border-purple-900/50' : 'border-purple-200'
          }`}>
            <iframe 
              src="https://maps.google.com/maps?q=Alameda%20da%20Saudade%20n%C2%BA30%2C%20Sala%201%2C%20Cidade%20Escolar%20-%20SP&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div className="text-center md:text-left">
          <h4 className={`font-bold mb-4 md:mb-6 ${isDark ? 'text-white' : 'text-purple-900'}`}>Social</h4>
          <div className="flex justify-center md:justify-start">
            <a href="https://www.instagram.com/3a_2k26jr/" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 transition-colors ${
              isDark ? 'text-purple-300/70 hover:text-white' : 'text-purple-700 hover:text-purple-900'
            }`}>
              <Instagram className="w-5 h-5" />
              <span className="text-sm md:text-base">@3a_2k26jr</span>
            </a>
          </div>
        </div>
      </div>
      
      <div className={`border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 ${isDark ? 'border-purple-900/30' : 'border-purple-100'}`}>
        <p className={`text-[10px] md:text-xs text-center md:text-left ${isDark ? 'text-purple-400/50' : 'text-purple-600/50'}`}>
          © 2026 Terceirão - Todos os direitos reservados.
        </p>
        <div className="flex gap-4 md:gap-6">
          <a href="#" className={`text-[10px] md:text-xs transition-colors ${isDark ? 'text-purple-400/50 hover:text-purple-300' : 'text-purple-600/50 hover:text-purple-900'}`}>Privacidade</a>
          <a href="#" className={`text-[10px] md:text-xs transition-colors ${isDark ? 'text-purple-400/50 hover:text-purple-300' : 'text-purple-600/50 hover:text-purple-900'}`}>Termos de Uso</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('inicio');
  const [isDark, setIsDark] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { events, loading, lastUpdate, refresh } = useData();

  const toggleTheme = () => setIsDark(!isDark);

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 md:space-y-12"
          >
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-purple-900 p-6 md:p-16 shadow-2xl shadow-purple-950/50">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl md:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">
                  Bem-vindos ao <br />
                  <span className="text-purple-200">Terceirão 3A</span>
                </h2>
                <p className="text-purple-100 text-base md:text-xl mb-6 md:mb-8 leading-relaxed opacity-90">
                  O ano mais importante das nossas vidas começou. Aqui você encontra tudo o que precisa para se organizar e brilhar no ENEM e vestibulares.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => setActiveTab('calendario')}
                    className="w-full sm:w-auto bg-white text-purple-700 px-8 py-3 rounded-full font-bold hover:bg-purple-50 transition-all shadow-lg text-center"
                  >
                    Ver Cronograma
                  </button>
                  <button 
                    onClick={() => setActiveTab('ajuda')}
                    className="w-full sm:w-auto bg-purple-800/40 backdrop-blur-md text-white border border-purple-400/30 px-8 py-3 rounded-full font-bold hover:bg-purple-800/60 transition-all text-center"
                  >
                    Material de Estudo
                  </button>
                </div>
              </div>
              {/* Abstract shapes */}
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 right-10 w-32 h-32 md:w-64 md:h-64 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-20 w-24 h-24 md:w-48 md:h-48 bg-purple-400 rounded-full blur-2xl" />
              </div>
            </section>

            <section className={`border rounded-3xl p-6 md:p-12 transition-all duration-500 ${
              isDark ? 'bg-purple-950/20 border-purple-900/30' : 'bg-purple-50/50 border-purple-100'
            }`}>
              <h3 className={`text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>
                <HelpCircle className="text-purple-500 w-5 h-5 md:w-6 md:h-6" />
                Saiba Mais
              </h3>
              <div className={`prose prose-sm md:prose-invert max-w-none leading-relaxed space-y-4 ${isDark ? 'text-purple-100/80' : 'text-purple-900/80'}`}>
                <p>
                  O site do nosso Terceirão foi criado com o objetivo de ser um espaço especial para compartilhar informações sobre a nossa turma. Aqui você vai encontrar conteúdos que mostram quem somos, nossas conquistas, projetos e momentos marcantes dessa fase tão importante da nossa vida escolar.
                </p>
                <p>
                  Mais do que um simples site, ele é um registro da nossa história, feito para aproximar colegas, professores, familiares e todos que fazem parte dessa jornada.
                </p>
                <p className={`pt-4 border-t ${isDark ? 'border-purple-900/30' : 'border-purple-100'}`}>
                  E por trás dessa ideia estão os nossos desenvolvedores: <span className={`font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>Cayo e Carlos</span>. Eles são os responsáveis por dar vida ao projeto, cuidando de cada detalhe para que o site seja funcional, bonito e cheio de personalidade. Graças ao trabalho deles, conseguimos transformar nossa turma em uma presença digital que representa quem somos.
                </p>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className={`border p-6 md:p-8 rounded-2xl backdrop-blur-sm transition-all duration-500 ${
                isDark ? 'bg-purple-950/40 border-purple-900/50' : 'bg-white border-purple-100 shadow-sm'
              }`}>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4 md:mb-6">
                  <Clock className="text-purple-500 w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className={`text-lg md:text-xl font-bold mb-2 md:mb-4 ${isDark ? 'text-white' : 'text-purple-900'}`}>Aulas</h3>
                <p className={`text-sm md:text-base mb-2 ${isDark ? 'text-purple-200/70' : 'text-purple-800/70'}`}>Confira o cronograma diário na aba Calendário.</p>
                <p className="text-purple-500 font-mono text-xs md:text-sm">Foco nos estudos!</p>
              </div>
              <div className={`border p-6 md:p-8 rounded-2xl backdrop-blur-sm transition-all duration-500 ${
                isDark ? 'bg-purple-950/40 border-purple-900/50' : 'bg-white border-purple-100 shadow-sm'
              }`}>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4 md:mb-6">
                  <CalendarIcon className="text-purple-500 w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className={`text-lg md:text-xl font-bold mb-2 md:mb-4 ${isDark ? 'text-white' : 'text-purple-900'}`}>Próximo Evento</h3>
                <p className={`text-sm md:text-base mb-2 ${isDark ? 'text-purple-200/70' : 'text-purple-800/70'}`}>{events.length > 0 ? events[0].title : 'Carregando...'}</p>
                <p className="text-purple-500 font-mono text-xs md:text-sm">{events.length > 0 ? format(new Date(events[0].date), 'dd/MM/yyyy') : ''}</p>
              </div>
            </div>
          </motion.div>
        );
      case 'eventos':
        const now = new Date();
        const weekStart = startOfWeek(now, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(now, { weekStartsOn: 0 });

        const weeklyEvents = events.filter((event) => {
          const eventDate = parseISO(event.date);
          return isWithinInterval(eventDate, { start: weekStart, end: weekEnd });
        });

        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>Eventos da Semana</h2>
                <p className={`text-sm mt-1 ${isDark ? 'text-purple-400/70' : 'text-purple-600/70'}`}>
                  Mostrando compromissos de {format(weekStart, "dd 'de' MMM", { locale: ptBR })} até {format(weekEnd, "dd 'de' MMM", { locale: ptBR })}
                </p>
                {lastUpdate && (
                  <p className={`text-[10px] mt-1 opacity-50 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                    Atualizado em: {format(lastUpdate, 'HH:mm:ss')}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={refresh}
                  disabled={loading}
                  className={`p-2 rounded-full transition-all ${
                    loading ? 'animate-spin opacity-50' : 'hover:bg-purple-500/20'
                  } ${isDark ? 'text-purple-400' : 'text-purple-600'}`}
                  title="Atualizar agora"
                >
                  <Clock className="w-5 h-5" />
                </button>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500" />
                  <input 
                    type="text" 
                    placeholder="Buscar evento..." 
                    className={`w-full border rounded-full py-2 pl-10 pr-4 text-sm transition-all focus:outline-none focus:border-purple-500 ${
                      isDark ? 'bg-purple-950/40 border-purple-900/50 text-white' : 'bg-white border-purple-200 text-purple-900'
                    }`}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {loading && events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className={isDark ? 'text-purple-400' : 'text-purple-600'}>Buscando eventos...</p>
                </div>
              ) : weeklyEvents.length > 0 ? (
                weeklyEvents.map((event: any) => (
                  <div key={event.id} className={`group border p-4 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center gap-4 md:gap-6 transition-all hover:border-purple-600/50 ${
                    isDark ? 'bg-purple-950/40 border-purple-900/30' : 'bg-white border-purple-100 shadow-sm'
                  }`}>
                    <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 bg-purple-600/10 rounded-xl flex flex-col items-center justify-center border border-purple-600/20">
                      <span className="text-purple-500 font-bold text-lg md:text-xl">{event.date.split('-')[2]}</span>
                      <span className="text-purple-400 text-[9px] md:text-[10px] uppercase font-bold">{format(parseISO(event.date), 'MMM', { locale: ptBR })}</span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`text-base md:text-lg font-bold group-hover:text-purple-400 transition-colors ${isDark ? 'text-white' : 'text-purple-900'}`}>{event.title}</h3>
                      </div>
                      <p className={`text-xs md:text-sm mb-2 ${isDark ? 'text-purple-200/60' : 'text-purple-800/70'}`}>{event.description}</p>
                      
                      <div className="flex flex-wrap gap-3">
                        {event.hora_inicio && (
                          <div className={`flex items-center gap-1.5 text-[10px] md:text-xs ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                            <Clock className="w-3 h-3" />
                            {event.hora_inicio} {event.hora_fim ? `- ${event.hora_fim}` : ''}
                          </div>
                        )}
                        {event.local && (
                          <div className={`flex items-center gap-1.5 text-[10px] md:text-xs ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                            <MapPin className="w-3 h-3" />
                            {event.local}
                          </div>
                        )}
                        {event.link && (
                          <a 
                            href={event.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[10px] md:text-xs text-purple-500 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Link do Evento
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`text-center py-12 border-2 border-dashed rounded-3xl ${isDark ? 'border-purple-900/30 text-purple-400/50' : 'border-purple-100 text-purple-600/50'}`}>
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">Nenhum evento programado para esta semana.</p>
                  <p className="text-sm">Aproveite para descansar ou adiantar os estudos!</p>
                </div>
              )}
            </div>
          </motion.div>
        );
      case 'calendario':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>Cronograma Anual</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                <CalendarView 
                  events={events} 
                  isDark={isDark} 
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
                
                <div className={`border rounded-2xl p-5 md:p-6 transition-all duration-500 ${
                  isDark ? 'bg-purple-950/40 border-purple-900/30' : 'bg-white border-purple-100 shadow-sm'
                }`}>
                  <h3 className={`font-bold mb-4 flex items-center gap-2 text-sm md:text-base ${isDark ? 'text-white' : 'text-purple-900'}`}>
                    <CalendarIcon className="w-4 h-4 text-purple-500" />
                    Eventos em {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                  </h3>
                  <div className="space-y-3 md:space-y-4">
                    {events.filter(e => e.date === format(selectedDate, 'yyyy-MM-dd')).length > 0 ? (
                      events.filter(e => e.date === format(selectedDate, 'yyyy-MM-dd')).map(event => (
                        <div key={event.id} className={`p-3 md:p-4 rounded-xl ${isDark ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
                          <h4 className={`font-bold text-sm md:text-base ${isDark ? 'text-white' : 'text-purple-900'}`}>{event.title}</h4>
                          <p className={`text-xs md:text-sm ${isDark ? 'text-purple-200/70' : 'text-purple-800/70'}`}>{event.description}</p>
                        </div>
                      ))
                    ) : (
                      <p className={`text-xs md:text-sm italic ${isDark ? 'text-purple-400/50' : 'text-purple-600/50'}`}>Nenhum evento para este dia.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className={`border rounded-2xl p-5 md:p-6 transition-all duration-500 ${
                  isDark ? 'bg-purple-950/40 border-purple-900/30' : 'bg-white border-purple-100 shadow-sm'
                }`}>
                  <h3 className={`font-bold mb-4 flex items-center gap-2 text-sm md:text-base ${isDark ? 'text-white' : 'text-purple-900'}`}>
                    <Clock className="w-4 h-4 text-purple-500" />
                    Horário de Aula
                  </h3>
                  <div className="space-y-4 md:space-y-6">
                    {(() => {
                      const dayIndex = selectedDate.getDay();
                      const dayMap: Record<number, keyof typeof WEEKLY_SCHEDULE> = {
                        1: 'Segunda',
                        2: 'Terça',
                        3: 'Quarta',
                        4: 'Quinta',
                        5: 'Sexta'
                      };
                      const dayName = dayMap[dayIndex];
                      const schedule = dayName ? WEEKLY_SCHEDULE[dayName] : null;

                      if (!schedule) {
                        return (
                          <div className={`p-4 md:p-6 rounded-xl text-center ${isDark ? 'bg-purple-900/10 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                            <p className="font-bold text-sm md:text-base">Sem aulas</p>
                            <p className="text-xs md:text-sm opacity-70">Não há aulas programadas para este dia.</p>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-2">
                          <h4 className={`text-xs md:text-sm font-bold uppercase tracking-wider ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                            {isToday(selectedDate) ? 'Hoje' : dayName}
                          </h4>
                          <div className="space-y-2">
                            {schedule.map((item, i) => (
                              <div key={i} className={`flex justify-between items-center p-2.5 md:p-3 rounded-lg transition-all ${
                                item.isBreak 
                                  ? isDark ? 'bg-purple-600/10 text-purple-400' : 'bg-purple-50 text-purple-600'
                                  : isDark ? 'bg-purple-900/20 text-purple-100' : 'bg-purple-50/50 text-purple-900'
                              }`}>
                                <span className="text-[10px] md:text-xs font-mono">{item.time}</span>
                                <span className="text-xs md:text-sm font-bold text-right ml-2 md:ml-4">{item.subject}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <Countdown isDark={isDark} />
              </div>
            </div>
          </motion.div>
        );
      case 'plataformas':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            <div className="text-center max-w-2xl mx-auto">
              <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-purple-900'}`}>Plataformas de Aprendizagem</h2>
              <p className={isDark ? 'text-purple-200/70' : 'text-purple-800/70'}>
                Acesse as ferramentas digitais que complementam seu aprendizado diário.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PLATFORMS.map((platform, i) => (
                <a 
                  key={i}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group p-6 rounded-2xl border transition-all hover:scale-[1.02] ${
                    isDark 
                      ? 'bg-purple-950/40 border-purple-900/30 hover:bg-purple-900/20 hover:border-purple-600' 
                      : 'bg-white border-purple-100 shadow-sm hover:border-purple-400 hover:shadow-md'
                  }`}
                >
                  <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-500 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>{platform.name}</h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-purple-200/60' : 'text-purple-800/70'}`}>
                    {platform.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-purple-500 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all">
                    Acessar <ExternalLink className="w-3 h-3" />
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        );
      case 'ajuda':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            <div className="text-center max-w-2xl mx-auto">
              <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-purple-900'}`}>Ajudas para os alunos</h2>
              <p className={isDark ? 'text-purple-200/70' : 'text-purple-800/70'}>
                Recursos essenciais para facilitar sua rotina escolar e estudos.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {RESOURCES.map((res, i) => (
                <div key={i} className={`border rounded-2xl p-8 transition-all hover:bg-purple-900/20 ${
                  isDark ? 'bg-purple-950/40 border-purple-900/30' : 'bg-white border-purple-100 shadow-sm'
                }`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-purple-600/20 rounded-2xl flex items-center justify-center text-purple-500">
                      {res.icon}
                    </div>
                    <div>
                      <span className="text-purple-500 text-[10px] font-bold uppercase tracking-widest">{res.category}</span>
                      <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>{res.title}</h3>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {res.links.map((link, j) => (
                      <a 
                        key={j} 
                        href={link.url} 
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all group ${
                          isDark 
                            ? 'bg-purple-950/60 border-purple-900/50 text-purple-100 hover:border-purple-50 hover:bg-purple-900/40' 
                            : 'bg-purple-50/50 border-purple-100 text-purple-900 hover:border-purple-400 hover:bg-purple-50'
                        }`}
                      >
                        <span className="font-medium">{link.name}</span>
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-purple-600 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-purple-950/50">
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-3xl font-bold text-white mb-4">Precisa de ajuda extra?</h3>
                <p className="text-purple-100 mb-0 opacity-90">
                  Nosso grupo está disponível para tirar dúvidas e compartilhar avisos importantes.
                </p>
              </div>
              <button className="flex-shrink-0 bg-white text-purple-600 px-8 py-4 rounded-full font-black hover:scale-105 transition-transform shadow-xl">
                ENTRAR NO NOSSO GRUPO
              </button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 selection:bg-purple-500 selection:text-white font-sans ${isDark ? 'bg-[#0a0505] text-white' : 'bg-white text-gray-900'}`}>
      {/* Background Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b ${isDark ? 'from-purple-950/30 via-[#0a0505] to-[#0a0505]' : 'from-purple-100/50 via-white to-white'}`} />
        <div className={`absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px] ${isDark ? 'bg-purple-900/20' : 'bg-purple-200/30'}`} />
        <div className={`absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[100px] ${isDark ? 'bg-purple-950/10' : 'bg-purple-100/20'}`} />
      </div>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isDark={isDark} toggleTheme={toggleTheme} />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <div key={activeTab}>
            {renderContent()}
          </div>
        </AnimatePresence>
      </main>

      <Footer isDark={isDark} />
    </div>
  );
}



