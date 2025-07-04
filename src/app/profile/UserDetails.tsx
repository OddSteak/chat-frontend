'use client'

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function UserDetails() {
  const { user, loading, error, refetch, logout } = useAuth();
  const router = useRouter();

  const logoutAndRedirect = async () => {
    await logout();
    router.push('/login'); // redirect to login page after logout
  }

  if (loading) {
    return <p className="text-text text-center">Loading...</p>
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-love mb-2">Failed to load profile data.</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-pine text-text rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!user) {
    return <p className="text-love text-center">No user data available.</p>
  }

  return (
    <div className="flex flex-col text-text">
      <p className="mb-2">Email: {user.email}</p>
      <p>Username: {user.username}</p>
      <button className="mt-4 px-4 py-2 self-center bg-pine text-text rounded hover:bg-blue-700" onClick={logoutAndRedirect}>
        Logout
      </button>
    </div>
  )
}
