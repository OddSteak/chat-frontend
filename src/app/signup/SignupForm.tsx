'use client'

import { apiClient } from '@/lib/api';

export default function SignupForm() {
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
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-pine py-2 text-text rounded hover:bg-blue-700 transition-colors"
      >
        Submit
      </button>
      <span className="text-sm text-text mt-4 block text-center">Already have an account? <a href="/login" className="text-iris hover:underline">Log in</a></span>
    </form>
  );
}

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const userData = {
    email: formData.get("email") as string,
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  }

  try {
    await apiClient.post("/api/auth/register", userData);
    window.location.href = "/profile";
  } catch (error) {
    console.log("signup failed:", error);
  }
}

