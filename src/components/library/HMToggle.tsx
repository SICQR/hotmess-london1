/**
 * hm/Toggle — HOTMESS Toggle Switch
 */

interface HMToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function HMToggle({ enabled, onChange, label, disabled }: HMToggleProps) {
  return (
    <label className={`inline-flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      {label && (
        <span className="text-sm uppercase tracking-wider text-gray-400">{label}</span>
      )}
      
      <div className="relative">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        
        <div
          className={`w-14 h-8 rounded-full border-2 transition-all duration-300 ${
            enabled
              ? 'bg-hot border-hot shadow-[0_0_20px_rgba(231,15,60,0.6)]'
              : 'bg-gray-900 border-gray-700'
          }`}
        >
          <div
            className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${
              enabled ? 'left-7' : 'left-1'
            }`}
          />
        </div>
      </div>
    </label>
  );
}
