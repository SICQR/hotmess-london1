/**
 * SETTINGS
 * User settings and preferences
 */

import { useState, useEffect } from 'react';
import { RouteId } from '../lib/routes';
import { useAuth } from '../contexts/AuthContext';
import { getAccessTokenAsync } from '../lib/auth';
import { publicAnonKey } from '../utils/supabase/info';
import { getFunctionsBaseUrl } from '../lib/supabase-functions-base';
import { toast } from 'sonner';
import {
  ArrowLeft,
  User,
  Bell,
  Lock,
  Globe,
  MapPin,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  Shield,
  Trash2,
  LogOut,
  Save,
  Loader2,
  Upload,
  Camera
} from 'lucide-react';

interface SettingsProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface UserSettings {
  // Profile
  displayName: string;
  bio: string;
  avatar?: string;
  email: string;
  profileType: 'clubber' | 'promoter' | 'dj' | 'venue' | 'artist' | 'other';
  
  // Privacy
  profileVisibility: 'public' | 'friends' | 'private';
  showLocation: boolean;
  showActivity: boolean;
  showStats: boolean;
  
  // Notifications
  pushEnabled: boolean;
  emailEnabled: boolean;
  eventReminders: boolean;
  messageNotifications: boolean;
  beaconAlerts: boolean;
  
  // Preferences
  theme: 'dark' | 'light' | 'auto';
  soundEnabled: boolean;
  autoPlayRadio: boolean;
  language: 'en' | 'es' | 'de' | 'fr';
  
  // Location
  defaultCity?: string;
  shareLocationAlways: boolean;
}

export function Settings({ onNavigate }: SettingsProps) {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    displayName: '',
    bio: '',
    email: user?.email || '',
    profileType: 'clubber',
    profileVisibility: 'public',
    showLocation: true,
    showActivity: true,
    showStats: true,
    pushEnabled: true,
    emailEnabled: true,
    eventReminders: true,
    messageNotifications: true,
    beaconAlerts: true,
    theme: 'dark',
    soundEnabled: true,
    autoPlayRadio: false,
    language: 'en',
    shareLocationAlways: false,
  });
  const [uploading, setUploading] = useState(false);

  const [activeSection, setActiveSection] = useState<'profile' | 'privacy' | 'notifications' | 'preferences' | 'account'>('profile');

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    try {
      if (!user) return;

      // Get access token (fallback to publicAnonKey for dev bypass)
      let accessToken = await getAccessTokenAsync();
      if (!accessToken) {
        console.log('⚠️ No access token, using publicAnonKey (dev mode)');
        accessToken = publicAnonKey;
      }

      const response = await fetch(
        `${getFunctionsBaseUrl()}/api/users/${user.id}/settings`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
      } else {
        console.error('Failed to load settings:', await response.text());
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      console.log('💾 Starting save settings...');
      console.log('💾 User ID:', user?.id);
      console.log('💾 Settings to save:', settings);

      // Get access token (fallback to publicAnonKey for dev bypass)
      let accessToken = await getAccessTokenAsync();
      if (!accessToken) {
        console.log('⚠️ No access token, using publicAnonKey (dev mode)');
        accessToken = publicAnonKey;
      }

      const url = `${getFunctionsBaseUrl()}/api/users/${user?.id}/settings`;
      console.log('💾 Request URL:', url);
      
      const response = await fetch(
        url,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(settings),
        }
      );

      console.log('💾 Response status:', response.status);
      console.log('💾 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Failed to save settings - Response:', errorText);
        throw new Error('Failed to save');
      }

      const result = await response.json();
      console.log('✅ Save successful, result:', result);

      toast.success('Settings saved');
    } catch (error) {
      console.error('❌ Failed to save settings - Error:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out');
      onNavigate('home');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure? This action cannot be undone.')) {
      toast.error('Account deletion not yet implemented');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      
      // Create form data
      const formData = new FormData();
      formData.append('avatar', file);
      
      // Get access token
      let accessToken = await getAccessTokenAsync();
      if (!accessToken) {
        accessToken = publicAnonKey;
      }
      
      // Upload to server
      const response = await fetch(
        `${getFunctionsBaseUrl()}/api/users/${user?.id}/avatar`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { avatarUrl } = await response.json();
      setSettings(prev => ({ ...prev, avatar: avatarUrl }));
      toast.success('Profile picture updated');
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ff1694] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('profile')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 style={{ fontWeight: 900, fontSize: '24px' }}>SETTINGS</h1>
                <p className="text-white/40" style={{ fontWeight: 400, fontSize: '12px' }}>
                  Manage your account
                </p>
              </div>
            </div>

            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-6 py-2 bg-[#ff1694] hover:bg-[#ff1694]/80 disabled:opacity-50 transition-colors flex items-center gap-2"
              style={{ fontWeight: 900, fontSize: '14px' }}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  SAVING...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  SAVE
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <nav className="lg:col-span-1">
            <div className="space-y-2">
              <NavButton
                icon={<User className="w-4 h-4" />}
                label="Profile"
                active={activeSection === 'profile'}
                onClick={() => setActiveSection('profile')}
              />
              <NavButton
                icon={<Shield className="w-4 h-4" />}
                label="Privacy"
                active={activeSection === 'privacy'}
                onClick={() => setActiveSection('privacy')}
              />
              <NavButton
                icon={<Bell className="w-4 h-4" />}
                label="Notifications"
                active={activeSection === 'notifications'}
                onClick={() => setActiveSection('notifications')}
              />
              <NavButton
                icon={<Smartphone className="w-4 h-4" />}
                label="Preferences"
                active={activeSection === 'preferences'}
                onClick={() => setActiveSection('preferences')}
              />
              <NavButton
                icon={<Lock className="w-4 h-4" />}
                label="Account"
                active={activeSection === 'account'}
                onClick={() => setActiveSection('account')}
              />
            </div>
          </nav>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {activeSection === 'profile' && (
              <Section title="Profile Settings">
                {/* Avatar Upload */}
                <div>
                  <label className="block mb-2" style={{ fontWeight: 700, fontSize: '14px' }}>
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center overflow-hidden">
                      {settings.avatar ? (
                        <img src={settings.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-white/20" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        id="avatar-upload"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="avatar-upload"
                        className={`inline-flex items-center gap-2 px-4 py-2 bg-[#ff1694] hover:bg-[#ff1694]/80 transition-colors cursor-pointer ${
                          uploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        style={{ fontWeight: 900, fontSize: '14px' }}
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            UPLOADING...
                          </>
                        ) : (
                          <>
                            <Camera className="w-4 h-4" />
                            CHANGE PHOTO
                          </>
                        )}
                      </label>
                      <p className="text-white/40 mt-2" style={{ fontWeight: 400, fontSize: '12px' }}>
                        Max 5MB • JPG, PNG, GIF
                      </p>
                    </div>
                  </div>
                </div>
                
                <InputField
                  label="Email Address"
                  value={settings.email}
                  onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                />
                
                <InputField
                  label="Display Name"
                  value={settings.displayName}
                  onChange={(e) => setSettings(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="Your display name"
                />
                
                <TextAreaField
                  label="Bio"
                  value={settings.bio}
                  onChange={(e) => setSettings(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
                
                <SelectField
                  label="Profile Type"
                  value={settings.profileType}
                  onChange={(e) => setSettings(prev => ({ ...prev, profileType: e.target.value as any }))}
                  options={[
                    { value: 'clubber', label: '🎉 Clubber' },
                    { value: 'promoter', label: '📢 Promoter' },
                    { value: 'dj', label: '🎧 DJ / Producer' },
                    { value: 'venue', label: '🏢 Venue Owner' },
                    { value: 'artist', label: '🎨 Artist / Performer' },
                    { value: 'other', label: '✨ Other' },
                  ]}
                />
              </Section>
            )}

            {activeSection === 'privacy' && (
              <Section title="Privacy Settings">
                <SelectField
                  label="Profile Visibility"
                  value={settings.profileVisibility}
                  onChange={(e) => setSettings(prev => ({ ...prev, profileVisibility: e.target.value as any }))}
                  options={[
                    { value: 'public', label: 'Public - Anyone can see' },
                    { value: 'friends', label: 'Friends Only' },
                    { value: 'private', label: 'Private - Only me' },
                  ]}
                />
                <ToggleField
                  label="Show Location"
                  description="Let others see your city"
                  checked={settings.showLocation}
                  onChange={(checked) => setSettings(prev => ({ ...prev, showLocation: checked }))}
                  icon={<MapPin className="w-4 h-4" />}
                />
                <ToggleField
                  label="Show Activity"
                  description="Display your recent activity"
                  checked={settings.showActivity}
                  onChange={(checked) => setSettings(prev => ({ ...prev, showActivity: checked }))}
                  icon={<Eye className="w-4 h-4" />}
                />
                <ToggleField
                  label="Show Stats"
                  description="Display your XP and achievements"
                  checked={settings.showStats}
                  onChange={(checked) => setSettings(prev => ({ ...prev, showStats: checked }))}
                  icon={<User className="w-4 h-4" />}
                />
              </Section>
            )}

            {activeSection === 'notifications' && (
              <Section title="Notification Settings">
                <ToggleField
                  label="Push Notifications"
                  description="Receive push notifications on this device"
                  checked={settings.pushEnabled}
                  onChange={(checked) => setSettings(prev => ({ ...prev, pushEnabled: checked }))}
                  icon={<Bell className="w-4 h-4" />}
                />
                <ToggleField
                  label="Email Notifications"
                  description="Receive notifications via email"
                  checked={settings.emailEnabled}
                  onChange={(checked) => setSettings(prev => ({ ...prev, emailEnabled: checked }))}
                  icon={<Mail className="w-4 h-4" />}
                />
                <ToggleField
                  label="Event Reminders"
                  description="Get reminded about upcoming events"
                  checked={settings.eventReminders}
                  onChange={(checked) => setSettings(prev => ({ ...prev, eventReminders: checked }))}
                  icon={<Bell className="w-4 h-4" />}
                />
                <ToggleField
                  label="Message Notifications"
                  description="Notifications for new messages"
                  checked={settings.messageNotifications}
                  onChange={(checked) => setSettings(prev => ({ ...prev, messageNotifications: checked }))}
                  icon={<Mail className="w-4 h-4" />}
                />
                <ToggleField
                  label="Beacon Alerts"
                  description="Get notified about nearby beacons"
                  checked={settings.beaconAlerts}
                  onChange={(checked) => setSettings(prev => ({ ...prev, beaconAlerts: checked }))}
                  icon={<MapPin className="w-4 h-4" />}
                />
              </Section>
            )}

            {activeSection === 'preferences' && (
              <Section title="App Preferences">
                <SelectField
                  label="Theme"
                  value={settings.theme}
                  onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value as any }))}
                  options={[
                    { value: 'dark', label: '🌙 Dark (HOTMESS Default)' },
                    { value: 'light', label: '☀️ Light' },
                    { value: 'auto', label: '🔄 Auto' },
                  ]}
                />
                <SelectField
                  label="Language"
                  value={settings.language}
                  onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value as any }))}
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Español' },
                    { value: 'de', label: 'Deutsch' },
                    { value: 'fr', label: 'Français' },
                  ]}
                />
                <ToggleField
                  label="Sound Effects"
                  description="Play sound effects throughout the app"
                  checked={settings.soundEnabled}
                  onChange={(checked) => setSettings(prev => ({ ...prev, soundEnabled: checked }))}
                  icon={settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                />
                <ToggleField
                  label="Auto-Play Radio"
                  description="Start playing radio on app launch"
                  checked={settings.autoPlayRadio}
                  onChange={(checked) => setSettings(prev => ({ ...prev, autoPlayRadio: checked }))}
                  icon={<Volume2 className="w-4 h-4" />}
                />
                <ToggleField
                  label="Always Share Location"
                  description="Share your location for better recommendations"
                  checked={settings.shareLocationAlways}
                  onChange={(checked) => setSettings(prev => ({ ...prev, shareLocationAlways: checked }))}
                  icon={<MapPin className="w-4 h-4" />}
                />
              </Section>
            )}

            {activeSection === 'account' && (
              <Section title="Account Management">
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-5 h-5 text-[#ff1694]" />
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>Email</span>
                    </div>
                    <p className="text-white/60" style={{ fontWeight: 400, fontSize: '14px' }}>
                      {user?.email || 'Not set'}
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="w-5 h-5 text-[#ff1694]" />
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>User ID</span>
                    </div>
                    <p className="text-white/60 font-mono" style={{ fontWeight: 400, fontSize: '12px' }}>
                      {user?.id || 'Not available'}
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-[#ff1694]" />
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>Role</span>
                    </div>
                    <p className="text-white/60" style={{ fontWeight: 400, fontSize: '14px' }}>
                      {user?.role || 'USER'}
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-6 mt-6 space-y-3">
                    <button
                      onClick={handleLogout}
                      className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 transition-colors flex items-center justify-center gap-2"
                      style={{ fontWeight: 900, fontSize: '14px' }}
                    >
                      <LogOut className="w-4 h-4" />
                      LOGOUT
                    </button>

                    <button
                      onClick={handleDeleteAccount}
                      className="w-full px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-500 transition-colors flex items-center justify-center gap-2"
                      style={{ fontWeight: 900, fontSize: '14px' }}
                    >
                      <Trash2 className="w-4 h-4" />
                      DELETE ACCOUNT
                    </button>
                  </div>
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component Helpers
function NavButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
        active
          ? 'bg-[#ff1694] text-white'
          : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
      }`}
      style={{ fontWeight: 700, fontSize: '14px' }}
    >
      {icon}
      {label}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <h2 style={{ fontWeight: 900, fontSize: '20px' }}>{title}</h2>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block mb-2" style={{ fontWeight: 700, fontSize: '14px' }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-[#ff1694] focus:outline-none transition-colors"
        style={{ fontWeight: 400, fontSize: '14px' }}
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 3 }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number }) {
  return (
    <div>
      <label className="block mb-2" style={{ fontWeight: 700, fontSize: '14px' }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-[#ff1694] focus:outline-none transition-colors resize-none"
        style={{ fontWeight: 400, fontSize: '14px' }}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="block mb-2" style={{ fontWeight: 700, fontSize: '14px' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:border-[#ff1694] focus:outline-none transition-colors"
        style={{ fontWeight: 400, fontSize: '14px' }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-black">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleField({ label, description, checked, onChange, icon }: { label: string; description?: string; checked: boolean; onChange: (checked: boolean) => void; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 bg-white/5 border border-white/10 rounded-lg p-4">
      <div className="flex items-start gap-3 flex-1">
        {icon && <div className="text-[#ff1694] mt-1">{icon}</div>}
        <div>
          <div style={{ fontWeight: 700, fontSize: '14px' }}>{label}</div>
          {description && (
            <p className="text-white/40 mt-1" style={{ fontWeight: 400, fontSize: '12px' }}>
              {description}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-[#ff1694]' : 'bg-white/20'
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}