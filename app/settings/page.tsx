'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { User, Settings as SettingsIcon, Shield, Bell, Download, Trash2, Link as LinkIcon, Lock, Eye, EyeOff, UserX, Volume2, VolumeX, MapPin, MapPinOff, Globe } from 'lucide-react';
import { LocationConsentModal } from '@/components/LocationConsentModal';
import { useLocationConsent } from '@/hooks/useLocationConsent';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [mutedUsers, setMutedUsers] = useState<any[]>([]);
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);
  const [showLocationConsentModal, setShowLocationConsentModal] = useState(false);
  
  // Location consent hook
  const locationConsent = useLocationConsent();
  
  // Form states
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [notificationPrefs, setNotificationPrefs] = useState({
    email_marketing: true,
    email_updates: true,
    email_tickets: true,
    push_beacons: true,
    push_messages: true,
    push_drops: true,
  });
  const [privacyPrefs, setPrivacyPrefs] = useState({
    profile_public: true,
    show_location: true,
    show_xp: true,
    show_streaks: true,
  });

  useEffect(() => {
    loadUserData();
    loadBlockedUsers();
    loadMutedUsers();
  }, []);

  async function loadUserData() {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push('/login');
        return;
      }

      setUser(authUser);

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setDisplayName(profileData.display_name || '');
        setBio(profileData.bio || '');
        
        // Load preferences from metadata or defaults
        if (profileData.notification_preferences) {
          setNotificationPrefs({ ...notificationPrefs, ...profileData.notification_preferences });
        }
        if (profileData.privacy_preferences) {
          setPrivacyPrefs({ ...privacyPrefs, ...profileData.privacy_preferences });
        }
      }

      // Load connected OAuth providers
      const providers = authUser.app_metadata?.providers || [];
      setConnectedAccounts(providers);

    } catch (error: any) {
      console.error('Load user error:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  }

  async function loadBlockedUsers() {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data } = await supabase
        .from('blocks')
        .select('blocked_id, profiles!blocks_blocked_id_fkey(display_name, email)')
        .eq('blocker_id', authUser.id);

      setBlockedUsers(data || []);
    } catch (error) {
      console.error('Load blocked users error:', error);
    }
  }

  async function loadMutedUsers() {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data } = await supabase
        .from('mutes')
        .select('muted_id, profiles!mutes_muted_id_fkey(display_name, email)')
        .eq('muter_id', authUser.id);

      setMutedUsers(data || []);
    } catch (error) {
      console.error('Load muted users error:', error);
    }
  }

  async function handleUpdateProfile() {
    try {
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          bio: bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      await loadUserData();
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  }

  async function handleUpdateNotifications() {
    try {
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          notification_preferences: notificationPrefs,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Notification preferences updated');
    } catch (error: any) {
      console.error('Update notifications error:', error);
      toast.error(error.message || 'Failed to update preferences');
    }
  }

  async function handleUpdatePrivacy() {
    try {
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          privacy_preferences: privacyPrefs,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Privacy settings updated');
    } catch (error: any) {
      console.error('Update privacy error:', error);
      toast.error(error.message || 'Failed to update privacy settings');
    }
  }

  async function handleExportData() {
    try {
      if (!user) return;

      toast.loading('Preparing your data export...');

      // Gather all user data
      const [profileData, scansData, ticketsData, ordersData, messagesData, libraryData] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('scans').select('*').eq('user_id', user.id),
        supabase.from('ticket_purchases').select('*').eq('buyer_id', user.id),
        supabase.from('market_orders').select('*').eq('buyer_id', user.id),
        supabase.from('messages').select('*').eq('sender_id', user.id),
        supabase.from('records_library').select('*').eq('user_id', user.id),
      ]);

      const exportData = {
        export_date: new Date().toISOString(),
        user_id: user.id,
        email: user.email,
        profile: profileData.data,
        scans: scansData.data || [],
        tickets: ticketsData.data || [],
        orders: ordersData.data || [],
        messages: messagesData.data || [],
        library: libraryData.data || [],
      };

      // Create downloadable JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hotmess-data-export-${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success('Data exported successfully');
    } catch (error: any) {
      toast.dismiss();
      console.error('Export data error:', error);
      toast.error('Failed to export data');
    }
  }

  async function handleDeleteAccount() {
    try {
      if (!user) return;

      toast.loading('Deleting account...');

      // Call backend to handle account deletion
      const response = await fetch(`https://${process.env.VITE_SUPABASE_URL?.replace('https://', '')}/functions/v1/make-server-a670c824/api/users/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      // Sign out
      await supabase.auth.signOut();

      toast.dismiss();
      toast.success('Account deleted successfully');
      router.push('/');
    } catch (error: any) {
      toast.dismiss();
      console.error('Delete account error:', error);
      toast.error('Failed to delete account');
    }
  }

  async function handleUnblockUser(userId: string) {
    try {
      if (!user) return;

      const { error } = await supabase
        .from('blocks')
        .delete()
        .eq('blocker_id', user.id)
        .eq('blocked_id', userId);

      if (error) throw error;

      toast.success('User unblocked');
      await loadBlockedUsers();
    } catch (error: any) {
      console.error('Unblock error:', error);
      toast.error('Failed to unblock user');
    }
  }

  async function handleUnmuteUser(userId: string) {
    try {
      if (!user) return;

      const { error } = await supabase
        .from('mutes')
        .delete()
        .eq('muter_id', user.id)
        .eq('muted_id', userId);

      if (error) throw error;

      toast.success('User unmuted');
      await loadMutedUsers();
    } catch (error: any) {
      console.error('Unmute error:', error);
      toast.error('Failed to unmute user');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl uppercase tracking-tight mb-2" style={{ fontWeight: 900 }}>
            SETTINGS
          </h1>
          <p className="text-white/60">
            Manage your account, privacy, and preferences
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="account" className="data-[state=active]:bg-white/10">
              <User className="w-4 h-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-white/10">
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-white/10">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-white/10">
              <Lock className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="blocked" className="data-[state=active]:bg-white/10">
              <UserX className="w-4 h-4 mr-2" />
              Blocked
            </TabsTrigger>
            <TabsTrigger value="data" className="data-[state=active]:bg-white/10">
              <Download className="w-4 h-4 mr-2" />
              Data
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription className="text-white/60">
                  Update your public profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-white/5 border-white/10"
                  />
                  <p className="text-xs text-white/40">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Account Stats</Label>
                  <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="text-2xl font-bold text-violet-400">{profile?.xp || 0}</div>
                      <div className="text-xs text-white/60">Total XP</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-violet-400">{profile?.level || 1}</div>
                      <div className="text-xs text-white/60">Level</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-violet-400">{profile?.membership_tier?.toUpperCase() || 'FREE'}</div>
                      <div className="text-xs text-white/60">Tier</div>
                    </div>
                  </div>
                </div>

                <Button onClick={handleUpdateProfile} className="w-full bg-violet-600 hover:bg-violet-700">
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription className="text-white/60">
                  Manage your connected social accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['google', 'facebook', 'github'].map((provider) => (
                  <div key={provider} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <LinkIcon className="w-5 h-5 text-white/60" />
                      <div>
                        <div className="font-medium capitalize">{provider}</div>
                        <div className="text-xs text-white/40">
                          {connectedAccounts.includes(provider) ? 'Connected' : 'Not connected'}
                        </div>
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${connectedAccounts.includes(provider) ? 'bg-green-500' : 'bg-white/20'}`} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            {/* Location Consent Management */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#FF0080]" />
                  Location Consent
                </CardTitle>
                <CardDescription className="text-white/60">
                  Control how we use your location (GDPR Article 6)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-start gap-3 mb-4">
                    {locationConsent.mode === 'off' && (
                      <>
                        <MapPinOff className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-400">Location Off</div>
                          <p className="text-sm text-white/60 mt-1">
                            You won't see nearby beacons, heat maps, or location-based features.
                          </p>
                        </div>
                      </>
                    )}
                    {locationConsent.mode === 'approximate' && (
                      <>
                        <Globe className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-blue-400">Approximate Location</div>
                          <p className="text-sm text-white/60 mt-1">
                            City-level location only. Good balance of privacy and features.
                          </p>
                        </div>
                      </>
                    )}
                    {locationConsent.mode === 'precise' && (
                      <>
                        <MapPin className="w-5 h-5 text-[#FF0080] flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-[#FF0080]">Precise Location</div>
                          <p className="text-sm text-white/60 mt-1">
                            GPS coordinates enabled for nearby beacons, heat maps, and full discovery.
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <Button
                    onClick={() => setShowLocationConsentModal(true)}
                    variant="outline"
                    className="w-full border-white/20"
                  >
                    Change Location Mode
                  </Button>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-white/70">
                  <Shield className="w-4 h-4 inline mr-2 text-blue-400" />
                  Privacy-first: We never sell location data. Change this anytime.
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/settings/privacy/consent-log')}
                    className="flex-1 text-sm text-white/60 hover:text-white"
                  >
                    View Consent Log →
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/settings/privacy/cookies')}
                    className="flex-1 text-sm text-white/60 hover:text-white"
                  >
                    Cookie Preferences →
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription className="text-white/60">
                  Control what information is visible to others
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Public Profile</div>
                    <div className="text-sm text-white/60">Allow others to view your profile</div>
                  </div>
                  <Switch
                    checked={privacyPrefs.profile_public}
                    onCheckedChange={(checked) => setPrivacyPrefs({ ...privacyPrefs, profile_public: checked })}
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Show Location</div>
                    <div className="text-sm text-white/60">Display your city on your profile</div>
                  </div>
                  <Switch
                    checked={privacyPrefs.show_location}
                    onCheckedChange={(checked) => setPrivacyPrefs({ ...privacyPrefs, show_location: checked })}
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Show XP & Level</div>
                    <div className="text-sm text-white/60">Display your XP and level publicly</div>
                  </div>
                  <Switch
                    checked={privacyPrefs.show_xp}
                    onCheckedChange={(checked) => setPrivacyPrefs({ ...privacyPrefs, show_xp: checked })}
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Show Streaks</div>
                    <div className="text-sm text-white/60">Display your scan streaks on your profile</div>
                  </div>
                  <Switch
                    checked={privacyPrefs.show_streaks}
                    onCheckedChange={(checked) => setPrivacyPrefs({ ...privacyPrefs, show_streaks: checked })}
                  />
                </div>

                <Button onClick={handleUpdatePrivacy} className="w-full bg-violet-600 hover:bg-violet-700">
                  Save Privacy Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription className="text-white/60">
                  Choose what emails you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Marketing Emails</div>
                    <div className="text-sm text-white/60">Promotions, events, and special offers</div>
                  </div>
                  <Switch
                    checked={notificationPrefs.email_marketing}
                    onCheckedChange={(checked) => setNotificationPrefs({ ...notificationPrefs, email_marketing: checked })}
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Product Updates</div>
                    <div className="text-sm text-white/60">New features and platform updates</div>
                  </div>
                  <Switch
                    checked={notificationPrefs.email_updates}
                    onCheckedChange={(checked) => setNotificationPrefs({ ...notificationPrefs, email_updates: checked })}
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Ticket Updates</div>
                    <div className="text-sm text-white/60">Ticket purchases and transfers</div>
                  </div>
                  <Switch
                    checked={notificationPrefs.email_tickets}
                    onCheckedChange={(checked) => setNotificationPrefs({ ...notificationPrefs, email_tickets: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription className="text-white/60">
                  Manage in-app notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Beacon Notifications</div>
                    <div className="text-sm text-white/60">New beacons near you</div>
                  </div>
                  <Switch
                    checked={notificationPrefs.push_beacons}
                    onCheckedChange={(checked) => setNotificationPrefs({ ...notificationPrefs, push_beacons: checked })}
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Message Notifications</div>
                    <div className="text-sm text-white/60">New messages in threads</div>
                  </div>
                  <Switch
                    checked={notificationPrefs.push_messages}
                    onCheckedChange={(checked) => setNotificationPrefs({ ...notificationPrefs, push_messages: checked })}
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Drop Alerts</div>
                    <div className="text-sm text-white/60">New drops and releases</div>
                  </div>
                  <Switch
                    checked={notificationPrefs.push_drops}
                    onCheckedChange={(checked) => setNotificationPrefs({ ...notificationPrefs, push_drops: checked })}
                  />
                </div>

                <Button onClick={handleUpdateNotifications} className="w-full bg-violet-600 hover:bg-violet-700">
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Password & Security</CardTitle>
                <CardDescription className="text-white/60">
                  Manage your account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="font-medium mb-2">Password</div>
                  <p className="text-sm text-white/60 mb-4">
                    Last changed: {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Never'}
                  </p>
                  <Button variant="outline" className="border-white/20" onClick={() => toast.info('Password reset coming soon')}>
                    Change Password
                  </Button>
                </div>

                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="font-medium mb-2">Two-Factor Authentication</div>
                  <p className="text-sm text-white/60 mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline" className="border-white/20" onClick={() => toast.info('2FA coming soon')}>
                    Enable 2FA
                  </Button>
                </div>

                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="font-medium mb-2">Active Sessions</div>
                  <p className="text-sm text-white/60 mb-4">
                    Manage devices where you're currently logged in
                  </p>
                  <Button variant="outline" className="border-white/20" onClick={() => supabase.auth.signOut()}>
                    Sign Out All Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blocked Tab */}
          <TabsContent value="blocked" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Blocked Users ({blockedUsers.length})</CardTitle>
                <CardDescription className="text-white/60">
                  Users you've blocked won't be able to contact you
                </CardDescription>
              </CardHeader>
              <CardContent>
                {blockedUsers.length === 0 ? (
                  <div className="text-center py-8 text-white/60">
                    <UserX className="w-12 h-12 mx-auto mb-4 opacity-40" />
                    <p>No blocked users</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {blockedUsers.map((block: any) => (
                      <div key={block.blocked_id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <div className="font-medium">{block.profiles?.display_name || 'Unknown User'}</div>
                          <div className="text-sm text-white/40">{block.profiles?.email}</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20"
                          onClick={() => handleUnblockUser(block.blocked_id)}
                        >
                          Unblock
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Muted Users ({mutedUsers.length})</CardTitle>
                <CardDescription className="text-white/60">
                  You won't see content from muted users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mutedUsers.length === 0 ? (
                  <div className="text-center py-8 text-white/60">
                    <VolumeX className="w-12 h-12 mx-auto mb-4 opacity-40" />
                    <p>No muted users</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mutedUsers.map((mute: any) => (
                      <div key={mute.muted_id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <div className="font-medium">{mute.profiles?.display_name || 'Unknown User'}</div>
                          <div className="text-sm text-white/40">{mute.profiles?.email}</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20"
                          onClick={() => handleUnmuteUser(mute.muted_id)}
                        >
                          Unmute
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Download Your Data</CardTitle>
                <CardDescription className="text-white/60">
                  Export all your data in JSON format (GDPR compliant)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex gap-3">
                    <Download className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-400 mb-1">Data Export Includes:</div>
                      <ul className="text-sm text-white/60 space-y-1">
                        <li>• Profile information</li>
                        <li>• Beacon scans and XP history</li>
                        <li>• Ticket purchases</li>
                        <li>• Marketplace orders</li>
                        <li>• Messages and threads</li>
                        <li>• Music library</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button onClick={handleExportData} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export My Data
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-400">Danger Zone</CardTitle>
                <CardDescription className="text-white/60">
                  Irreversible account actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex gap-3">
                    <Trash2 className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-red-400 mb-1">Delete Account</div>
                      <p className="text-sm text-white/60">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete My Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-900 border-red-500/20">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-red-400">Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-white/60">
                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                        <br /><br />
                        <strong className="text-white">This includes:</strong>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• Your profile and account information</li>
                          <li>• All beacon scans and XP progress</li>
                          <li>• Ticket purchases and history</li>
                          <li>• Messages and conversations</li>
                          <li>• Marketplace listings and orders</li>
                          <li>• Music library and downloads</li>
                        </ul>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-white/20">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Yes, Delete My Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Links */}
        <div className="mt-12 pt-6 border-t border-white/10">
          <div className="flex flex-wrap gap-6 text-sm text-white/60">
            <a href="/privacy" className="hover:text-white transition-colors flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy Hub
            </a>
            <a href="/legal" className="hover:text-white transition-colors">Legal & Privacy</a>
            <a href="/care" className="hover:text-white transition-colors">Care & Safety</a>
            <a href="/about" className="hover:text-white transition-colors">About</a>
          </div>
        </div>
      </div>

      {/* Location Consent Modal */}
      <LocationConsentModal
        isOpen={showLocationConsentModal}
        onClose={() => setShowLocationConsentModal(false)}
        onConsent={(mode) => {
          locationConsent.updateMode(mode);
          setShowLocationConsentModal(false);
        }}
        currentMode={locationConsent.mode}
        feature="Location-based features"
      />
    </div>
  );
}