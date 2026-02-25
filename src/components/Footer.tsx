import React from 'react';
import { MapPin, Instagram } from 'lucide-react';

interface FooterProps {
  isDark: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDark }) => (
  <footer className={`relative z-10 border-t pt-12 md:pt-16 pb-8 mt-12 md:mt-20 transition-all duration-500 ${
    isDark ? 'bg-purple-950/40 backdrop-blur-xl border-purple-900/30' : 'bg-purple-50/80 backdrop-blur-md border-purple-100'
  }`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-purple-600 rounded flex items-center justify-center shadow-lg shadow-purple-900/40">
              <span className="text-white font-bold text-lg md:text-xl">3A</span>
            </div>
            <span className={`font-bold tracking-tight ${isDark ? 'text-white' : 'text-purple-900'}`}>Portal da Turma</span>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className={`font-bold text-xs md:text-sm mb-2 uppercase tracking-wider ${isDark ? 'text-white' : 'text-purple-900'}`}>Alunos</h4>
              <p className={`text-[10px] md:text-xs leading-relaxed ${isDark ? 'text-purple-200/60' : 'text-purple-800/70'}`}>
                Lucas Andrade • Mariana Silva • Pedro Henrique • Ana Beatriz • João Victor • Isabella Rocha • Gabriel Souza • Fernanda Lima • Rafael Costa • Letícia Martins
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center md:text-left">
          <h4 className={`font-bold mb-4 md:mb-6 flex items-center justify-center md:justify-start gap-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>
            <MapPin className="w-4 h-4 text-purple-500" />
            Localização
          </h4>
          <p className={`text-xs md:text-sm mb-4 ${isDark ? 'text-purple-300/70' : 'text-purple-800/70'}`}>
            Alameda da Saudade nº30, Sala 1<br />
            Cidade Escolar - SP
          </p>
          <div className={`w-full h-40 md:h-48 rounded-xl overflow-hidden border grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500 ${
            isDark ? 'border-purple-900/50' : 'border-purple-200'
          }`}>
            <iframe 
              src="https://maps.google.com/maps?q=Alameda%20da%20Saudade%20n%C2%BA30%2C%20Sala%201%2C%20Cidade%20Escolar%20-%20SP&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div className="text-center md:text-left">
          <h4 className={`font-bold mb-4 md:mb-6 ${isDark ? 'text-white' : 'text-purple-900'}`}>Social</h4>
          <div className="flex justify-center md:justify-start">
            <a href="https://www.instagram.com/3a_2k26jr/" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 transition-colors ${
              isDark ? 'text-purple-300/70 hover:text-white' : 'text-purple-700 hover:text-purple-900'
            }`}>
              <Instagram className="w-5 h-5" />
              <span className="text-sm md:text-base">@3a_2k26jr</span>
            </a>
          </div>
        </div>
      </div>
      
      <div className={`border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 ${isDark ? 'border-purple-900/30' : 'border-purple-100'}`}>
        <p className={`text-[10px] md:text-xs text-center md:text-left ${isDark ? 'text-purple-400/50' : 'text-purple-600/50'}`}>
          © 2026 Terceirão - Todos os direitos reservados.
        </p>
        <div className="flex gap-4 md:gap-6">
          <a href="#" className={`text-[10px] md:text-xs transition-colors ${isDark ? 'text-purple-400/50 hover:text-purple-300' : 'text-purple-600/50 hover:text-purple-900'}`}>Privacidade</a>
          <a href="#" className={`text-[10px] md:text-xs transition-colors ${isDark ? 'text-purple-400/50 hover:text-purple-300' : 'text-purple-600/50 hover:text-purple-900'}`}>Termos de Uso</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
