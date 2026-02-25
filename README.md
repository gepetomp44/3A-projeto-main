![Capa do projeto](capa.png)

## Eventos via Google Sheets

1. Publique um Apps Script que retorne JSON no formato:
   ```json
   {
     "gerado_em": "2026-02-25T08:53:17.035Z",
     "eventos": [
       {
         "id": 1,
         "dia_semana": 1,
         "titulo": "Sem aula",
         "descricao": "Semana comecando",
         "hora_inicio": "07:10",
         "hora_fim": "12:30",
         "local": "Sala 3A",
         "link": "",
         "evento": true
       }
     ]
   }
   ```
2. Configure `VITE_EVENTS_API_URL` para o endpoint do Apps Script.
3. Para deploy no GitHub Pages, defina `Settings > Secrets and variables > Actions > Variables`:
   - `VITE_EVENTS_API_URL=https://script.google.com/macros/s/SEU_DEPLOY_ID/exec`

### Filtro de exibicao

- A aplicacao mostra somente linhas com evento ativo (`true`, `1`, `on`).
- Colunas aceitas para o status: `evento`, `tem_evento`, `ativo`, `visivel` ou `exibir`.
- Linhas com `false`, `0`, `off`, `nao` ou vazias nessas colunas nao aparecem na tabela.
