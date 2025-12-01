'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Input, Container, Typography } from '@/components/ui';

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (res?.error) {
      setError('Invalid email or password');
      return;
    }

    router.push('/'); // redirect after successful login
  }

  return (
    <Container className="py-10 flex flex-col items-center">
      <Typography variant="h1">Welcome Back</Typography>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6 w-80">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" disabled={loading}>
          <div className="flex items-center justify-center gap-2.5">
            {loading ? 'Signing in' : 'Sign In'}
            {loading && (
              <span className="inline-flex h-5 w-5 items-center justify-center">
                <span className="h-5 w-5 animate-spin rounded-full border  border-t-transparent" />
              </span>
            )}
          </div>
        </Button>
      </form>

      <p className="text-sm mt-4">
        Don’t have an account?{' '}
        <a href="/auth/register" className="text-blue-600 hover:underline">
          Register
        </a>
      </p>
    </Container>
  );
}
