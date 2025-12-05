import { AUTH } from '../design-system/tokens';

interface AgeGateProps {
  onPass: () => void;
}

export function AgeGate({ onPass }: AgeGateProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black px-6">
      <div className="max-w-lg w-full text-center">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-6 glow-text">{AUTH.ageGate.header}</h1>
          <p className="text-gray-300" style={{ fontSize: '20px' }}>
            {AUTH.ageGate.subtitle}
          </p>
        </div>
        
        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={onPass}
            className="w-full px-8 py-6 bg-red-600 hover:bg-red-700 transition-all uppercase tracking-wider neon-border"
            style={{ fontSize: '20px' }}
          >
            {AUTH.ageGate.enter}
          </button>
          <button
            onClick={() => window.location.href = 'https://google.com'}
            className="w-full px-8 py-6 bg-transparent border-2 border-gray-600 hover:border-gray-400 transition-all uppercase tracking-wider"
            style={{ fontSize: '20px' }}
          >
            {AUTH.ageGate.leave}
          </button>
        </div>
      </div>
    </div>
  );
}