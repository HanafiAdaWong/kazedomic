import { Zap, Globe, MessageSquare, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer glass">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="logo">
            <img src="https://ik.imagekit.io/lhtvft4ai/Logo%20kaze.png?updatedAt=1772296029644" alt="Kazedomic" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <span>Kaze<span>domic</span></span>
          </div>
          <p>Destinasi utama bagi pecinta manga, manhwa, dan manhua. Rasakan pengalaman membaca terbaik dengan antarmuka premium kami.</p>
          <div className="social-links">
            <a href="#"><Globe size={20} /></a>
            <a href="#"><MessageSquare size={20} /></a>
            <a href="#"><Mail size={20} /></a>
          </div>
        </div>
        
        <div className="footer-links" style={{ display: 'flex', alignItems: 'center' }}>
          <a 
            href="https://discord.gg/w9B7Kg3GEf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="discord-btn"
          >
            <MessageSquare size={20} />
            Join Discord Kaze Serenity
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Kazedomic. Hak cipta dilindungi. Dibuat dengan ❤️ untuk komunitas.</p>
      </div>
    </footer>
  );
};

export default Footer;
