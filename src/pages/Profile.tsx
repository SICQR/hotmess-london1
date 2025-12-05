import { User, Zap, Target, Award, TrendingUp, Calendar, MapPin, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { PROFILE } from '../design-system/tokens';
import { StatCard } from '../components/StatCard';
import { ProgressBar } from '../components/ProgressBar';
import { Badge } from '../components/Badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface ProfileProps {
  onNavigate: (page: string) => void;
}

const mockAchievements = [
  { id: 1, name: '4-Day Streak', desc: 'Commitment looks good on you', unlocked: true, icon: <Zap size={24} />, progress: 0, requirement: 0 },
  { id: 2, name: 'Night Explorer', desc: '50+ beacons scanned', unlocked: false, icon: <MapPin size={24} />, progress: 47, requirement: 50 },
  { id: 3, name: 'Early Bird', desc: 'Scan before 6am', unlocked: true, icon: <Calendar size={24} />, progress: 0, requirement: 0 },
  { id: 4, name: 'Heatseeker', desc: 'Hit 10 high-heat zones', unlocked: false, icon: <Target size={24} />, progress: 6, requirement: 10 },
  { id: 5, name: 'Beacon Master', desc: '100+ beacons scanned', unlocked: false, icon: <MapPin size={24} />, progress: 43, requirement: 100 },
  { id: 6, name: 'XP Powerhouse', desc: '5000+ XP earned', unlocked: false, icon: <Zap size={24} />, progress: 2847, requirement: 5000 },
  { id: 7, name: 'Purchaser', desc: '5+ purchases made', unlocked: true, icon: <ShoppingBag size={24} />, progress: 0, requirement: 0 },
  { id: 8, name: 'Level Climber', desc: 'Reach level 15', unlocked: false, icon: <TrendingUp size={24} />, progress: 12, requirement: 15 },
];

const mockActivity = [
  { id: 1, title: 'Scanned: Vauxhall Station', description: 'Location: Vauxhall Station', xp: 40, time: '2h ago' },
  { id: 2, title: 'Unlocked: Radio Request Token', description: 'Item: Radio Request Token', xp: -100, time: '1d ago' },
  { id: 3, title: 'Scanned: Shoreditch High St', description: 'Location: Shoreditch High St', xp: 56, time: '2d ago' },
  { id: 4, title: 'Level 7 Achieved', description: 'You just levelled. Everyone can feel it.', xp: 0, time: '3d ago' },
  { id: 5, title: 'Scanned: Soho Square', description: 'Location: Soho Square', xp: 23, time: '3d ago' },
];

export function Profile({ onNavigate }: ProfileProps) {
  const [user] = useState({
    username: 'ShadowRunner',
    level: 12,
    xp: 2847,
    xpToNextLevel: 3000,
    streak: 7,
    totalBeacons: 43,
    totalPurchases: 5,
    memberSince: 'March 2024',
    achievements: 18,
    rank: 'Nightbody',
  });

  return (
    <div className="min-h-screen bg-black">
      {/* Editorial Hero */}
      <section className="relative h-[50vh] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2000"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-end px-8 md:px-16 lg:px-24 pb-16">
          <motion.div 
            className="flex items-center gap-4 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-hot to-heat flex items-center justify-center border-4 border-white">
              <User size={48} className="text-white" />
            </div>
            <div>
              <h2 className="text-4xl md:text-6xl uppercase tracking-[-0.03em] text-white mb-2" style={{ fontWeight: 900 }}>
                {user.username}
              </h2>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-hot text-white text-sm uppercase tracking-wider" style={{ fontWeight: 700 }}>
                  LVL {user.level}
                </span>
                <span className="text-white/60">{user.rank}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="px-8 md:px-16 lg:px-24 py-24">
        {/* XP Progress */}
        <motion.div 
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl md:text-5xl uppercase tracking-[-0.03em] text-white mb-8" style={{ fontWeight: 900 }}>
            Next Level
          </h3>
          <div className="max-w-2xl">
            <ProgressBar
              current={user.xp}
              max={user.xpToNextLevel}
              label="XP Progress"
              showPercentage
              color="hot"
              size="lg"
            />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl md:text-5xl uppercase tracking-[-0.03em] text-white mb-8" style={{ fontWeight: 900 }}>
            Your Numbers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 bg-black border border-hot/30 hover:border-hot transition-all">
              <Zap className="text-hot mb-4" size={40} />
              <h4 className="text-5xl text-white mb-2" style={{ fontWeight: 900 }}>{user.xp}</h4>
              <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700 }}>Total XP</p>
              <p className="text-white/40 text-sm mt-2">earned in sweat.</p>
            </div>

            <div className="p-8 bg-black border border-hot/30 hover:border-hot transition-all">
              <Target className="text-heat mb-4" size={40} />
              <h4 className="text-5xl text-white mb-2" style={{ fontWeight: 900 }}>{user.streak}</h4>
              <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700 }}>Day Streak</p>
              <p className="text-white/40 text-sm mt-2">consistency kink.</p>
            </div>

            <div className="p-8 bg-black border border-hot/30 hover:border-hot transition-all">
              <MapPin className="text-lime mb-4" size={40} />
              <h4 className="text-5xl text-white mb-2" style={{ fontWeight: 900 }}>{user.totalBeacons}</h4>
              <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700 }}>Beacons Hit</p>
              <p className="text-white/40 text-sm mt-2">footwork flex.</p>
            </div>

            <div className="p-8 bg-black border border-hot/30 hover:border-hot transition-all">
              <ShoppingBag className="text-cyan mb-4" size={40} />
              <h4 className="text-5xl text-white mb-2" style={{ fontWeight: 900 }}>{user.totalPurchases}</h4>
              <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700 }}>Purchases</p>
              <p className="text-white/40 text-sm mt-2">you greedy thing.</p>
            </div>
          </div>
        </motion.div>

        {/* Achievement Showcase */}
        <motion.div 
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl md:text-5xl uppercase tracking-[-0.03em] text-white mb-8" style={{ fontWeight: 900 }}>
            Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {mockAchievements.map((achievement, i) => (
              <motion.div
                key={achievement.id}
                className={`p-8 border text-center transition-all hover:-translate-y-2 ${
                  achievement.unlocked
                    ? 'bg-hot/10 border-hot'
                    : 'bg-black border-white/20 opacity-50'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="text-5xl mb-4">{achievement.icon}</div>
                <h4 className="text-white mb-2" style={{ fontWeight: 700 }}>{achievement.name}</h4>
                {achievement.unlocked ? (
                  <span className="px-3 py-1 bg-lime text-black text-xs uppercase tracking-wider" style={{ fontWeight: 700 }}>
                    Unlocked
                  </span>
                ) : (
                  <p className="text-white/40 text-sm">
                    {achievement.progress}/{achievement.requirement}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl md:text-5xl uppercase tracking-[-0.03em] text-white mb-8" style={{ fontWeight: 900 }}>
            Recent Activity
          </h3>
          <div className="space-y-4">
            {mockActivity.map((activity, i) => (
              <motion.div
                key={activity.id}
                className="p-6 bg-black border border-white/20 hover:border-hot transition-all"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-white text-xl mb-2" style={{ fontWeight: 700 }}>{activity.title}</h4>
                    <p className="text-white/60">{activity.description}</p>
                  </div>
                  <div className="text-right">
                    {activity.xp !== 0 && (
                      <div className="text-hot text-2xl mb-1" style={{ fontWeight: 700 }}>
                        {activity.xp > 0 ? '+' : ''}{activity.xp} XP
                      </div>
                    )}
                    <div className="text-white/40">{activity.time}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}