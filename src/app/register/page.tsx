// app/register/page.tsx
// Registration page

import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata = {
  title: "Register | HOTMESS",
  description: "Create your account",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-5xl uppercase tracking-tight" style={{ fontWeight: 900 }}>
            REGISTER
          </h1>
          <div className="text-sm opacity-80">Join HOTMESS LONDON</div>
        </header>

        <div className="rounded-3xl border border-white/10 bg-black/40 p-8">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}