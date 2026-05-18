import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { user, signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError('Le password non coincidono'); return; }
    if (password.length < 6) { setError('La password deve essere di almeno 6 caratteri'); return; }
    setError('');
    setLoading(true);
    const { error } = await signUp(email, password);
    if (error) {
      setError(error.message);
    } else {
      setMessage('Registrazione completata! Controlla la tua email per confermare l\'account.');
    }
    setLoading(false);
  };

  return (
    <div className="container py-5" style={{ maxWidth: 420 }}>
      <div className="text-center mb-4">
        <span style={{ fontSize: '2.5rem' }}>🍱</span>
        <h2 className="mt-2">Crea account</h2>
        <p className="text-muted">Unisciti a ZenSushi</p>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {message && <div className="alert alert-success py-2">{message}</div>}

      {!message && (
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
          <div className="mb-3">
            <label className="form-label fw-medium">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Minimo 6 caratteri"
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-medium">Conferma Password</label>
            <input
              type="password"
              className="form-control"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-danger w-100 py-2" disabled={loading}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" />Registrazione in corso...</>
            ) : 'Registrati'}
          </button>
        </form>
      )}

      <p className="text-center mt-4 text-muted">
        Hai già un account?{' '}
        <Link to="/login" className="text-danger fw-medium">Accedi</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
