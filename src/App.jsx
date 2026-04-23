import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ComicDetail from './pages/ComicDetail';
import Reader from './pages/Reader';
import SearchResults from './pages/SearchResults';
import Browse from './pages/Browse';
import Genres from './pages/Genres';
import Login from './pages/Login';
import Library from './pages/Library';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main className="container main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/genres" element={<Genres />} />
              <Route path="/comic/:slug" element={<ComicDetail />} />
              <Route path="/manga/:slug" element={<ComicDetail />} />
              <Route path="/chapter/:slug" element={<Reader />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/login" element={<Login />} />
              <Route path="/library" element={<Library />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
