import React from 'react';
import { BookOpen, Calculator } from 'lucide-react';
import { Event, Resource, ScheduleItem } from './types';

export const EVENTS: Event[] = [
  { id: '1', title: 'Volta as aulas', date: '2026-02-24', type: 'evento', description: 'Lembrando que teremos o rodízio ainda.' },
  { id: '2', title: 'Aula normal', date: '2026-02-25', type: 'evento', description: 'Dia de aula regular.' },
  { id: '3', title: 'Aula normal / Trote de Carnaval', date: '2026-02-26', type: 'evento', description: 'Primeiro trote oficial do Terceirão.' },
  { id: '4', title: 'Aula normal', date: '2026-02-27', type: 'evento', description: 'Dia de aula regular.' },
  { id: '5', title: 'Aula online', date: '2026-02-28', type: 'evento', description: 'Entre no sala do futuro para ver se temos lições upadas.' },
  { id: '6', title: 'Baile de Formatura', date: '2026-12-18', type: 'evento', description: 'A noite mais esperada do ano. (Data indefinida por enquanto)' },
];

export const RESOURCES: Resource[] = [
  {
    title: 'Livros & Apostilas',
    category: 'Material Didático',
    icon: React.createElement(BookOpen, { className: "w-6 h-6" }),
    links: [
      { name: 'Apostilas (Online)', url: 'https://crimsonzerohub.xyz/livrodoestudante?cmsphacks.xyz' }
    ]
  },
  {
    title: 'Tarefas & Automação',
    category: 'Produtividade',
    icon: React.createElement(Calculator, { className: "w-6 h-6" }),
    links: [
      { name: 'Tarefasp (Automático)', url: 'https://crimsonzerohub.xyz/tarefas' },
      { name: 'Sala do Futuro', url: 'https://saladofuturo.educacao.sp.gov.br/' }
    ]
  }
];

export const PLATFORMS = [
  { name: 'Sala de Aula Virtual', url: 'https://cmsp.educacao.sp.gov.br/', description: 'Centro de Mídias SP' },
  { name: 'Alura', url: 'https://www.alura.com.br/', description: 'Plataforma de cursos de tecnologia' },
  { name: 'SPeak', url: 'https://speak.educacao.sp.gov.br/', description: 'Plataforma de idiomas' },
  { name: 'Educação Profissional', url: 'https://educacaoprofissional.educacao.sp.gov.br/', description: 'Cursos técnicos e profissionalizantes' },
  { name: 'Prepara SP', url: 'https://preparasp.educacao.sp.gov.br/', description: 'Preparatório para o ENEM e vestibulares' },
  { name: 'Khan Academy', url: 'https://pt.khanacademy.org/', description: 'Aprendizado personalizado gratuito' },
  { name: 'São Paulo em Ação', url: 'https://saopauloemacao.educacao.sp.gov.br/', description: 'Programas educacionais de SP' },
  { name: 'LeiaSP', url: 'https://leiasp.educacao.sp.gov.br/', description: 'Plataforma de leitura digital' },
];

export const WEEKLY_SCHEDULE: Record<string, ScheduleItem[]> = {
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



