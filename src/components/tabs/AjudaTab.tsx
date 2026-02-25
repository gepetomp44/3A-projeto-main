import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { RESOURCES } from '../../constants';

interface AjudaTabProps {
  isDark: boolean;
}

const AjudaTab: React.FC<AjudaTabProps> = ({ isDark }) => {
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
};

export default AjudaTab;
