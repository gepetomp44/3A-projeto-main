import React, { useState, useEffect } from 'react';

interface CountdownProps {
  isDark: boolean;
}

const Countdown: React.FC<CountdownProps> = ({ isDark }) => {
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

export default Countdown;
