/**
 * ADMIN DASHBOARD PAGE WIREFRAME
 * Mobile-first → Tablet → Desktop
 */

import { Users, ShoppingBag, MapPin, Radio, AlertCircle, TrendingUp, Activity } from 'lucide-react';
import { HMButton } from '../../components/library/HMButton';
import { HMTabs } from '../../components/library/HMTabs';
import { HMInput } from '../../components/library/HMInput';
import { HMToggle } from '../../components/library/HMToggle';
import { useState } from 'react';

interface AdminDashboardPageProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="px-6 py-16 border-b border-hot/30">
        <div className="max-w-7xl mx-auto">
          <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl text-hot uppercase tracking-wider">
            Admin Dashboard
          </h1>
          <p className="text-gray-300">
            System overview and management
          </p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="px-6 py-12 bg-charcoal/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-black/50 border border-hot/30">
              <Users size={24} className="mb-3 text-hot" />
              <div className="text-2xl text-white mb-1">2,847</div>
              <div className="text-sm text-gray-400">Total Users</div>
              <div className="mt-2 flex items-center gap-1 text-xs text-neon-lime">
                <TrendingUp size={12} />
                +12% this week
              </div>
            </div>
            <div className="p-6 bg-black/50 border border-hot/30">
              <MapPin size={24} className="mb-3 text-hot" />
              <div className="text-2xl text-white mb-1">142</div>
              <div className="text-sm text-gray-400">Beacon Scans (24h)</div>
              <div className="mt-2 text-xs text-gray-500">23 active beacons</div>
            </div>
            <div className="p-6 bg-black/50 border border-hot/30">
              <ShoppingBag size={24} className="mb-3 text-hot" />
              <div className="text-2xl text-white mb-1">£12,847</div>
              <div className="text-sm text-gray-400">Shop Revenue (30d)</div>
              <div className="mt-2 flex items-center gap-1 text-xs text-neon-lime">
                <TrendingUp size={12} />
                +8% vs last month
              </div>
            </div>
            <div className="p-6 bg-black/50 border border-hot/30">
              <Radio size={24} className="mb-3 text-hot" />
              <div className="text-2xl text-white mb-1">847</div>
              <div className="text-sm text-gray-400">Radio Listeners</div>
              <div className="mt-2 text-xs text-gray-500">Live now</div>
            </div>
          </div>
        </div>
      </section>

      {/* System Status */}
      <section className="px-6 py-8 bg-hot/10 border-y border-hot/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Activity size={24} className="text-neon-lime" />
              <div>
                <h4 className="text-white">System Status: All Systems Operational</h4>
                <p className="text-sm text-gray-400">Last checked: 2 minutes ago</p>
              </div>
            </div>
            <HMToggle
              label="Maintenance Mode"
              enabled={maintenanceMode}
              onChange={setMaintenanceMode}
            />
          </div>
        </div>
      </section>

      {/* Admin Tools */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <HMTabs
            tabs={[
              {
                id: 'users',
                label: 'Users',
                content: (
                  <div>
                    <div className="mb-6">
                      <HMInput
                        variant="text"
                        placeholder="Search users by name, email, or ID..."
                      />
                    </div>

                    <div className="space-y-3">
                      {[
                        { id: 'U001', name: 'HeatSeeker', email: 'heat@example.com', level: 24, xp: 28847, joined: 'Nov 2024', status: 'active' },
                        { id: 'U002', name: 'NightMess', email: 'night@example.com', level: 21, xp: 24293, joined: 'Nov 2024', status: 'active' },
                        { id: 'U003', name: 'SweatKing', email: 'sweat@example.com', level: 20, xp: 22847, joined: 'Nov 2024', status: 'suspended' },
                      ].map((user) => (
                        <div key={user.id} className="p-6 bg-black/50 border border-hot/30">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-white">{user.name}</h4>
                                <span className={`px-2 py-0.5 text-xs uppercase ${
                                  user.status === 'active'
                                    ? 'bg-neon-lime/20 text-neon-lime border border-neon-lime'
                                    : 'bg-red-500/20 text-red-500 border border-red-500'
                                }`}>
                                  {user.status}
                                </span>
                              </div>
                              <div className="text-sm text-gray-400 space-y-1">
                                <div>ID: {user.id} • {user.email}</div>
                                <div>Level {user.level} • {user.xp.toLocaleString()} XP</div>
                                <div>Joined: {user.joined}</div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <HMButton variant="tertiary" size="sm">
                                View
                              </HMButton>
                              <HMButton variant="tertiary" size="sm">
                                Edit
                              </HMButton>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                id: 'beacons',
                label: 'Beacons',
                content: (
                  <div>
                    <div className="mb-8 flex items-center justify-between">
                      <h3 className="text-xl text-hot uppercase tracking-wider">
                        Manage Beacons
                      </h3>
                      <HMButton variant="primary" size="sm">
                        Add Beacon
                      </HMButton>
                    </div>

                    <div className="space-y-3">
                      {[
                        { id: 'B001', name: 'Vauxhall Heat', location: 'Vauxhall, SE11', active: true, scans: 142, xpReward: 50 },
                        { id: 'B002', name: 'Soho Pulse', location: 'Soho, W1D', active: true, scans: 89, xpReward: 35 },
                        { id: 'B003', name: 'Shoreditch Sweat', location: 'Shoreditch, E2', active: true, scans: 45, xpReward: 25 },
                        { id: 'B004', name: 'King\'s Cross Zone', location: 'King\'s Cross, N1', active: false, scans: 12, xpReward: 15 },
                      ].map((beacon) => (
                        <div key={beacon.id} className="p-6 bg-black/50 border border-hot/30">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-white">{beacon.name}</h4>
                                <span className={`px-2 py-0.5 text-xs uppercase ${
                                  beacon.active
                                    ? 'bg-neon-lime/20 text-neon-lime border border-neon-lime'
                                    : 'bg-gray-700/20 text-gray-500 border border-gray-700'
                                }`}>
                                  {beacon.active ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              <div className="text-sm text-gray-400 space-y-1">
                                <div>ID: {beacon.id} • {beacon.location}</div>
                                <div>{beacon.scans} scans today • {beacon.xpReward} XP reward</div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <HMButton variant="tertiary" size="sm">
                                Edit
                              </HMButton>
                              <HMButton variant="tertiary" size="sm">
                                {beacon.active ? 'Deactivate' : 'Activate'}
                              </HMButton>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                id: 'content',
                label: 'Content',
                content: (
                  <div className="space-y-8">
                    {/* Radio Shows */}
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-hot uppercase tracking-wider">Radio Shows</h4>
                        <HMButton variant="primary" size="sm">
                          Add Show
                        </HMButton>
                      </div>
                      <div className="space-y-3">
                        {[
                          { name: 'Nightbody Mixes', host: 'Nic Denton', schedule: 'Fri 10PM-2AM', status: 'live' },
                          { name: 'Hand N Hand Sunday', host: 'Stewart Who?', schedule: 'Sun 2PM-4PM', status: 'scheduled' },
                        ].map((show, i) => (
                          <div key={i} className="p-4 bg-black/50 border border-hot/30 flex items-center justify-between">
                            <div>
                              <h5 className="text-white mb-1">{show.name}</h5>
                              <p className="text-sm text-gray-400">{show.host} • {show.schedule}</p>
                            </div>
                            <HMButton variant="tertiary" size="sm">
                              Edit
                            </HMButton>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Events */}
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-hot uppercase tracking-wider">Events</h4>
                        <HMButton variant="primary" size="sm">
                          Create Event
                        </HMButton>
                      </div>
                      <div className="space-y-3">
                        {[
                          { name: 'HOTMESS: Warehouse Heat', date: 'Dec 27', attendees: 142 },
                          { name: 'New Year Mess', date: 'Dec 31', attendees: 289 },
                        ].map((event, i) => (
                          <div key={i} className="p-4 bg-black/50 border border-hot/30 flex items-center justify-between">
                            <div>
                              <h5 className="text-white mb-1">{event.name}</h5>
                              <p className="text-sm text-gray-400">{event.date} • {event.attendees} going</p>
                            </div>
                            <HMButton variant="tertiary" size="sm">
                              Edit
                            </HMButton>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: 'reports',
                label: 'Reports',
                content: (
                  <div className="space-y-4">
                    {[
                      { id: 'R001', type: 'User Report', reporter: 'HeatSeeker', reported: 'BadActor', reason: 'Harassment', date: '2 hours ago', status: 'pending' },
                      { id: 'R002', type: 'Content Report', reporter: 'NightMess', reported: 'Post #4829', reason: 'Inappropriate content', date: '5 hours ago', status: 'resolved' },
                    ].map((report) => (
                      <div key={report.id} className="p-6 bg-black/50 border border-hot/30">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <AlertCircle size={20} className="text-hot" />
                              <h4 className="text-white">{report.type}</h4>
                              <span className={`px-2 py-0.5 text-xs uppercase ${
                                report.status === 'resolved'
                                  ? 'bg-neon-lime/20 text-neon-lime border border-neon-lime'
                                  : 'bg-heat/20 text-heat border border-heat'
                              }`}>
                                {report.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-400 space-y-1">
                              <div>Reporter: {report.reporter}</div>
                              <div>Reported: {report.reported}</div>
                              <div>Reason: {report.reason}</div>
                              <div>{report.date}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <HMButton variant="primary" size="sm">
                              Review
                            </HMButton>
                            <HMButton variant="tertiary" size="sm">
                              Dismiss
                            </HMButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                id: 'settings',
                label: 'Settings',
                content: (
                  <div className="space-y-8 max-w-2xl">
                    {/* System Settings */}
                    <div>
                      <h4 className="mb-4 text-hot uppercase tracking-wider">System Settings</h4>
                      <div className="space-y-4">
                        <HMToggle
                          label="Maintenance Mode"
                          enabled={maintenanceMode}
                          onChange={setMaintenanceMode}
                        />
                        <HMToggle
                          label="New User Registrations"
                          enabled={true}
                          onChange={() => {}}
                        />
                        <HMToggle
                          label="Public Leaderboard"
                          enabled={true}
                          onChange={() => {}}
                        />
                      </div>
                    </div>

                    {/* XP Settings */}
                    <div className="pt-8 border-t border-hot/30">
                      <h4 className="mb-4 text-hot uppercase tracking-wider">XP & Rewards</h4>
                      <div className="space-y-4">
                        <HMInput
                          variant="text"
                          label="Base Beacon XP"
                          value="25"
                          type="number"
                        />
                        <HMInput
                          variant="text"
                          label="XP for Level 1"
                          value="1000"
                          type="number"
                        />
                        <HMInput
                          variant="text"
                          label="Level Multiplier"
                          value="1.5"
                          type="number"
                        />
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-8">
                      <HMButton variant="primary">
                        Save Changes
                      </HMButton>
                    </div>
                  </div>
                ),
              },
            ]}
            defaultTab="users"
          />
        </div>
      </section>
    </div>
  );
}
