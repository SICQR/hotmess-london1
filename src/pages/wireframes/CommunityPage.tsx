/**
 * COMMUNITY PAGE WIREFRAME
 * Mobile-first → Tablet → Desktop
 */

import { Users, MessageCircle, Calendar, Trophy, TrendingUp } from 'lucide-react';
import { HMButton } from '../../components/library/HMButton';
import { HMTabs } from '../../components/library/HMTabs';
import { HMInput } from '../../components/library/HMInput';

interface CommunityPageProps {
  onNavigate: (page: string) => void;
}

export function CommunityPage({ onNavigate }: CommunityPageProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="px-6 py-16 border-b border-hot/30">
        <div className="max-w-7xl mx-auto">
          <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl text-hot uppercase tracking-wider">
            Brotherhood
          </h1>
          <p className="text-gray-300 max-w-2xl">
            The HOTMESS community. Connect, share, show up.
          </p>
        </div>
      </section>

      {/* Community Stats */}
      <section className="px-6 py-12 bg-charcoal/50">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <Users size={32} className="mx-auto mb-2 text-hot" />
            <div className="text-3xl text-white mb-1">2,847</div>
            <div className="text-sm text-gray-400">Members</div>
          </div>
          <div className="text-center">
            <MessageCircle size={32} className="mx-auto mb-2 text-hot" />
            <div className="text-3xl text-white mb-1">12,483</div>
            <div className="text-sm text-gray-400">Posts</div>
          </div>
          <div className="text-center">
            <Calendar size={32} className="mx-auto mb-2 text-hot" />
            <div className="text-3xl text-white mb-1">142</div>
            <div className="text-sm text-gray-400">Events</div>
          </div>
          <div className="text-center">
            <Trophy size={32} className="mx-auto mb-2 text-hot" />
            <div className="text-3xl text-white mb-1">89,234</div>
            <div className="text-sm text-gray-400">Total XP</div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <HMTabs
            tabs={[
              {
                id: 'feed',
                label: 'Feed',
                content: (
                  <div className="space-y-6">
                    {/* Post Composer */}
                    <div className="p-6 bg-black/50 border border-hot/30">
                      <HMInput
                        variant="text"
                        placeholder="What's on your mind?"
                        className="mb-4"
                      />
                      <div className="flex justify-end">
                        <HMButton variant="primary" size="sm">
                          Post
                        </HMButton>
                      </div>
                    </div>

                    {/* Feed Posts */}
                    {[
                      {
                        author: 'HeatSeeker',
                        time: '2 hours ago',
                        content: 'Just hit Level 12! Thanks to everyone who showed up at Vauxhall last night. You lot are unreal. 🔥',
                        likes: 24,
                        comments: 8,
                      },
                      {
                        author: 'NightMess',
                        time: '5 hours ago',
                        content: 'Anyone going to the Hand N Hand session on Sunday? First time and feeling nervous.',
                        likes: 12,
                        comments: 15,
                      },
                      {
                        author: 'SweatKing',
                        time: '1 day ago',
                        content: 'New RAW collection just dropped. The mesh shorts are elite. +20 XP too.',
                        likes: 45,
                        comments: 6,
                      },
                    ].map((post, i) => (
                      <div key={i} className="p-6 bg-black/50 border border-hot/30 hover:border-hot transition-colors">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-hot to-heat rounded-full" />
                          <div className="flex-1">
                            <h4 className="text-white mb-1">{post.author}</h4>
                            <p className="text-sm text-gray-500">{post.time}</p>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4">{post.content}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                          <button className="hover:text-hot transition-colors">
                            ❤️ {post.likes}
                          </button>
                          <button className="hover:text-hot transition-colors">
                            💬 {post.comments}
                          </button>
                          <button className="hover:text-hot transition-colors">
                            Share
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="text-center">
                      <HMButton variant="tertiary">Load More</HMButton>
                    </div>
                  </div>
                ),
              },
              {
                id: 'events',
                label: 'Events',
                content: (
                  <div className="space-y-6">
                    {[
                      {
                        name: 'HOTMESS: Warehouse Heat',
                        date: 'Fri, Dec 27',
                        time: '10PM-4AM',
                        location: 'Vauxhall (Address on ticket)',
                        going: 142,
                      },
                      {
                        name: 'Hand N Hand Sunday Session',
                        date: 'Sun, Dec 29',
                        time: '2PM-4PM',
                        location: 'Community Centre, Soho',
                        going: 23,
                      },
                      {
                        name: 'New Year Mess',
                        date: 'Tue, Dec 31',
                        time: '11PM-6AM',
                        location: 'TBA',
                        going: 289,
                      },
                    ].map((event, i) => (
                      <div key={i} className="p-6 bg-black/50 border border-hot/30 hover:border-hot hover:shadow-[0_0_30px_rgba(231,15,60,0.6)] transition-all">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="text-xl text-white mb-2 uppercase tracking-wider">
                              {event.name}
                            </h4>
                            <div className="space-y-1 text-sm text-gray-400">
                              <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                <span>{event.date} • {event.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users size={14} />
                                <span>{event.going} going</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>📍 {event.location}</span>
                              </div>
                            </div>
                          </div>
                          <HMButton variant="primary" size="sm">
                            I'm Going
                          </HMButton>
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                id: 'leaderboard',
                label: 'Leaderboard',
                content: (
                  <div className="space-y-4">
                    {[
                      { rank: 1, name: 'HeatSeeker', xp: 28847, level: 24, trend: 'up' },
                      { rank: 2, name: 'NightMess', xp: 24293, level: 21, trend: 'up' },
                      { rank: 3, name: 'SweatKing', xp: 22847, level: 20, trend: 'down' },
                      { rank: 4, name: 'VauxhallBoy', xp: 19293, level: 18, trend: 'same' },
                      { rank: 5, name: 'MessyBeast', xp: 17482, level: 16, trend: 'up' },
                      { rank: 6, name: 'SohoHeat', xp: 15847, level: 15, trend: 'up' },
                      { rank: 7, name: 'ClaphamKing', xp: 14293, level: 14, trend: 'down' },
                      { rank: 8, name: 'NightbodyUK', xp: 13482, level: 13, trend: 'same' },
                      { rank: 9, name: 'HungryBoy', xp: 12847, level: 13, trend: 'up' },
                      { rank: 10, name: 'RawEnergy', xp: 11293, level: 12, trend: 'up' },
                    ].map((user) => (
                      <div
                        key={user.rank}
                        className="flex items-center gap-4 p-4 bg-black/50 border border-hot/30 hover:border-hot transition-colors"
                      >
                        <div className={`w-16 h-16 flex items-center justify-center text-2xl ${
                          user.rank <= 3
                            ? 'bg-hot/20 border-2 border-hot text-hot'
                            : 'bg-gray-900 border border-gray-700 text-gray-400'
                        }`}>
                          #{user.rank}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white mb-1">{user.name}</h4>
                          <p className="text-sm text-gray-400">Level {user.level}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-hot font-bold">{user.xp.toLocaleString()}</span>
                            {user.trend === 'up' && <TrendingUp size={16} className="text-neon-lime" />}
                            {user.trend === 'down' && <TrendingUp size={16} className="text-red-500 rotate-180" />}
                          </div>
                          <p className="text-xs text-gray-500">Total XP</p>
                        </div>
                      </div>
                    ))}

                    <div className="text-center pt-6">
                      <HMButton variant="tertiary">View Full Rankings</HMButton>
                    </div>
                  </div>
                ),
              },
            ]}
            defaultTab="feed"
          />
        </div>
      </section>

      {/* Community Guidelines CTA */}
      <section className="px-6 py-16 bg-black/50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="mb-4 text-2xl text-hot uppercase tracking-wider">
            Community Guidelines
          </h3>
          <p className="mb-8 text-gray-300">
            Care-first community. No cruelty. No shame. Just brotherhood.
          </p>
          <HMButton variant="secondary" onClick={() => onNavigate('legal')}>
            Read Guidelines
          </HMButton>
        </div>
      </section>
    </div>
  );
}
