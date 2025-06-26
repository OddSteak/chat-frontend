import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <main className="grid items-center justify-items-center min-h-screen p-4 bg-base font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-row items-center justify-items-center p-2 w-102 h-116 rounded-xl bg-surface shadow-xl">
        <div className="flex flex-col shadow-2xl rounded-lg p-4 w-full h-full max-w-lg max-h-lg">
          <h1 className="text-2xl font-bold mb-6 text-text text-center">Sign Up</h1>
          <SignupForm />
        </div>
      </div>
    </main>
  );
}

