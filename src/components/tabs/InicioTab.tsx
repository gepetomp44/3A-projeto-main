import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Tab, Event } from '../../types';

interface InicioTabProps {
  isDark: boolean;
  setActiveTab: (tab: Tab) => void;
  events: Event[];
}

const InicioTab: React.FC<InicioTabProps> = ({ isDark, setActiveTab, events }) => {
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
};

export default InicioTab;
