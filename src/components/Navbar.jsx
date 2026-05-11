import React, { useState, useEffect, useRef } from 'react';
import { 
  MdSearch, MdMenu, MdClose, MdNotifications, MdWbSunny, 
  MdOutlineDarkMode, MdLocationOn, MdHistory,
  MdDashboard, MdOutlineCloud, MdFavoriteBorder, MdSettings
} from 'react-icons/md';
// Clean inline SVG logo — no blurry icon libraries
const AtmosLogo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sun */}
    <circle cx="14" cy="14" r="5" fill="#FCD34D" />
    {/* Sun rays */}
    <line x1="14" y1="4" x2="14" y2="7" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/>
    <line x1="14" y1="21" x2="14" y2="24" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/>
    <line x1="4" y1="14" x2="7" y2="14" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/>
    <line x1="21" y1="14" x2="24" y2="14" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/>
    <line x1="7" y1="7" x2="9.1" y2="9.1" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/>
    <line x1="18.9" y1="18.9" x2="21" y2="21" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/>
    <line x1="21" y1="7" x2="18.9" y2="9.1" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/>
    {/* Cloud */}
    <rect x="12" y="19" width="22" height="11" rx="5.5" fill="white" fillOpacity="0.95"/>
    <circle cx="17" cy="19" r="5" fill="white" fillOpacity="0.95"/>
    <circle cx="25" cy="17" r="6" fill="white" fillOpacity="0.95"/>
  </svg>
);
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../context/WeatherContext';
import { weatherApi } from '../services/weatherApi';
import { useDebounce } from '../hooks/useDebounce';
import { useNavigate, NavLink } from 'react-router-dom';
import { useWeatherAmbience } from '../hooks/useWeatherAmbience';
import { LuVolume2, LuVolumeX } from 'react-icons/lu';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <MdDashboard size={20} /> },
  { name: 'Favorites', path: '/dashboard/favorites', icon: <MdFavoriteBorder size={20} /> },
  { name: 'Alerts', path: '/dashboard/alerts', icon: <MdNotifications size={20} /> },
  { name: 'History', path: '/dashboard/history', icon: <MdHistory size={20} /> },
];

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  
  const { fetchWeather, recentSearches, loading: weatherLoading, isDarkMode, toggleDarkMode, weatherData } = useWeather();
  const condition = weatherData?.current?.condition?.text || '';
  const { playing, toggle: toggleSound } = useWeatherAmbience(condition);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Autocomplete
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm.length > 2) {
        setIsSearching(true);
        try {
          const results = await weatherApi.searchLocations(debouncedSearchTerm);
          setSuggestions(results);
        } catch (error) {
          console.error("Failed to fetch suggestions");
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchTerm]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLocation = (locationQuery) => {
    setSearchTerm('');
    setIsSearchFocused(false);
    setIsMobileMenuOpen(false);
    fetchWeather(locationQuery);
    navigate('/dashboard'); 
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }).format(date);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full h-20 px-4 md:px-6 lg:px-8 flex items-center justify-between glass-panel border-b shadow-sm backdrop-blur-xl">
        {/* Logo & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 -ml-2 rounded-xl hover:bg-white/10 text-white transition-colors"
          >
            {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
          
          <div onClick={() => navigate('/dashboard')} className="flex items-center gap-2.5 cursor-pointer group">
            <div className="group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.4)]">
              <AtmosLogo />
            </div>
            <span className="font-display font-extrabold text-2xl tracking-wide text-white text-shadow-premium hidden sm:block">
              Atmos
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 mx-6">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) => 
                `flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                  isActive 
                    ? 'bg-white text-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {/* Smart Global Search */}
          <div className="relative w-full max-w-sm" ref={searchRef}>
            <div className={`flex items-center gap-2 px-4 py-2 bg-black/20 border rounded-full transition-all duration-300 ${
              isSearchFocused ? 'border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.1)] bg-black/40' : 'border-white/20 hover:border-white/40'
            }`}>
              {isSearching || weatherLoading ? (
                <div className="w-5 h-5 border-2 border-white/50 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <MdSearch className={`text-xl ${isSearchFocused ? 'text-white' : 'text-white/60'}`} />
              )}
              
              <input 
                type="text" 
                placeholder="Search worldwide..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/50 w-full font-medium"
              />
            </div>

            {/* Animated Search Dropdown */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 w-[300px] sm:w-[400px] mt-3 bg-[#0f172a]/95 backdrop-blur-3xl border border-white/20 rounded-3xl z-[100] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                    {searchTerm.length > 2 ? (
                      suggestions && suggestions.length > 0 ? (
                        <div>
                          <div className="px-4 py-2 text-xs font-bold text-blue-300 uppercase tracking-wider">Top Results</div>
                          {suggestions.map((loc) => (
                            <button
                              key={loc.id || `${loc.name}-${loc.country}`}
                              onClick={() => handleSelectLocation(`${loc.name}, ${loc.country}`)}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/10 transition-all duration-200 text-left group"
                            >
                              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/40 transition-colors shrink-0">
                                <MdLocationOn className="text-blue-300 group-hover:text-blue-100" size={18} />
                              </div>
                              <div className="truncate">
                                <p className="text-sm font-bold text-white tracking-wide truncate">{loc.name}</p>
                                <p className="text-xs text-white/60 font-medium mt-0.5 truncate">{loc.region ? `${loc.region}, ` : ''}{loc.country}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : !isSearching && (
                        <div className="px-4 py-8 text-center text-sm font-medium text-white/50 flex flex-col items-center">
                          <span className="text-3xl mb-2">🌍</span>
                          No locations found for "{searchTerm}"
                        </div>
                      )
                    ) : (
                      <div>
                        <div className="px-4 py-2 text-xs font-bold text-purple-300 uppercase tracking-wider">Recent Searches</div>
                        {recentSearches && recentSearches.length > 0 ? (
                          recentSearches.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleSelectLocation(item.query)}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/10 transition-all duration-200 text-left group"
                            >
                              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/40 transition-colors shrink-0">
                                <img src={item.icon} alt="Weather icon" className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                              </div>
                              <div className="truncate">
                                <p className="text-sm font-bold text-white tracking-wide truncate">{item.name}</p>
                                <p className="text-xs text-white/50 truncate">{item.country}</p>
                              </div>
                              <div className="ml-auto text-sm font-bold text-white/80 group-hover:text-white shrink-0">
                                {Math.round(item.temp_c)}°
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-sm font-medium text-white/50">
                            Start typing to discover weather worldwide.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <div className="h-8 w-px bg-white/20"></div>
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-white tracking-wide">{formatTime(currentTime)}</span>
            </div>
            <button
              onClick={toggleSound}
              title={playing ? 'Mute ambience' : 'Play ambience'}
              className={`text-xl rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200 ${
                playing ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              {playing ? <LuVolume2 size={20} /> : <LuVolumeX size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass-panel border-b overflow-hidden shadow-xl"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/20 text-white shadow-inner border border-white/10' 
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
