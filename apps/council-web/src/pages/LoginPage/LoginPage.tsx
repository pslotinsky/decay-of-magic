import { useState } from 'react';
import { useNavigate } from 'react-router';

import { req } from '../../lib/http';
import { useAuth } from '../../context/useAuth';
import { Button } from '../../components/Button';
import styles from './LoginPage.module.scss';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [secret, setSecret] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { accessToken } = await req<{ accessToken: string }>(
        '/api/v1/session',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nickname, secret }),
        },
      );
      login(accessToken);
      void navigate('/citizens');
    } catch {
      setError('Invalid credentials. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Days of Decay</p>
        <p className={styles.tagline}>Administrative</p>
        <h1 className={styles.title}>Council</h1>
        <hr className={styles.rule} />
        <p className={styles.sub}>Authorized Personnel Only</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <span className={styles.label}>Citizen Nickname</span>
            <input
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="Enter your name"
              autoComplete="username"
              required
            />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Secret Word</span>
            <input
              type="password"
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
              placeholder="Your secret"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Authenticate'}
          </Button>
        </form>
      </div>
    </div>
  );
}
