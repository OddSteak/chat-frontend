'use client'

import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, user } = useAuth();
  const router = useRouter();

  // redirect to profile if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      router.push("/profile");
    }
  }, [user, isLoading, router]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const userData = {
      email: formData.get("email") as string,
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    }

    try {
      const success = await register(userData.username, userData.email, userData.password);
      if (success) {
        router.push("/profile")
      } else {
        setError("Something went wrong. Please try again.");
        console.error("Signup failed");
      }
    } catch (error) {
      console.log("Signup failed:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm text-text font-medium mb-2" htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full px-4 py-2 border border-highlight-high bg-overlay placeholder:text-subtle rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="john@example.com"
          disabled={isLoading}
          required
        />
      </div>
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
          placeholder="new password"
          disabled={isLoading}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-pine py-2 text-text rounded hover:bg-blue-700 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? 'Signing up...' : 'Sign Up'}
      </button>

      {error && (
        <div className="mb-4 p-3 text-love">
          {error}
        </div>
      )}
      <span className="text-sm text-text mt-4 block text-center">Already have an account? <a href="/login" className="text-iris hover:underline">Log in</a></span>
    </form>
  );
}

