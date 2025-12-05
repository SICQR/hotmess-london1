/**
 * LEGAL - COOKIE POLICY
 */

import { RouteId } from '../lib/routes';

interface LegalCookiesProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function LegalCookies({ onNavigate }: LegalCookiesProps) {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">COOKIE POLICY</h1>
        <p className="text-white/60 mb-8">Last updated: December 2025</p>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-3">What Are Cookies</h2>
            <p className="text-white/70">
              Cookies are small text files that are placed on your device when you visit our website.
              They help us provide you with a better experience by remembering your preferences and
              understanding how you use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">How We Use Cookies</h2>
            <ul className="list-disc list-inside space-y-2 text-white/70">
              <li>Essential cookies: Required for the website to function</li>
              <li>Analytics cookies: Help us understand how visitors use our site</li>
              <li>Preference cookies: Remember your settings and preferences</li>
              <li>Marketing cookies: Used to deliver relevant advertisements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Managing Cookies</h2>
            <p className="text-white/70">
              You can control and/or delete cookies as you wish. You can delete all cookies that are
              already on your device and you can set most browsers to prevent them from being placed.
            </p>
          </section>
        </div>
        
        <button
          onClick={() => onNavigate('legalTerms')}
          className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          ← Back to Legal
        </button>
      </div>
    </div>
  );
}
