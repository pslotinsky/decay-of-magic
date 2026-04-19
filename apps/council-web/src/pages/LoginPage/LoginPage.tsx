import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useLoginMutation } from '@/api/session';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

import styles from './LoginPage.module.scss';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLoginMutation();

  const [nickname, setNickname] = useState('');
  const [secret, setSecret] = useState('');

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    login.mutate({ nickname, secret }, { onSuccess: () => void navigate('/') });
  }

  return (
    <div className={styles.backdrop}>
      <Card className={styles.card}>
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

          {login.isError && (
            <p className={styles.error}>Invalid credentials. Try again.</p>
          )}

          <Button type="submit" disabled={login.isPending}>
            {login.isPending ? 'Verifying…' : 'Authenticate'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
