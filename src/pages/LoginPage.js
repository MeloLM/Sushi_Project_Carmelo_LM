import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="container py-5" style={{ maxWidth: 420 }}>
      <div className="text-center mb-4">
        <span style={{ fontSize: '2.5rem' }}>🍣</span>
        <h2 className="mt-2">Bentornato</h2>
        <p className="text-muted">Accedi al tuo account ZenSushi</p>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-medium">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="tua@email.com"
          />
        </div>
        <div className="mb-4">
          <label className="form-label fw-medium">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="btn btn-danger w-100 py-2" disabled={loading}>
          {loading ? (
            <><span className="spinner-border spinner-border-sm me-2" />Accesso in corso...</>
          ) : 'Accedi'}
        </button>
      </form>

      <p className="text-center mt-4 text-muted">
        Non hai un account?{' '}
        <Link to="/register" className="text-danger fw-medium">Registrati</Link>
      </p>
    </div>
  );
};

export default LoginPage;
