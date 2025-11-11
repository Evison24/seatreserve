'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Button, Container, Typography, Input } from '@/components/ui';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await signIn('credentials', { email, password, callbackUrl: '/' });
  }

  return (
    <Container className="py-10">
      <Typography variant="h1">Sign In</Typography>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6 w-80">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <Button type="submit">Sign In</Button>
      </form>
    </Container>
  );
}
