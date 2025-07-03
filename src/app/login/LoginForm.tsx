'use client'

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, user, setShowNotifications } = useAuth();
  const router = useRouter();

  // disable failure to fetch user notifications on login page
  useEffect(() => {
    setShowNotifications(false);
    return () => { setShowNotifications(true); }
  }, [setShowNotifications]);

  // redirect to profile if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      router.push("/profile");
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const userData = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    }

    try {
      const success = await login(userData.username, userData.password);
      if (success) {
        router.push("/profile");
      } else {
        throw new Error("Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm text-text font-medium mb-2" htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          className="w-full px-4 py-2 border border-highlight-high bg-overlay placeholder:text-subtle rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="username"
          disabled={isLoading}
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm text-rp-text font-medium mb-2" htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          className="w-full px-4 py-2 border border-highlight-high rounded bg-overlay placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="password"
          disabled={isLoading}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-pine py-2 text-text rounded hover:bg-blue-700 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Submit'}
      </button>

      {error && (
        <div className="mb-4 p-3 text-love">
          {error}
        </div>
      )}
      <span className="text-sm text-text mt-4 block text-center">new user? <a href="/signup" className="text-iris hover:underline">Sign up</a></span>
    </form>

  );
}

