import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import MangaCard from '../components/MangaCard';
import { ChevronRight, TrendingUp, Sparkles } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [data, setData] = useState({ latest: [], popular: [], trending: [] });
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const homeData = await api.getHome();
        setData({
          latest: homeData.latest || [],
          popular: homeData.popular || [],
          trending: homeData.trending || []
        });
      } catch (error) {
        console.error("Failed to fetch home data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  useEffect(() => {
    if (data.trending.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % Math.min(data.trending.length, 5));
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, [data.trending]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Membangunkan Kazedomic...</p>
      </div>
    );
  }

  const featured = data.trending[heroIndex] || data.latest[0] || {
    title: 'Featured Manga',
    image: 'https://placehold.co/800x400/121217/e2e8f0?text=Featured+Manga',
    slug: ''
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section key={heroIndex} className="hero-section glass animate-fade-in hero-glowing">
        {/* Background Slider */}
        <div className="hero-background-slider">
          <div className="slider-track">
            {[...data.latest, ...data.latest, ...data.latest].slice(0, 20).map((manga, idx) => (
              <img key={idx} src={manga.image} alt="" referrerPolicy="no-referrer" />
            ))}
          </div>
          <div className="slider-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="badge"><Sparkles size={14} /> Pilihan Hari Ini</div>
          <h1>{featured.title}</h1>
          <p>
            Selami update terbaru dan cerita yang sedang tren.
            Temukan chapter terbaru dari {featured.title} dan banyak lagi.
          </p>
          <div className="hero-actions">
            {featured.slug && <Link to={`/comic/${featured.slug}`} className="btn-primary">Baca Sekarang</Link>}
          </div>
        </div>
        <div className="hero-image">
          <img
            src={featured.image}
            alt="Featured"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/800x400/121217/e2e8f0?text=${encodeURIComponent(featured.title)}`;
            }}
          />
        </div>
      </section>

      {/* Popular Trending */}
      <section className="trending-section">
        <div className="page-header">
          <h2 className="section-title"><TrendingUp size={24} /> Populer Minggu Ini</h2>
          <Link to="/browse" className="view-all">Lihat Semua <ChevronRight size={18} /></Link>
        </div>
        <div className="manga-grid">
          {data.trending.map((manga, idx) => (
            <MangaCard key={idx} manga={manga} />
          ))}
        </div>
      </section>

      {/* Latest Updates */}
      <section className="latest-section">
        <div className="page-header">
          <h2 className="section-title">Update Terbaru</h2>
          <Link to="/browse" className="view-all">Lihat Semua <ChevronRight size={18} /></Link>
        </div>
        <div className="manga-grid">
          {data.latest.map((manga, idx) => (
            <MangaCard key={idx} manga={manga} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
