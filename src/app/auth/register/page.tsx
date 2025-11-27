'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button, Input, Container, Typography } from '@/components/ui';

type Status = 'idle' | 'creating' | 'signingIn';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const isBusy = status !== 'idle';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setStatus('creating');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setStatus('signingIn');

      const result = await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (result?.error) {
        setError('Account created, but sign-in failed. Please log in.');
        setStatus('idle');
        return;
      }

      router.push('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
      setStatus('idle');
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <Container className="py-10 flex flex-col items-center">
      <Typography variant="h1">Create an Account</Typography>
      <p className="mt-2 text-sm text-gray-500">
        Book seats faster and keep all your reservations in one place.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6 w-full max-w-xs">
        <Input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          disabled={isBusy}
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          disabled={isBusy}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          disabled={isBusy}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" disabled={isBusy}>
          <div className="flex items-center justify-center gap-2.5">
            {status === 'creating'
              ? 'Creating your account'
              : status === 'signingIn'
              ? 'Signing you in'
              : 'Sign Up'}
            {status !== 'idle' && (
              <span className="inline-flex h-5 w-5 items-center justify-center">
                <span className="h-5 w-5 animate-spin rounded-full border  border-t-transparent" />
              </span>
            )}
          </div>
        </Button>
      </form>

      <p className="text-sm mt-4">
        Already have an account?{' '}
        <a href="/auth/signin" className="text-blue-600 hover:underline">
          Sign in
        </a>
      </p>
    </Container>
  );
}
