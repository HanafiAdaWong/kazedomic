import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import MangaCard from '../components/MangaCard';
import { LayoutGrid, Filter, Search } from 'lucide-react';
import './Browse.css';

const Browse = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const [searchParams] = useSearchParams();
  const genreId = searchParams.get('genre');
  const genreTitle = searchParams.get('genreTitle');

  const fetchComics = async (pageNum, reset = false) => {
    try {
      if (reset) setLoading(true);
      const data = await api.getAllComics(pageNum, genreId);
      setComics(prev => reset ? data.comics : [...prev, ...data.comics]);
      setHasNextPage(data.hasNextPage);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching comics", error);
    } finally {
      if (reset) setLoading(false);
    }
  };

  useEffect(() => {
    fetchComics(1, true);
  }, [genreId]);

  useEffect(() => {
    const handleSearch = async () => {
      if (!searchTerm) {
        setIsSearching(false);
        fetchComics(1, true);
        return;
      }
      setIsSearching(true);
      setLoading(true);
      try {
        const results = await api.search(searchTerm);
        setComics(results || []);
        setHasNextPage(false); // No pagination for search currently
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    const timeoutId = setTimeout(handleSearch, 600);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  if (loading && page === 1) return <div className="loading">Memuat Pustaka...</div>;

  return (
    <div className="browse-page animate-fade-in">
      <div className="page-header-alt">
        <div className="header-info">
          <h1>
            <LayoutGrid /> 
            {genreTitle ? ` Genre: ${decodeURIComponent(genreTitle)}` : ' Jelajahi Pustaka'}
          </h1>
          <p>Lebih dari {comics.length} judul tersedia untukmu</p>
        </div>
        
        <div className="search-filter-bar glass">
          <div className="search-input-wrap">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Saring berdasarkan judul..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="filter-btn">
            <Filter size={18} />
            Tipe
          </button>
        </div>
      </div>

      <div className="manga-grid">
        {comics.map((manga, idx) => (
          <MangaCard key={idx} manga={manga} />
        ))}
      </div>

      {!isSearching && hasNextPage && (
        <div className="load-more-container">
          <button 
            className="load-more-btn glass" 
            onClick={() => fetchComics(page + 1)}
          >
            Muat Lebih Banyak Judul
          </button>
        </div>
      )}
    </div>
  );
};

export default Browse;
