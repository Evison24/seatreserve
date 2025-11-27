import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from 'lib/auth';

export async function Navbar() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const role = user?.role ?? 'USER';

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            SeatReserve
          </Link>

          <nav className="hidden items-center gap-4 text-sm text-grey-600 sm:flex">
            <Link href="/events" className="hover:text-black">
              Events
            </Link>
            {user && (
              <Link href="/bookings" className="hover:text-black">
                My bookings
              </Link>
            )}
            {role === 'ADMIN' && (
              <Link href="/admin/events" className="hover:text-black">
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="hidden text-grey-600 sm:inline">
                {user.name ?? 'Account'}
              </span>
              <form action="/api/auth/signout" method="post">
                <button className="rounded-full border border-grey-300 px-4 py-1.5 hover:bg-grey-50">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="text-grey-600 hover:text-black">
                Log in
              </Link>
              <Link
                href="/auth/register"
                className="rounded-full bg-black px-4 py-1.5 font-medium text-white hover:bg-black/90"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
