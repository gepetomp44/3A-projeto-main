import React from 'react';
import { motion } from 'motion/react';
import { Globe, ExternalLink } from 'lucide-react';
import { PLATFORMS } from '../../constants';

interface PlataformasTabProps {
  isDark: boolean;
}

const PlataformasTab: React.FC<PlataformasTabProps> = ({ isDark }) => {
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
};

export default PlataformasTab;
