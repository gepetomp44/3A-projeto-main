import React from 'react';

export type Tab = 'inicio' | 'eventos' | 'calendario' | 'ajuda' | 'plataformas';

export interface Event {
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

export interface Resource {
  title: string;
  category: string;
  icon: React.ReactNode;
  links: { name: string; url: string }[];
}

export interface ScheduleItem {
  time: string;
  subject: string;
  isBreak?: boolean;
}
