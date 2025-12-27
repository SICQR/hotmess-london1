import { Sparkles, Lock, Zap, ShoppingBag, Radio, MapPin, Star } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { REWARDS } from '../design-system/tokens';
import { EmptyState } from '../components/EmptyState';
import { ProgressBar } from '../components/ProgressBar';
import { Badge } from '../components/Badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface RewardsProps {
  onNavigate: (route: any, params?: any) => void;
}

const mockRewards = [
  {
    id: 1,
    category: 'merch',
    name: '10% Off RAW Collection',
    cost: 150,
    description: 'Enjoy a 10% discount on the RAW Collection.',
    locked: false,
    progress: undefined,
    requirement: undefined,
    limited: false,
    exclusive: false,
  },
  {
    id: 2,
    category: 'radio',
    name: 'Radio Request Token',
    cost: 100,
    description: 'Get your track played. Make the frequency yours.',
    locked: false,
    progress: undefined,
    requirement: undefined,
    limited: false,
    exclusive: false,
  },
  {
    id: 3,
    category: 'vip',
    name: 'Secret Beacon Access',
    cost: 500,
    description: 'Gain access to secret beacons and exclusive zones.',
    locked: true,
    progress: undefined,
    requirement: undefined,
    limited: false,
    exclusive: false,
  },
  {
    id: 4,
    category: 'drops',
    name: 'Early Drop Access (24h)',
    cost: 300,
    description: 'Be among the first to access new drops.',
    locked: false,
    progress: undefined,
    requirement: undefined,
    limited: false,
    exclusive: false,
  },
  {
    id: 5,
    category: 'merch',
    name: 'Exclusive HUNG Item',
    cost: 400,
    description: 'Get an exclusive item from the HUNG collection.',
    locked: true,
    progress: undefined,
    requirement: undefined,
    limited: false,
    exclusive: false,
  },
  {
    id: 6,
    category: 'secrets',
    name: 'VIP Beacon Coordinates',
    cost: 750,
    description: 'Receive VIP beacon coordinates for exclusive access.',
    locked: true,
    progress: undefined,
    requirement: undefined,
    limited: false,
    exclusive: false,
  },
];

export function Rewards({ onNavigate }: RewardsProps) {
  const [userXP] = useState(2847);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Rewards' },
    { id: 'merch', label: 'Merch Unlocks', icon: ShoppingBag },
    { id: 'radio', label: 'Radio Requests', icon: Radio },
    { id: 'vip', label: 'VIP Access', icon: Star },
    { id: 'drops', label: 'Drop Priority', icon: Zap },
    { id: 'secrets', label: 'Secret Beacons', icon: MapPin },
  ];

  const filteredRewards = selectedCategory === 'all'
    ? mockRewards
    : mockRewards.filter(r => r.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black">
      {/* Editorial Hero */}
      <section className="relative h-[60vh] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2000"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-end px-8 md:px-16 lg:px-24 pb-16">
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles size={32} className="text-hot" />
            <span className="text-hot uppercase text-sm tracking-wider" style={{ fontWeight: 700 }}>
              {userXP.toLocaleString()} XP Available
            </span>
          </motion.div>

          <motion.h1 
            className="text-[96px] md:text-[180px] uppercase tracking-[-0.04em] leading-[0.85] text-white mb-6"
            style={{ fontWeight: 900 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            REWARDS
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/80 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Earn XP. Unlock chaos. <span className="text-hot">The city rewards those who move.</span>
          </motion.p>
        </div>
      </section>

      <div className="px-8 md:px-16 lg:px-24 py-24">
        {/* Category Filter */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl md:text-5xl uppercase tracking-[-0.03em] text-white mb-8" style={{ fontWeight: 900 }}>
            Categories
          </h3>
          
          <div className="flex flex-wrap gap-4">
            {categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`h-14 px-8 border transition-all uppercase tracking-wider ${
                  selectedCategory === cat.id
                    ? 'bg-white text-black border-white'
                    : 'bg-black border-white/20 hover:border-hot text-white'
                }`}
                style={{ fontWeight: 700 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                {cat.icon && <cat.icon className="inline mr-2" size={20} />}
                {cat.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Rewards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-3xl md:text-5xl uppercase tracking-[-0.03em] text-white mb-12" style={{ fontWeight: 900 }}>
            {selectedCategory === 'all' ? 'All Rewards' : categories.find(c => c.id === selectedCategory)?.label}
          </h3>

          {filteredRewards.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title={REWARDS.emptyTitle}
              message={REWARDS.emptyMessage}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRewards.map((reward, i) => {
                const canAfford = userXP >= reward.cost;
                const isLocked = reward.locked;

                return (
                  <motion.div
                    key={reward.id}
                    className={`p-8 border transition-all duration-300 hover:-translate-y-2 ${
                      isLocked
                        ? 'bg-black border-white/10 opacity-50'
                        : canAfford
                        ? 'bg-hot/10 border-hot'
                        : 'bg-black border-white/20 hover:border-hot'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-white text-xl mb-3" style={{ fontWeight: 700 }}>
                          {reward.name}
                        </h4>
                        <p className="text-white/60 mb-4">{reward.description}</p>
                      </div>
                      {isLocked && <Lock className="text-gray-600" size={24} />}
                    </div>

                    {/* Cost */}
                    <div className="mb-6 flex items-center gap-3">
                      <Zap className={canAfford && !isLocked ? 'text-hot' : 'text-gray-600'} size={24} />
                      <span className={`text-3xl ${canAfford && !isLocked ? 'text-hot' : 'text-gray-600'}`} style={{ fontWeight: 900 }}>
                        {reward.cost.toLocaleString()}
                      </span>
                      <span className="text-white/40">XP</span>
                    </div>

                    {/* Progress (if applicable) */}
                    {reward.progress !== undefined && reward.requirement && (
                      <div className="mb-6">
                        <ProgressBar
                          current={reward.progress}
                          max={reward.requirement}
                          label="Progress to unlock"
                          showPercentage
                          color="hot"
                          size="sm"
                        />
                      </div>
                    )}

                    {/* Action */}
                    <button
                      disabled={!canAfford || isLocked}
                      className={`w-full h-14 uppercase tracking-wider transition-all ${
                        isLocked
                          ? 'bg-gray-900 text-gray-600 cursor-not-allowed'
                          : canAfford
                          ? 'bg-hot hover:bg-heat text-white'
                          : 'bg-gray-900 border border-white/20 text-gray-500 cursor-not-allowed'
                      }`}
                      style={{ fontWeight: 700 }}
                    >
                      {isLocked
                        ? 'Locked'
                        : canAfford
                        ? REWARDS.redeemButton
                        : `Need ${(reward.cost - userXP).toLocaleString()} XP`}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}