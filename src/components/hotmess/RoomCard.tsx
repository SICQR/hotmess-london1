// Room Card Component - Telegram Bridge

import { Users, Lock, ExternalLink } from 'lucide-react';
import { HotmessButton } from './Button';

interface RoomCardProps {
  room: {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    isLocked?: boolean;
    requiredLevel?: number;
    telegramLink: string;
  };
  userLevel?: number;
}

export function RoomCard({ room, userLevel = 1 }: RoomCardProps) {
  const isUnlocked = !room.isLocked || (room.requiredLevel && userLevel >= room.requiredLevel);

  const handleEnterRoom = () => {
    window.open(room.telegramLink, '_blank');
  };

  return (
    <div className="bg-neutral-900 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white">{room.name}</h3>
            {room.isLocked && <Lock size={16} className="text-yellow-400" />}
          </div>
          <p className="text-sm text-white/60">{room.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Users size={16} />
          <span>{room.memberCount.toLocaleString()} members</span>
        </div>

        {room.requiredLevel && (
          <span className="text-xs px-2 py-1 bg-yellow-400/10 text-yellow-400 rounded-lg border border-yellow-400/20">
            Level {room.requiredLevel}+
          </span>
        )}
      </div>

      <div className="mt-4">
        <HotmessButton
          fullWidth
          variant={isUnlocked ? 'primary' : 'secondary'}
          icon={ExternalLink}
          iconPosition="right"
          onClick={handleEnterRoom}
          disabled={!isUnlocked}
        >
          {isUnlocked ? 'Enter Room' : `Unlock at Level ${room.requiredLevel}`}
        </HotmessButton>
      </div>
    </div>
  );
}
