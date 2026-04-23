import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message === 'Invalid login credentials' 
            ? 'Email atau kata sandi salah' 
            : error.message);
        } else {
          navigate('/');
        }
      } else {
        if (password.length < 6) {
          setError('Kata sandi minimal 6 karakter');
          setSubmitting(false);
          return;
        }
        const { error } = await signUp(email, password, username);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Akun berhasil dibuat! Silakan cek email untuk verifikasi.');
        }
      }
    } catch (err) {
      setError('Terjadi kesalahan. Coba lagi nanti.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-card">
        <div className="logo">
          <img 
            src="https://ik.imagekit.io/lhtvft4ai/Logo%20kaze.png?updatedAt=1772296029644" 
            alt="Kazedomic" 
            style={{ width: '36px', height: '36px', objectFit: 'contain' }} 
          />
          <span>Kaze<span>domic</span></span>
        </div>
        <p className="auth-subtitle">
          {isLogin ? 'Masuk ke akun Anda' : 'Buat akun baru'}
        </p>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
          >
            Masuk
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
          >
            Daftar
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Nama Pengguna</label>
              <input 
                type="text" 
                placeholder="Masukkan nama pengguna" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="nama@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Kata Sandi</label>
            <input 
              type="password" 
              placeholder="Masukkan kata sandi" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
