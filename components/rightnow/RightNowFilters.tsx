'use client';

import { useState } from 'react';
import type { RightNowIntent } from '@/types/rightnow';

interface RightNowFiltersProps {
  onIntentChange: (intents: RightNowIntent[]) => void;
  onRadiusChange: (radius: number) => void;
  onTimeChange: (range: 'now' | 'tonight' | 'weekend') => void;
}

export function RightNowFilters({ 
  onIntentChange, 
  onRadiusChange, 
  onTimeChange 
}: RightNowFiltersProps) {
  const [selectedIntents, setSelectedIntents] = useState<RightNowIntent[]>([]);
  const [selectedRadius, setSelectedRadius] = useState<number>(3);
  const [selectedTime, setSelectedTime] = useState<'now' | 'tonight' | 'weekend'>('now');

  const intentOptions: { value: RightNowIntent; label: string; emoji: string }[] = [
    { value: 'hookup', label: 'Hookup', emoji: '🔥' },
    { value: 'crowd', label: 'Crowd', emoji: '👥' },
    { value: 'drop', label: 'Drop', emoji: '🛍' },
    { value: 'ticket', label: 'Ticket', emoji: '🎟' },
    { value: 'radio', label: 'Radio', emoji: '📻' },
    { value: 'care', label: 'Care', emoji: '🧴' },
  ];

  const radiusOptions = [
    { value: 1, label: '1KM' },
    { value: 3, label: '3KM' },
    { value: 10, label: 'CITY' },
    { value: 999, label: 'GLOBAL' },
  ];

  const timeOptions = [
    { value: 'now' as const, label: 'NOW' },
    { value: 'tonight' as const, label: 'TONIGHT' },
    { value: 'weekend' as const, label: 'WEEKEND' },
  ];

  const toggleIntent = (intent: RightNowIntent) => {
    const newIntents = selectedIntents.includes(intent)
      ? selectedIntents.filter(i => i !== intent)
      : [...selectedIntents, intent];
    
    setSelectedIntents(newIntents);
    onIntentChange(newIntents);
  };

  const selectRadius = (radius: number) => {
    setSelectedRadius(radius);
    onRadiusChange(radius);
  };

  const selectTime = (range: 'now' | 'tonight' | 'weekend') => {
    setSelectedTime(range);
    onTimeChange(range);
  };

  return (
    <div className="space-y-3">
      {/* Intent Filters */}
      <div>
        <div style={{ 
          fontSize: '10px', 
          letterSpacing: '0.2em', 
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)',
          marginBottom: '8px'
        }}>
          INTENT
        </div>
        <div className="flex flex-wrap gap-2">
          {intentOptions.map(option => (
            <button
              key={option.value}
              onClick={() => toggleIntent(option.value)}
              className="transition-all"
              aria-pressed={selectedIntents.includes(option.value)}
              style={{
                padding: '8px 12px',
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                borderRadius: '999px',
                border: selectedIntents.includes(option.value)
                  ? '1px solid rgba(255,255,255,0.55)'
                  : '1px solid rgba(255,255,255,0.22)',
                background: selectedIntents.includes(option.value)
                  ? 'rgba(255,255,255,0.10)'
                  : 'rgba(0,0,0,0.64)',
                color: selectedIntents.includes(option.value)
                  ? '#ffffff'
                  : 'rgba(255,255,255,0.68)',
              }}
            >
              <span style={{ marginRight: '6px' }}>{option.emoji}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Radius + Time (inline) */}
      <div className="flex gap-6">
        {/* Radius */}
        <div className="flex-1">
          <div style={{ 
            fontSize: '10px', 
            letterSpacing: '0.2em', 
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '8px'
          }}>
            RADIUS
          </div>
          <div className="flex gap-2">
            {radiusOptions.map(option => (
              <button
                key={option.value}
                onClick={() => selectRadius(option.value)}
                className="transition-all flex-1"
                aria-pressed={selectedRadius === option.value}
                style={{
                  padding: '8px 10px',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  borderRadius: '999px',
                  border: selectedRadius === option.value
                    ? '1px solid rgba(255,255,255,0.55)'
                    : '1px solid rgba(255,255,255,0.22)',
                  background: selectedRadius === option.value
                    ? 'rgba(255,255,255,0.10)'
                    : 'rgba(0,0,0,0.64)',
                  color: selectedRadius === option.value
                    ? '#ffffff'
                    : 'rgba(255,255,255,0.68)',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time */}
        <div className="flex-1">
          <div style={{ 
            fontSize: '10px', 
            letterSpacing: '0.2em', 
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '8px'
          }}>
            TIME
          </div>
          <div className="flex gap-2">
            {timeOptions.map(option => (
              <button
                key={option.value}
                onClick={() => selectTime(option.value)}
                className="transition-all flex-1"
                aria-pressed={selectedTime === option.value}
                style={{
                  padding: '8px 10px',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  borderRadius: '999px',
                  border: selectedTime === option.value
                    ? '1px solid rgba(255,255,255,0.55)'
                    : '1px solid rgba(255,255,255,0.22)',
                  background: selectedTime === option.value
                    ? 'rgba(255,255,255,0.10)'
                    : 'rgba(0,0,0,0.64)',
                  color: selectedTime === option.value
                    ? '#ffffff'
                    : 'rgba(255,255,255,0.68)',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
