import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

export function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      navigate('/employees', { replace: true });
    } catch {
      // error из контекста
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Вход</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Пароль</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Вход...' : 'Войти'}
      </button>

      <p className="auth-link">
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </form>
  );
}
