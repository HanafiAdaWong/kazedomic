import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import MangaCard from '../components/MangaCard';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performSearch = async () => {
      if (!query) return;
      try {
        setLoading(true);
        const data = await api.search(query);
        setResults(data || []);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    };
    performSearch();
  }, [query]);

  return (
    <div className="search-page">
      <div className="page-header">
        <h1 className="section-title">Hasil Pencarian untuk "{query}"</h1>
      </div>

      {loading ? (
        <div className="loading">Mencari di multiverse...</div>
      ) : results.length > 0 ? (
        <div className="manga-grid">
          {results.map((manga, idx) => (
            <MangaCard key={idx} manga={manga} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>Manga tidak ditemukan. Coba kata kunci lain.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
