import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, LogOut, BookMarked } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    navigate('/');
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
          <Link to="/library" onClick={() => setIsMenuOpen(false)}>
            <BookMarked size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Pustaka
          </Link>
        </div>

        <div className="nav-auth">
          {user ? (
            <div className="user-menu-wrapper">
              <button className="user-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
                <User size={18} />
                <span>{user.user_metadata?.username || user.email?.split('@')[0]}</span>
              </button>
              {showUserMenu && (
                <div className="user-dropdown glass">
                  <Link to="/library" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <BookMarked size={16} /> Pustaka Saya
                  </Link>
                  <button className="dropdown-item logout" onClick={handleSignOut}>
                    <LogOut size={16} /> Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              <User size={18} />
              Masuk
            </Link>
          )}
        </div>

        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
