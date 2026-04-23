import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ChevronLeft, ChevronRight, Settings, List, Home } from 'lucide-react';
import './Reader.css';

const Reader = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const data = await api.getChapterImages(slug);
        setChapterData(data);
      } catch (error) {
        console.error("Error fetching images", error);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };
    fetchImages();
  }, [slug]);

  const toggleControls = () => setShowControls(!showControls);

  if (loading) return <div className="loading">Memasuki cerita...</div>;
  if (!chapterData) return <div className="error">Gagal memuat chapter.</div>;

  const { images = [], navigation = {}, chapter_title } = chapterData;

  return (
    <div className="reader-page">
      {/* Top Navigation Overlay */}
      <div className={`reader-nav glass ${showControls ? 'active' : ''}`}>
        <div className="container nav-wrap">
          <Link to="/" className="nav-icon-btn"><Home size={20} /></Link>
          <div className="chapter-info">
            <h2 className="ch-title">{chapter_title || slug.replace(/-/g, ' ')}</h2>
          </div>
          <div className="nav-actions">
            <Link to={`/comic/${navigation.chapterList}`} className="nav-icon-btn"><List size={20} /></Link>
            <button className="nav-icon-btn"><Settings size={20} /></button>
          </div>
        </div>
      </div>

      {/* Image Container */}
      <div className="images-container" onClick={toggleControls}>
        {images.map((img, idx) => (
          <img 
            key={idx} 
            src={img} 
            alt={`Page ${idx + 1}`} 
            loading="lazy" 
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/800x1200/121217/e2e8f0?text=Page+${idx + 1}+Loading+Error`;
            }}
          />
        ))}
      </div>

      {/* Bottom Controls */}
      <div className={`reader-footer glass ${showControls ? 'active' : ''}`}>
        <div className="container footer-wrap">
          <button 
            className="page-btn" 
            disabled={!navigation.previousChapter}
            onClick={() => navigate(`/chapter/${navigation.previousChapter}`)}
          >
            <ChevronLeft size={20} /> Sebelumnya
          </button>
          
          <div className="reader-progress">
             {images.length} Halaman
          </div>

          <button 
            className="page-btn" 
            disabled={!navigation.nextChapter}
            onClick={() => navigate(`/chapter/${navigation.nextChapter}`)}
          >
            Selanjutnya <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reader;
