'use client'

import { apiClient } from '@/lib/api';

export default function LoginForm() {
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
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pine py-2 text-text rounded hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
          <span className="text-sm text-text mt-4 block text-center">new user? <a href="/signup" className="text-iris hover:underline">Sign up</a></span>
        </form>

  )
}

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const userData = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  }

  try {
    await apiClient.post("/api/auth/login", userData);
    window.location.href="/profile";
  } catch (error) {
    console.log("error", error);
  }
}
