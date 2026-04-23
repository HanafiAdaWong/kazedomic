import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Tag } from 'lucide-react';
import './Genres.css';

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await api.getGenres();
        setGenres(data);
      } catch (error) {
        console.error("Failed to fetch genres", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  if (loading) {
    return <div className="loading">Mengunduh daftar genre...</div>;
  }

  return (
    <div className="genres-page animate-fade-in container">
      <div className="page-header">
        <h1 className="section-title"><Tag size={28} style={{marginRight: '10px'}} /> Daftar Genre</h1>
      </div>

      <div className="genre-grid">
        {genres.map((g, idx) => (
          <Link key={idx} to={`/browse?genre=${g.value}&genreTitle=${encodeURIComponent(g.label)}`} className="genre-card">
            <span className="genre-name">{g.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Genres;
