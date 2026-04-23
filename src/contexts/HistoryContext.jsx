import { createContext, useContext, useState, useEffect } from 'react';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('kazedomic_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('kazedomic_history', JSON.stringify(history));
  }, [history]);

  const addToHistory = (manga) => {
    setHistory(prev => {
      // Remove if already exists to move to top
      const filtered = prev.filter(item => item.slug !== manga.slug);
      // Add to beginning and limit to 30 items
      const updated = [{ ...manga, viewedAt: new Date().toISOString() }, ...filtered].slice(0, 30);
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const removeFromHistory = (slug) => {
    setHistory(prev => prev.filter(item => item.slug !== slug));
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory, removeFromHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);
