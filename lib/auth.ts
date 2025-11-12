import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials?.email || ''));
        if (!user) return null;

        const valid = await bcrypt.compare(credentials!.password, user.password || '');
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name ?? null,
          email: user.email ?? null,
        };
      },
    }),
  ],
  pages: { signIn: '/auth/signin' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user && token?.sub) {
        session.user.id = token.sub; // typed via your next-auth.d.ts augmentation
      }
      return session;
    },
  },
};
