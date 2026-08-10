import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, BookOpen } from 'lucide-react';
import './MangaCard.css';

// Final placehold fallback — always works, no external dependency
const makePlaceholder = (title) =>
  `https://placehold.co/400x600/0f172a/3b82f6?text=${encodeURIComponent((title || 'Manga').slice(0, 20))}`;

const isValidSrc = (url) =>
  url && typeof url === 'string' && url.startsWith('http') && !url.includes('wsrv.nl');

const MangaCard = ({ manga }) => {
  const initialSrc = isValidSrc(manga.image) ? manga.image : makePlaceholder(manga.title);
  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    const src = isValidSrc(manga.image) ? manga.image : makePlaceholder(manga.title);
    setImgSrc(src);
    setErrorCount(0);
  }, [manga.image, manga.slug, manga.title]);

  const handleError = () => {
    console.warn('[MangaCard] Image failed:', imgSrc, '| slug:', manga.slug);
    // On first error, fall back to placehold immediately — no infinite loop
    setErrorCount(prev => prev + 1);
    if (errorCount < 1) {
      setImgSrc(makePlaceholder(manga.title));
    }
    // If even placehold fails (very unlikely), do nothing more
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
