import { useState, useEffect } from 'react';
import { RouteId } from '../lib/routes';
import { 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Clock, 
  TrendingUp,
  Zap,
  Code,
  Database,
  Palette,
  Globe,
  ShoppingCart,
  Radio,
  Users,
  Shield,
  type LucideIcon,
} from 'lucide-react';

interface ProjectDashboardProps {
  onNavigate: (route: RouteId) => void;
}

interface FeatureArea {
  id: string;
  name: string;
  icon: LucideIcon;
  progress: number; // 0-100
  status: 'complete' | 'in-progress' | 'not-started' | 'needs-polish';
  tasks: Task[];
  priority: 'high' | 'medium' | 'low';
  lastUpdated?: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  blockedBy?: string[];
}

export function ProjectDashboard({ onNavigate }: ProjectDashboardProps) {
  const [featureAreas, setFeatureAreas] = useState<FeatureArea[]>([]);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadProjectStatus();
    
    if (autoRefresh) {
      const interval = setInterval(loadProjectStatus, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadProjectStatus = async () => {
    // This will be replaced with actual codebase scanning
    const areas: FeatureArea[] = [
      {
        id: 'night-pulse',
        name: 'Night Pulse Globe',
        icon: Globe,
        progress: 85,
        status: 'in-progress',
        priority: 'high',
        lastUpdated: new Date().toISOString(),
        tasks: [
          { id: 'np-1', title: 'Create NightPulseGlobeRealtime component', completed: true, priority: 'high' },
          { id: 'np-2', title: 'Implement useNightPulseRealtime hook', completed: true, priority: 'high' },
          { id: 'np-3', title: 'Database migration (night_pulse_realtime.sql)', completed: false, priority: 'high' },
          { id: 'np-4', title: 'Add fallback data aggregation', completed: false, priority: 'high' },
          { id: 'np-5', title: 'Fix analytics 405 errors', completed: false, priority: 'medium' },
          { id: 'np-6', title: 'Add schema health checks', completed: false, priority: 'medium' },
          { id: 'np-7', title: 'Remove duplicate globe components', completed: false, priority: 'low' },
        ]
      },
      {
        id: 'beacons',
        name: 'Beacon System',
        icon: Zap,
        progress: 90,
        status: 'needs-polish',
        priority: 'high',
        tasks: [
          { id: 'b-1', title: 'Beacon hub page', completed: true, priority: 'high' },
          { id: 'b-2', title: 'Beacon creation flow', completed: true, priority: 'high' },
          { id: 'b-3', title: 'Beacon management dashboard', completed: true, priority: 'high' },
          { id: 'b-4', title: 'QR code generation', completed: true, priority: 'medium' },
          { id: 'b-5', title: 'Scan analytics', completed: true, priority: 'medium' },
          { id: 'b-6', title: 'Backend API wiring', completed: false, priority: 'high' },
          { id: 'b-7', title: 'Beacon detail/edit page', completed: false, priority: 'medium' },
        ]
      },
      {
        id: 'tickets',
        name: 'Tickets & Events',
        icon: ShoppingCart,
        progress: 75,
        status: 'in-progress',
        priority: 'high',
        tasks: [
          { id: 't-1', title: 'Ticket browse page', completed: true, priority: 'high' },
          { id: 't-2', title: 'Ticket purchase flow', completed: true, priority: 'high' },
          { id: 't-3', title: 'My Tickets page', completed: true, priority: 'high' },
          { id: 't-4', title: 'Order confirmation', completed: false, priority: 'high' },
          { id: 't-5', title: 'Stripe integration', completed: false, priority: 'high' },
          { id: 't-6', title: 'QR ticket generation', completed: false, priority: 'medium' },
          { id: 't-7', title: 'Ticket transfer', completed: false, priority: 'low' },
        ]
      },
      {
        id: 'connect',
        name: 'Connect (Dating/Hookups)',
        icon: Users,
        progress: 60,
        status: 'in-progress',
        priority: 'medium',
        tasks: [
          { id: 'c-1', title: 'Connect hub page', completed: true, priority: 'high' },
          { id: 'c-2', title: 'Profile creation', completed: true, priority: 'high' },
          { id: 'c-3', title: 'Intent creation flow', completed: true, priority: 'high' },
          { id: 'c-4', title: 'Thread/messaging system', completed: true, priority: 'high' },
          { id: 'c-5', title: 'Discovery/matching algorithm', completed: false, priority: 'high' },
          { id: 'c-6', title: 'Photo upload', completed: false, priority: 'medium' },
          { id: 'c-7', title: 'Blocking/reporting', completed: false, priority: 'high' },
        ]
      },
      {
        id: 'radio',
        name: 'HOTMESS Radio',
        icon: Radio,
        progress: 100,
        status: 'complete',
        priority: 'medium',
        tasks: [
          { id: 'r-1', title: 'Radio player component', completed: true, priority: 'high' },
          { id: 'r-2', title: 'Schedule page', completed: true, priority: 'high' },
          { id: 'r-3', title: 'Show detail pages', completed: true, priority: 'medium' },
          { id: 'r-4', title: 'Episode player', completed: true, priority: 'medium' },
          { id: 'r-5', title: 'Now playing page', completed: true, priority: 'low' },
        ]
      },
      {
        id: 'messmarket',
        name: 'MessMarket',
        icon: ShoppingCart,
        progress: 70,
        status: 'in-progress',
        priority: 'medium',
        tasks: [
          { id: 'm-1', title: 'Product browse', completed: true, priority: 'high' },
          { id: 'm-2', title: 'Product detail pages', completed: true, priority: 'high' },
          { id: 'm-3', title: 'Checkout flow', completed: true, priority: 'high' },
          { id: 'm-4', title: 'Vendor profiles', completed: false, priority: 'high' },
          { id: 'm-5', title: 'Order management', completed: false, priority: 'medium' },
          { id: 'm-6', title: 'Vendor onboarding', completed: false, priority: 'medium' },
        ]
      },
      {
        id: 'auth',
        name: 'Authentication & Onboarding',
        icon: Shield,
        progress: 80,
        status: 'needs-polish',
        priority: 'high',
        tasks: [
          { id: 'a-1', title: 'Age gate', completed: true, priority: 'high' },
          { id: 'a-2', title: 'Arrival flow (5 pages)', completed: true, priority: 'high' },
          { id: 'a-3', title: 'Login/register', completed: true, priority: 'high' },
          { id: 'a-4', title: 'Password reset', completed: true, priority: 'medium' },
          { id: 'a-5', title: 'QR login', completed: true, priority: 'low' },
          { id: 'a-6', title: 'Profile completion flow', completed: false, priority: 'medium' },
          { id: 'a-7', title: 'Email verification', completed: false, priority: 'high' },
        ]
      },
      {
        id: 'database',
        name: 'Database & Backend',
        icon: Database,
        progress: 65,
        status: 'in-progress',
        priority: 'high',
        tasks: [
          { id: 'd-1', title: 'Supabase schema setup', completed: true, priority: 'high' },
          { id: 'd-2', title: 'RLS policies', completed: true, priority: 'high' },
          { id: 'd-3', title: 'Night Pulse migration', completed: false, priority: 'high', blockedBy: ['np-3'] },
          { id: 'd-4', title: 'Edge functions deployed', completed: true, priority: 'medium' },
          { id: 'd-5', title: 'Realtime subscriptions', completed: true, priority: 'medium' },
          { id: 'd-6', title: 'Database indexes optimized', completed: false, priority: 'medium' },
        ]
      },
      {
        id: 'design',
        name: 'Design System',
        icon: Palette,
        progress: 100,
        status: 'complete',
        priority: 'low',
        tasks: [
          { id: 'ds-1', title: 'Typography system', completed: true, priority: 'high' },
          { id: 'ds-2', title: 'Color palette', completed: true, priority: 'high' },
          { id: 'ds-3', title: 'Component library', completed: true, priority: 'medium' },
          { id: 'ds-4', title: 'Canonical copy constants', completed: true, priority: 'medium' },
          { id: 'ds-5', title: 'Responsive breakpoints', completed: true, priority: 'medium' },
        ]
      },
    ];

    setFeatureAreas(areas);
  };

  // Calculate overall stats
  const totalTasks = featureAreas.reduce((sum, area) => sum + area.tasks.length, 0);
  const completedTasks = featureAreas.reduce(
    (sum, area) => sum + area.tasks.filter(t => t.completed).length, 
    0
  );
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const highPriorityIncomplete = featureAreas.filter(
    area => area.priority === 'high' && area.status !== 'complete'
  ).length;

  const getStatusColor = (status: FeatureArea['status']) => {
    switch (status) {
      case 'complete': return 'text-green-500';
      case 'in-progress': return 'text-blue-500';
      case 'needs-polish': return 'text-yellow-500';
      case 'not-started': return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: FeatureArea['status']) => {
    switch (status) {
      case 'complete': return CheckCircle2;
      case 'in-progress': return Clock;
      case 'needs-polish': return AlertCircle;
      case 'not-started': return Circle;
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-gray-500';
    }
  };

  const selectedAreaData = featureAreas.find(a => a.id === selectedArea);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-black via-[#ff1694]/10 to-black">
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 style={{ fontWeight: 900, fontSize: '48px', letterSpacing: '-0.02em', lineHeight: '1' }}>
                PROJECT DASHBOARD
              </h1>
              <p className="text-white/40 mt-2" style={{ fontWeight: 400, fontSize: '14px' }}>
                Real-time build status • Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input 
                  type="checkbox" 
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-white/60">Auto-refresh (30s)</span>
              </label>
              <button
                onClick={loadProjectStatus}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded transition-colors"
                style={{ fontWeight: 700, fontSize: '12px' }}
              >
                🔄 REFRESH NOW
              </button>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-4 gap-6 mt-8">
            <div className="bg-gradient-to-br from-[#ff1694]/20 to-transparent border border-[#ff1694]/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-[#ff1694]" />
                <span className="text-white/60 uppercase" style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em' }}>
                  Overall Progress
                </span>
              </div>
              <div style={{ fontWeight: 900, fontSize: '48px', color: '#ff1694' }}>
                {overallProgress}%
              </div>
              <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#ff1694] to-[#ff0080] transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span className="text-white/60 uppercase" style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em' }}>
                  Tasks Complete
                </span>
              </div>
              <div style={{ fontWeight: 900, fontSize: '48px' }}>
                {completedTasks}<span className="text-white/40 text-2xl">/{totalTasks}</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
                <span className="text-white/60 uppercase" style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em' }}>
                  High Priority
                </span>
              </div>
              <div style={{ fontWeight: 900, fontSize: '48px' }}>
                {highPriorityIncomplete}
              </div>
              <p className="text-white/40 mt-1" style={{ fontSize: '11px' }}>
                areas need attention
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Code className="w-6 h-6 text-blue-500" />
                <span className="text-white/60 uppercase" style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em' }}>
                  Feature Areas
                </span>
              </div>
              <div style={{ fontWeight: 900, fontSize: '48px' }}>
                {featureAreas.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Feature Areas List */}
          <div className="col-span-5 space-y-3">
            <h2 style={{ fontWeight: 900, fontSize: '20px', marginBottom: '16px' }}>
              FEATURE AREAS
            </h2>

            {featureAreas
              .sort((a, b) => {
                // Sort by priority, then by progress
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                }
                return b.progress - a.progress;
              })
              .map((area) => {
                const Icon = area.icon;
                const StatusIcon = getStatusIcon(area.status);
                const tasksComplete = area.tasks.filter(t => t.completed).length;
                const isSelected = selectedArea === area.id;

                return (
                  <button
                    key={area.id}
                    onClick={() => setSelectedArea(area.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      isSelected 
                        ? 'bg-[#ff1694]/10 border-[#ff1694]' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-[#ff1694]" />
                        <div>
                          <h3 style={{ fontWeight: 700, fontSize: '16px' }}>
                            {area.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusIcon className={`w-4 h-4 ${getStatusColor(area.status)}`} />
                            <span className={`text-xs uppercase ${getStatusColor(area.status)}`} style={{ fontWeight: 600 }}>
                              {area.status.replace('-', ' ')}
                            </span>
                            <span className={`text-xs uppercase ml-2 ${getPriorityColor(area.priority)}`} style={{ fontWeight: 600 }}>
                              {area.priority} priority
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div style={{ fontWeight: 900, fontSize: '24px', color: area.progress === 100 ? '#10b981' : '#ff1694' }}>
                          {area.progress}%
                        </div>
                        <div className="text-white/40" style={{ fontSize: '11px' }}>
                          {tasksComplete}/{area.tasks.length} tasks
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          area.progress === 100 
                            ? 'bg-green-500' 
                            : 'bg-gradient-to-r from-[#ff1694] to-[#ff0080]'
                        }`}
                        style={{ width: `${area.progress}%` }}
                      />
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Task Detail Panel */}
          <div className="col-span-7">
            {selectedAreaData ? (
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 style={{ fontWeight: 900, fontSize: '28px' }}>
                      {selectedAreaData.name}
                    </h2>
                    <p className="text-white/60 mt-2" style={{ fontSize: '14px' }}>
                      {selectedAreaData.tasks.filter(t => t.completed).length} of {selectedAreaData.tasks.length} tasks complete
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedArea(null)}
                    className="text-white/40 hover:text-white transition-colors"
                    style={{ fontSize: '24px' }}
                  >
                    ×
                  </button>
                </div>

                {/* Tasks List */}
                <div className="space-y-3">
                  {selectedAreaData.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border ${
                        task.completed 
                          ? 'bg-green-900/10 border-green-500/30' 
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                        ) : (
                          <Circle className="w-5 h-5 text-white/40 mt-0.5" />
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h4 className={`${task.completed ? 'line-through text-white/40' : ''}`} style={{ fontWeight: 600, fontSize: '14px' }}>
                              {task.title}
                            </h4>
                            <span className={`text-xs uppercase ${getPriorityColor(task.priority)}`} style={{ fontWeight: 700 }}>
                              {task.priority}
                            </span>
                          </div>
                          
                          {task.blockedBy && task.blockedBy.length > 0 && (
                            <div className="mt-2 text-xs text-yellow-500">
                              ⚠️ Blocked by: {task.blockedBy.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Next Steps */}
                <div className="mt-8 p-4 bg-[#ff1694]/10 border border-[#ff1694]/30 rounded-lg">
                  <h3 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px' }}>
                    📋 RECOMMENDED NEXT STEPS
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {selectedAreaData.tasks
                      .filter(t => !t.completed && t.priority === 'high')
                      .slice(0, 3)
                      .map(task => (
                        <li key={task.id} className="flex items-start gap-2">
                          <span className="text-[#ff1694] mt-1">→</span>
                          <span>{task.title}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-lg p-12 text-center">
                <Code className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/40" style={{ fontSize: '16px' }}>
                  Select a feature area to see tasks
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
