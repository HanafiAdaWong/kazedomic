import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api, GENRE_MAP } from '../services/api';
import { useHistory } from '../contexts/HistoryContext';
import { List, Calendar, User, Eye, Info } from 'lucide-react';
import './ComicDetail.css';

const ComicDetail = () => {
  const { slug } = useParams();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToHistory } = useHistory();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await api.getComicDetail(slug);
        setComic(data);
      } catch (error) {
        console.error("Error fetching comic detail", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug]);

  useEffect(() => {
    if (comic) {
      addToHistory({
        slug: slug,
        title: comic.title,
        image: comic.image,
        latest_chapter: comic.chapters?.[0]?.title || 'Latest'
      });
    }
  }, [comic]);

  if (loading) return <div className="loading">Memuat detail...</div>;
  if (!comic) return <div className="error">Manga tidak ditemukan.</div>;

  return (
    <div className="detail-page animate-fade-in">
      <div className="detail-header">
        <div className="cover-container">
          <img 
            src={comic.image} 
            alt={comic.title} 
            className="detail-cover" 
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/400x600/121217/e2e8f0?text=${encodeURIComponent(comic.title)}`;
            }}
          />
          {comic.chapters?.[0] && (
            <Link to={`/chapter/${comic.chapters[0].slug}`} className="read-now-btn" style={{ textAlign: 'center' }}>Mulai Baca</Link>
          )}
        </div>
        
        <div className="detail-info">
          <div className="type-badge">{comic.metadata?.type || 'Manga'}</div>
          <h1>{comic.title}</h1>
          <p className="alt-title">{comic.title_indonesian}</p>
          
          <div className="meta-grid">
            <div className="meta-item">
              <User size={18} />
              <span>{comic.metadata?.author || 'Unknown'}</span>
            </div>
            <div className="meta-item">
              <Info size={18} />
              <span>{comic.metadata?.status || 'Ongoing'}</span>
            </div>
            <div className="meta-item">
              <Eye size={18} />
              <span>{comic.metadata?.concept || 'Fantasy'}</span>
            </div>
          </div>

          <div className="genres">
            {comic.genres?.map((genre, idx) => {
              const genreValue = GENRE_MAP[genre.slug] || '';
              return (
                <Link 
                  key={idx} 
                  to={`/browse?genre=${genreValue}&genreTitle=${encodeURIComponent(genre.name)}`} 
                  className="genre-tag"
                >
                  {genre.name}
                </Link>
              );
            })}
          </div>

          <div className="synopsis-box">
            <h3>Sinopsis</h3>
            <p>{comic.synopsis}</p>
          </div>
        </div>
      </div>

      <div className="chapter-section glass">
        <div className="section-header">
          <h2><List size={22} /> Daftar Chapter</h2>
          <span className="chapter-count">{comic.chapters?.length} Chapter</span>
        </div>
        
        <div className="chapter-list">
          {comic.chapters?.map((ch, idx) => (
            <Link key={idx} to={`/chapter/${ch.slug}`} className="chapter-item">
              <span className="ch-name">{ch.title || ch.chapter}</span>
              <span className="ch-date"><Calendar size={14} /> {ch.date}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComicDetail;
