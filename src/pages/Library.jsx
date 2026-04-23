import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MangaCard from '../components/MangaCard';
import { BookMarked, BookOpen } from 'lucide-react';
import './Library.css';

const Library = () => {
  const { user, getBookmarks } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await getBookmarks();
        setBookmarks(data.map(b => ({
          slug: b.manga_slug,
          title: b.manga_title,
          image: b.manga_image,
          latest_chapter: b.manga_latest_chapter
        })));
      } catch (error) {
        console.error('Failed to fetch bookmarks', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, [user]);

  if (!user) {
    return (
      <div className="library-page container animate-fade-in">
        <div className="library-empty">
          <BookMarked size={64} />
          <h2>Pustaka Anda</h2>
          <p>Silakan masuk terlebih dahulu untuk menyimpan komik favorit Anda.</p>
          <Link to="/login" className="btn-primary">Masuk Sekarang</Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="loading">Memuat pustaka...</div>;

  return (
    <div className="library-page container animate-fade-in">
      <div className="page-header">
        <h1 className="section-title"><BookMarked size={28} /> Pustaka Saya</h1>
        <span style={{ color: 'var(--text-dim)' }}>{bookmarks.length} judul tersimpan</span>
      </div>

      {bookmarks.length === 0 ? (
        <div className="library-empty">
          <BookOpen size={64} />
          <h2>Belum ada komik tersimpan</h2>
          <p>Mulai jelajahi dan tambahkan komik favorit Anda ke pustaka!</p>
          <Link to="/browse" className="btn-primary">Jelajahi Komik</Link>
        </div>
      ) : (
        <div className="manga-grid">
          {bookmarks.map((manga, idx) => (
            <MangaCard key={idx} manga={manga} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
