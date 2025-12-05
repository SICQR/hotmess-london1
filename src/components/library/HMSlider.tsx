/**
 * hm/Slider — HOTMESS Slider Component
 */

import { useState } from 'react';

interface HMSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  showValue?: boolean;
  step?: number;
  unit?: string;
}

export function HMSlider({
  min,
  max,
  value,
  onChange,
  label,
  showValue = true,
  step = 1,
  unit = '',
}: HMSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-3">
          {label && (
            <label className="uppercase tracking-wider text-gray-400" style={{ fontSize: '14px' }}>{label}</label>
          )}
          {showValue && (
            <span className="text-hot" style={{ fontSize: '14px', fontWeight: 700 }}>
              {value}{unit}
            </span>
          )}
        </div>
      )}

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="hm-slider w-full h-2 bg-gray-900 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #E70F3C 0%, #E70F3C ${percentage}%, #1a1a1a ${percentage}%, #1a1a1a 100%)`,
          }}
        />
      </div>
    </div>
  );
}

// Custom slider styles
const sliderStyles = `
.hm-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background: #E70F3C;
  border: 2px solid #E70F3C;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(231, 15, 60, 0.6);
  transition: all 0.3s;
}

.hm-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 20px rgba(231, 15, 60, 0.8);
}

.hm-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #E70F3C;
  border: 2px solid #E70F3C;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(231, 15, 60, 0.6);
  transition: all 0.3s;
}

.hm-slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 20px rgba(231, 15, 60, 0.8);
}
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = sliderStyles;
  document.head.appendChild(style);
}
