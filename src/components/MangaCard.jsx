import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import './MangaCard.css';

const MangaCard = ({ manga }) => {
  const [imgSrc, setImgSrc] = useState(manga.image);
  const [hasTriedRecovery, setHasTriedRecovery] = useState(false);

  useEffect(() => {
    setImgSrc(manga.image);
    setHasTriedRecovery(false);
  }, [manga.image]);

  const handleError = async () => {
    if (!hasTriedRecovery && manga.slug) {
      setHasTriedRecovery(true);
      try {
        const detail = await api.getComicDetail(manga.slug);
        if (detail && detail.image && !detail.image.includes('placehold.co')) {
          setImgSrc(detail.image);
          return;
        }
      } catch (e) {
        console.warn('Image recovery failed:', e);
      }
    }
    
    // Final fallback
    setImgSrc(`https://placehold.co/400x600/121217/e2e8f0?text=${encodeURIComponent(manga.title)}`);
  };

  return (
    <Link to={`/comic/${manga.slug}`} className="manga-card animate-fade-in">
      <div className="card-image">
        <img 
          src={imgSrc} 
          alt={manga.title} 
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={handleError}
        />
        <div className="card-overlay">
          <div className="card-stats">
            {manga.rating && (
              <span className="stat">
                <Star size={14} fill="currentColor" /> {manga.rating}
              </span>
            )}
            {manga.type && <span className="stat-type">{manga.type}</span>}
          </div>
          <button className="read-btn">
            <BookOpen size={16} /> Baca Sekarang
          </button>
        </div>
      </div>
      <div className="card-info">
        <h3 className="card-title">{manga.title}</h3>
        {manga.latest_chapter && (
          <p className="card-chapter">
            {manga.latest_chapter.toString().toLowerCase().includes('chapter') || 
             manga.latest_chapter.toString().toLowerCase().startsWith('ch') 
              ? manga.latest_chapter 
              : `Chapter ${manga.latest_chapter}`}
          </p>
        )}
      </div>
    </Link>
  );
};

export default MangaCard;
