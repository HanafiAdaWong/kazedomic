import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HistoryProvider } from './contexts/HistoryContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ComicDetail from './pages/ComicDetail';
import Reader from './pages/Reader';
import SearchResults from './pages/SearchResults';
import Browse from './pages/Browse';
import Genres from './pages/Genres';
import History from './pages/History';
import './App.css';

function App() {
  return (
    <Router>
      <HistoryProvider>
        <div className="app-container">
          <Navbar />
          <main className="container main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/genres" element={<Genres />} />
              <Route path="/history" element={<History />} />
              <Route path="/comic/:slug" element={<ComicDetail />} />
              <Route path="/manga/:slug" element={<ComicDetail />} />
              <Route path="/chapter/:slug" element={<Reader />} />
              <Route path="/search" element={<SearchResults />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HistoryProvider>
    </Router>
  );
}

export default App;
