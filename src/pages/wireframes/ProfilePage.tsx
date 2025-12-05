/**
 * PROFILE PAGE WIREFRAME
 * Mobile-first → Tablet → Desktop
 */

import { User, Zap, MapPin, ShoppingBag, Settings, Share2, Edit } from 'lucide-react';
import { HMButton } from '../../components/library/HMButton';
import { HMXPMeter } from '../../components/library/HMXPMeter';
import { HMTabs } from '../../components/library/HMTabs';
import { HMToggle } from '../../components/library/HMToggle';
import { HMInput } from '../../components/library/HMInput';
import { useState } from 'react';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const [autoScan, setAutoScan] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen">
      {/* Profile Header */}
      <section className="px-6 py-16 bg-gradient-to-b from-charcoal/50 to-transparent border-b border-hot/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gradient-to-br from-hot to-heat rounded-full flex items-center justify-center border-4 border-hot">
              <User size={64} className="text-white" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="mb-2 text-3xl md:text-4xl text-white uppercase tracking-wider">
                HeatSeeker
              </h1>
              <p className="mb-4 text-gray-400">Member since Nov 2024</p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
                <div className="px-4 py-2 bg-black/50 border border-hot/30">
                  <div className="text-xs text-gray-400 mb-1">Level</div>
                  <div className="text-2xl text-hot">12</div>
                </div>
                <div className="px-4 py-2 bg-black/50 border border-hot/30">
                  <div className="text-xs text-gray-400 mb-1">Total XP</div>
                  <div className="text-2xl text-hot">28,847</div>
                </div>
                <div className="px-4 py-2 bg-black/50 border border-hot/30">
                  <div className="text-xs text-gray-400 mb-1">Scans</div>
                  <div className="text-2xl text-hot">142</div>
                </div>
              </div>

              <div className="flex gap-3 justify-center md:justify-start">
                <HMButton variant="secondary" icon={<Edit size={16} />} size="sm">
                  Edit Profile
                </HMButton>
                <HMButton variant="tertiary" icon={<Share2 size={16} />} size="sm">
                  Share
                </HMButton>
              </div>
            </div>
          </div>

          {/* Current Level Progress */}
          <div className="mt-8">
            <HMXPMeter current={2847} max={5000} level={12} />
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <HMTabs
            tabs={[
              {
                id: 'activity',
                label: 'Activity',
                content: (
                  <div className="space-y-4">
                    {/* Recent Activity */}
                    {[
                      { type: 'scan', location: 'Vauxhall Heat', xp: 50, time: '2 hours ago' },
                      { type: 'purchase', item: 'Sweat Tank', xp: 25, time: '1 day ago' },
                      { type: 'scan', location: 'Soho Pulse', xp: 35, time: '2 days ago' },
                      { type: 'reward', item: 'Free Drink Token', xp: -500, time: '3 days ago' },
                      { type: 'scan', location: 'Shoreditch Sweat', xp: 25, time: '4 days ago' },
                    ].map((activity, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 bg-black/50 border border-hot/30"
                      >
                        <div className="w-12 h-12 flex items-center justify-center bg-hot/20 border border-hot">
                          {activity.type === 'scan' && <MapPin size={24} className="text-hot" />}
                          {activity.type === 'purchase' && <ShoppingBag size={24} className="text-hot" />}
                          {activity.type === 'reward' && <Zap size={24} className="text-hot" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white mb-1">
                            {activity.type === 'scan' && `Scanned ${activity.location}`}
                            {activity.type === 'purchase' && `Purchased ${activity.item}`}
                            {activity.type === 'reward' && `Redeemed ${activity.item}`}
                          </h4>
                          <p className="text-sm text-gray-400">{activity.time}</p>
                        </div>
                        <div className={`flex items-center gap-1 ${activity.xp > 0 ? 'text-neon-lime' : 'text-gray-400'}`}>
                          {activity.xp > 0 ? '+' : ''}{activity.xp} XP
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                id: 'stats',
                label: 'Stats',
                content: (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-black/50 border border-hot/30">
                      <h4 className="mb-4 text-hot uppercase tracking-wider">Scan Stats</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Scans</span>
                          <span className="text-white">142</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Unique Beacons</span>
                          <span className="text-white">23</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Hottest Streak</span>
                          <span className="text-white">8 days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">XP from Scans</span>
                          <span className="text-hot">4,250 XP</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-black/50 border border-hot/30">
                      <h4 className="mb-4 text-hot uppercase tracking-wider">Shop Stats</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Spent</span>
                          <span className="text-white">£342</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Items Purchased</span>
                          <span className="text-white">8</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Favorite Collection</span>
                          <span className="text-white">RAW</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">XP from Purchases</span>
                          <span className="text-hot">180 XP</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-black/50 border border-hot/30">
                      <h4 className="mb-4 text-hot uppercase tracking-wider">Community Stats</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Events Attended</span>
                          <span className="text-white">12</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Connections</span>
                          <span className="text-white">47</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Posts</span>
                          <span className="text-white">23</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-black/50 border border-hot/30">
                      <h4 className="mb-4 text-hot uppercase tracking-wider">Achievements</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Early Adopter</span>
                          <span className="text-neon-lime text-xs uppercase">✓ Unlocked</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Beacon Hunter</span>
                          <span className="text-neon-lime text-xs uppercase">✓ Unlocked</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Night Owl</span>
                          <span className="text-gray-600 text-xs uppercase">Locked</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: 'settings',
                label: 'Settings',
                content: (
                  <div className="space-y-8">
                    {/* Account Settings */}
                    <div>
                      <h4 className="mb-4 text-hot uppercase tracking-wider">Account</h4>
                      <div className="space-y-4">
                        <HMInput
                          variant="text"
                          label="Display Name"
                          value="HeatSeeker"
                        />
                        <HMInput
                          variant="email"
                          label="Email"
                          value="heat@example.com"
                        />
                        <HMButton variant="primary" size="sm">
                          Save Changes
                        </HMButton>
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="pt-8 border-t border-hot/30">
                      <h4 className="mb-4 text-hot uppercase tracking-wider">Privacy</h4>
                      <div className="space-y-4">
                        <HMToggle
                          label="Show Profile to Community"
                          enabled={true}
                          onChange={() => {}}
                        />
                        <HMToggle
                          label="Share Activity on Leaderboard"
                          enabled={true}
                          onChange={() => {}}
                        />
                        <HMToggle
                          label="Allow Direct Messages"
                          enabled={notifications}
                          onChange={setNotifications}
                        />
                      </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="pt-8 border-t border-hot/30">
                      <h4 className="mb-4 text-hot uppercase tracking-wider">Notifications</h4>
                      <div className="space-y-4">
                        <HMToggle
                          label="Beacon Nearby Alerts"
                          enabled={autoScan}
                          onChange={setAutoScan}
                        />
                        <HMToggle
                          label="Event Reminders"
                          enabled={true}
                          onChange={() => {}}
                        />
                        <HMToggle
                          label="Radio Show Notifications"
                          enabled={false}
                          onChange={() => {}}
                        />
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-8 border-t border-red-900/30">
                      <h4 className="mb-4 text-red-500 uppercase tracking-wider">Danger Zone</h4>
                      <HMButton variant="tertiary" size="sm">
                        Delete Account
                      </HMButton>
                    </div>
                  </div>
                ),
              },
            ]}
            defaultTab="activity"
          />
        </div>
      </section>
    </div>
  );
}
