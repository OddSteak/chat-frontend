import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Login",
  description: "login or signup"
}

export default function LoginPage() {
  return (
    <main className="grid items-center justify-items-center min-h-screen p-4 bg-base font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-row items-center justify-items-center p-2 w-102 h-116 rounded-xl bg-surface shadow-xl">
        <div className="flex flex-col shadow-2xl rounded-lg p-4 w-full h-full max-w-lg max-h-lg">
          <h1 className="text-2xl font-bold mb-6 text-text text-center">Login</h1>
          <form>
            <div className="mb-4">
              <label className="block text-sm text-text font-medium mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-highlight-high bg-overlay placeholder:text-subtle rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm text-rp-text font-medium mb-2" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
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
        </div>
      </div>
    </main>
  );
}
