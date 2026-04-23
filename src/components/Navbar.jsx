import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Clock } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="navbar glass">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <img src="https://ik.imagekit.io/lhtvft4ai/Logo%20kaze.png?updatedAt=1772296029644" alt="Kazedomic" style={{ width: '32px', height: '32px', objectFit: 'contain' }} className="logo-icon" />
          <span className="logo-text">Kaze<span>domic</span></span>
        </Link>

        <form className="search-bar" onSubmit={handleSearch}>
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Cari manga, manhwa..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Beranda</Link>
          <Link to="/browse" onClick={() => setIsMenuOpen(false)}>Eksplor</Link>
          <Link to="/genres" onClick={() => setIsMenuOpen(false)}>Genre</Link>
          <Link to="/history" onClick={() => setIsMenuOpen(false)}>
            <Clock size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Riwayat
          </Link>
        </div>

        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
