// app/login/page.tsx
// Login page

import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = {
  title: "Login | HOTMESS",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-5xl uppercase tracking-tight" style={{ fontWeight: 900 }}>
            LOGIN
          </h1>
          <div className="text-sm opacity-80">Sign in to HOTMESS LONDON</div>
        </header>

        <div className="rounded-3xl border border-white/10 bg-black/40 p-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}