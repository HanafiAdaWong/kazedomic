import { useHistory } from '../contexts/HistoryContext';
import MangaCard from '../components/MangaCard';
import { Trash2, Clock, BookOpen } from 'lucide-react';
import './History.css';

const History = () => {
  const { history, clearHistory, removeFromHistory } = useHistory();

  if (history.length === 0) {
    return (
      <div className="empty-state animate-fade-in">
        <Clock size={64} className="empty-icon" />
        <h2>Riwayat Kosong</h2>
        <p>Anda belum membaca manga apapun baru-baru ini.</p>
        <a href="/" className="btn-primary">Mulai Eksplor</a>
      </div>
    );
  }

  return (
    <div className="history-page animate-fade-in">
      <div className="page-header">
        <h1 className="section-title">
          <Clock size={24} /> Riwayat Baca
        </h1>
        <button className="clear-btn" onClick={clearHistory}>
          <Trash2 size={18} /> Hapus Semua
        </button>
      </div>

      <div className="manga-grid">
        {history.map((manga) => (
          <div key={manga.slug} className="history-item-wrapper">
            <MangaCard manga={manga} />
            <button 
              className="remove-item-btn" 
              onClick={(e) => {
                e.preventDefault();
                removeFromHistory(manga.slug);
              }}
              title="Hapus dari riwayat"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
