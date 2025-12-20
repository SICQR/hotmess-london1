/**
 * Admin Quick Access - Floating button for dev/admin mode
 * Includes dev bypass toggles for testing
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Upload, X, Lock, Unlock, LogOut, UserX } from 'lucide-react';
import { RouteId } from '../lib/routes';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface AdminQuickAccessProps {
  onNavigate: (route: RouteId) => void;
}

export function AdminQuickAccess({ onNavigate }: AdminQuickAccessProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [authBypass, setAuthBypass] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    // Check current bypass status
    const bypass = localStorage.getItem('hotmess_dev_auth_bypass') === 'true';
    setAuthBypass(bypass);
  }, [isOpen]); // Refresh when panel opens

  // ALWAYS show the button now (even when not logged in) for dev bypass access
  // Previously: if (!user) return null;

  const enableAdminMode = () => {
    localStorage.setItem('hotmess_admin_override', 'true');
    alert('Admin mode enabled! Reloading...');
    window.location.reload();
  };

  function toggleAuthBypass() {
    const newValue = !authBypass;
    setAuthBypass(newValue);
    localStorage.setItem('hotmess_dev_auth_bypass', String(newValue));
    
    if (newValue) {
      alert('🔓 Auth bypass enabled! Reload the page to auto-login as dev user.');
    } else {
      alert('🔒 Auth bypass disabled! Reload the page to require real login.');
    }
  }

  async function handleLogout() {
    try {
      await signOut();
      toast.success('Logged out successfully!');
      setIsOpen(false);
      onNavigate('home');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  }

  async function handleSwitchUser() {
    try {
      await signOut();
      toast.success('Logged out! Redirecting to login...');
      setIsOpen(false);
      setTimeout(() => onNavigate('login'), 500);
    } catch (error: any) {
      console.error('Switch user error:', error);
      toast.error('Failed to switch user');
    }
  }

  const isAdmin = user?.role === 'admin';

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 z-[100] bg-hot hover:bg-white text-white hover:text-black p-4 border-2 border-white shadow-lg transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{ fontWeight: 900 }}
      >
        <Settings size={24} />
      </motion.button>

      {/* Popup Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-40 right-4 z-[100] bg-black border-2 border-hot w-80 shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-hot/30">
              <div className="flex items-center gap-2">
                <Settings className="text-hot" size={20} />
                <span className="text-white uppercase tracking-wider" style={{ fontWeight: 900, fontSize: '14px' }}>
                  Admin Tools
                </span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-hot transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* User Info */}
              <div className="bg-white/5 border border-white/10 p-3">
                <div className="text-white/60 uppercase tracking-wider mb-1" style={{ fontWeight: 700, fontSize: '11px' }}>
                  Logged in as:
                </div>
                <div className="text-white" style={{ fontWeight: 700, fontSize: '13px' }}>
                  {user?.email}
                </div>
                <div className={`mt-2 inline-block px-2 py-1 ${isAdmin ? 'bg-hot' : 'bg-white/10'} text-white uppercase tracking-wider`} style={{ fontWeight: 900, fontSize: '10px' }}>
                  {isAdmin ? 'ADMIN' : user?.role || 'USER'}
                </div>
              </div>

              {/* Enable Admin Mode */}
              {!isAdmin && (
                <button
                  onClick={enableAdminMode}
                  className="w-full bg-hot hover:bg-white text-white hover:text-black px-4 py-3 uppercase tracking-wider transition-all border-2 border-hot"
                  style={{ fontWeight: 900, fontSize: '13px' }}
                >
                  Enable Admin Mode
                </button>
              )}

              {/* Admin Actions */}
              {isAdmin && (
                <>
                  <div className="text-white/40 uppercase tracking-wider mb-2" style={{ fontWeight: 900, fontSize: '11px' }}>
                    Quick Actions:
                  </div>
                  
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setIsOpen(false);
                    }}
                    className="w-full bg-white/10 hover:bg-hot/20 border border-white/20 hover:border-hot text-white px-4 py-3 uppercase tracking-wider transition-all text-left flex items-center gap-3"
                    style={{ fontWeight: 700, fontSize: '13px' }}
                  >
                    <Settings size={16} />
                    Admin Dashboard
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('rawManager');
                      setIsOpen(false);
                    }}
                    className="w-full bg-white/10 hover:bg-hot/20 border border-white/20 hover:border-hot text-white px-4 py-3 uppercase tracking-wider transition-all text-left flex items-center gap-3"
                    style={{ fontWeight: 700, fontSize: '13px' }}
                  >
                    <Upload size={16} />
                    RAW Manager
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('adminRecordsUpload');
                      setIsOpen(false);
                    }}
                    className="w-full bg-white/10 hover:bg-hot/20 border border-white/20 hover:border-hot text-white px-4 py-3 uppercase tracking-wider transition-all text-left flex items-center gap-3"
                    style={{ fontWeight: 700, fontSize: '13px' }}
                  >
                    <Upload size={16} />
                    Upload Records
                  </button>
                </>
              )}

              {/* Debug Info */}
              <div className="bg-black border border-white/10 p-3 text-xs">
                <div className="text-white/40 uppercase tracking-wider mb-2" style={{ fontWeight: 900, fontSize: '10px' }}>
                  Debug Info:
                </div>
                <div className="text-white/60 font-mono space-y-1" style={{ fontSize: '10px' }}>
                  <div>User ID: {user?.id.slice(0, 8)}...</div>
                  <div>Role: {user?.role || 'undefined'}</div>
                  <div>Admin Override: {localStorage.getItem('hotmess_admin_override') || 'false'}</div>
                </div>
              </div>

              {/* Dev Bypass Toggle */}
              <button
                onClick={toggleAuthBypass}
                className="w-full bg-hot hover:bg-white text-white hover:text-black px-4 py-3 uppercase tracking-wider transition-all border-2 border-hot flex items-center justify-center gap-2"
                style={{ fontWeight: 900, fontSize: '13px' }}
              >
                {authBypass ? <Unlock size={16} /> : <Lock size={16} />}
                {authBypass ? 'Disable Auth Bypass' : 'Enable Auth Bypass'}
              </button>

              {/* Logout & Switch User Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleLogout}
                  className="w-full bg-white/10 hover:bg-hot border border-white/20 hover:border-hot text-white px-4 py-3 uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  style={{ fontWeight: 900, fontSize: '13px' }}
                >
                  <LogOut size={16} />
                  Logout
                </button>

                <button
                  onClick={handleSwitchUser}
                  className="w-full bg-white/10 hover:bg-hot border border-white/20 hover:border-hot text-white px-4 py-3 uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  style={{ fontWeight: 900, fontSize: '13px' }}
                >
                  <UserX size={16} />
                  Switch User
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}