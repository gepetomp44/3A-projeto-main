import React from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Event } from '../../types';

interface EventosTabProps {
  isDark: boolean;
  events: Event[];
}

const EventosTab: React.FC<EventosTabProps> = ({ isDark, events }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>Nossos Eventos</h2>
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
      <div className="grid grid-cols-1 gap-4">
        {events.map((event) => (
          <div key={event.id} className={`group border p-4 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center gap-4 md:gap-6 transition-all hover:border-purple-600/50 ${
            isDark ? 'bg-purple-950/40 border-purple-900/30' : 'bg-white border-purple-100 shadow-sm'
          }`}>
            <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 bg-purple-600/10 rounded-xl flex flex-col items-center justify-center border border-purple-600/20">
              <span className="text-purple-500 font-bold text-lg md:text-xl">{event.date.split('-')[2]}</span>
              <span className="text-purple-400 text-[9px] md:text-[10px] uppercase font-bold">{format(new Date(event.date), 'MMM', { locale: ptBR })}</span>
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-1">
                <h3 className={`text-base md:text-lg font-bold group-hover:text-purple-400 transition-colors ${isDark ? 'text-white' : 'text-purple-900'}`}>{event.title}</h3>
              </div>
              <p className={`text-xs md:text-sm ${isDark ? 'text-purple-200/60' : 'text-purple-800/70'}`}>{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default EventosTab;
