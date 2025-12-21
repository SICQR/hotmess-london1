/**
 * hm/Tabs — HOTMESS Tab Component
 */

import { ReactNode, useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface HMTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export function HMTabs({ tabs, defaultTab, onChange }: HMTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="flex border-b border-hot/30 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-6 py-3 uppercase tracking-wider text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-hot border-b-2 border-hot bg-hot/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-6">{activeContent}</div>
    </div>
  );
}

// Chip component (alternative tab style)
interface HMChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'hot' | 'heat' | 'lime';
}

export function HMChip({ label, active, onClick, variant = 'default' }: HMChipProps) {
  const variantStyles = {
    default: active
      ? 'bg-white text-black border-white'
      : 'bg-transparent text-gray-400 border-gray-700 hover:border-white hover:text-white',
    hot: active
      ? 'bg-hot text-white border-hot'
      : 'bg-transparent text-hot border-hot/50 hover:border-hot',
    heat: active
      ? 'bg-heat text-white border-heat'
      : 'bg-transparent text-heat border-heat/50 hover:border-heat',
    lime: active
      ? 'bg-neon-lime text-black border-neon-lime'
      : 'bg-transparent text-neon-lime border-neon-lime/50 hover:border-neon-lime',
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 border rounded-full text-xs uppercase tracking-wider transition-all ${variantStyles[variant]}`}
    >
      {label}
    </button>
  );
}
