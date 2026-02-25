import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Event } from '../types';

interface CalendarViewProps {
  events: Event[];
  isDark: boolean;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  events, 
  isDark, 
  selectedDate, 
  onSelectDate 
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

export default CalendarView;
