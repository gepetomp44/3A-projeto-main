import React, { useState } from 'react';
import { GraduationCap, Clock, Calendar as CalendarIcon, Globe, HelpCircle, Instagram, Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tab } from '../types';

interface NavbarProps {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, isDark, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'inicio', label: 'Início', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'eventos', label: 'Eventos', icon: <Clock className="w-4 h-4" /> },
    { id: 'calendario', label: 'Calendário', icon: <CalendarIcon className="w-4 h-4" /> },
    { id: 'plataformas', label: 'Plataformas', icon: <Globe className="w-4 h-4" /> },
    { id: 'ajuda', label: 'Ajuda/Estudos', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-500 ${
      isDark ? 'bg-purple-950/80 border-purple-900/50' : 'bg-white/80 border-purple-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-9 h-9 md:w-11 md:h-11 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-900/40">
              <span className="text-white font-bold text-lg md:text-2xl">3A</span>
            </div>
            <span className={`font-bold tracking-tight hidden sm:block text-sm md:text-base ${isDark ? 'text-white' : 'text-purple-900'}`}>Portal da Turma</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
                    : isDark 
                      ? 'text-purple-200 hover:bg-purple-900/50 hover:text-white'
                      : 'text-purple-700 hover:bg-purple-50 hover:text-purple-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
            <div className={`w-px h-6 mx-2 ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`} />
            <a
              href="https://www.instagram.com/3a_2k26jr/"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                isDark 
                  ? 'text-purple-200 hover:bg-purple-900/50 hover:text-white'
                  : 'text-purple-700 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </a>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all ${
                isDark 
                  ? 'text-purple-200 hover:bg-purple-900/50 hover:text-white'
                  : 'text-purple-700 hover:bg-purple-50 hover:text-purple-900'
              }`}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all ${isDark ? 'text-purple-200' : 'text-purple-700'}`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 transition-all rounded-lg ${isDark ? 'text-purple-200 hover:bg-purple-900/50' : 'text-purple-700 hover:bg-purple-50'}`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`md:hidden border-b transition-colors duration-500 shadow-xl ${isDark ? 'bg-purple-950 border-purple-900' : 'bg-white border-purple-100'}`}
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-4 w-full px-4 py-4 rounded-xl text-base font-semibold transition-all ${
                    activeTab === tab.id 
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' 
                      : isDark ? 'text-purple-200 hover:bg-purple-900/50' : 'text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === tab.id ? 'bg-white/20' : isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                    {tab.icon}
                  </div>
                  {tab.label}
                </button>
              ))}
              <div className={`h-px w-full my-4 ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`} />
              <a
                href="https://www.instagram.com/3a_2k26jr/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 w-full px-4 py-4 rounded-xl text-base font-semibold transition-all ${
                  isDark ? 'text-purple-200 hover:bg-purple-900/50' : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                  <Instagram className="w-5 h-5" />
                </div>
                Instagram
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
