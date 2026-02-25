import React from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Event } from '../../types';
import CalendarView from '../CalendarView';
import Countdown from '../Countdown';
import { WEEKLY_SCHEDULE } from '../../constants';

interface CalendarioTabProps {
  isDark: boolean;
  events: Event[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const CalendarioTab: React.FC<CalendarioTabProps> = ({ isDark, events, selectedDate, setSelectedDate }) => {
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
                const dayMap: Record<number, string> = {
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
};

export default CalendarioTab;
