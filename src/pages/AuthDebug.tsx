/**
 * Auth Debug Page - Check auth state
 */

import { useAuth } from '../contexts/AuthContext';

export function AuthDebug() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-hot uppercase tracking-wider mb-6" style={{ fontWeight: 900, fontSize: '32px' }}>
          Auth Debug
        </h1>

        <div className="bg-white/5 border border-white/10 p-6 space-y-4">
          <div>
            <div className="text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
              Loading:
            </div>
            <div className="text-white" style={{ fontWeight: 700, fontSize: '16px' }}>
              {loading ? '⏳ YES' : '✅ NO'}
            </div>
          </div>

          <div>
            <div className="text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
              User:
            </div>
            <div className="text-white" style={{ fontWeight: 700, fontSize: '16px' }}>
              {user ? '✅ LOGGED IN' : '❌ NOT LOGGED IN'}
            </div>
          </div>

          {user && (
            <>
              <div>
                <div className="text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                  Email:
                </div>
                <div className="text-white" style={{ fontWeight: 400, fontSize: '14px' }}>
                  {user.email}
                </div>
              </div>

              <div>
                <div className="text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                  Role:
                </div>
                <div className="text-hot uppercase" style={{ fontWeight: 900, fontSize: '14px' }}>
                  {user.role || 'USER'}
                </div>
              </div>

              <div>
                <div className="text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                  User ID:
                </div>
                <div className="text-white font-mono" style={{ fontWeight: 400, fontSize: '12px' }}>
                  {user.id}
                </div>
              </div>
            </>
          )}

          <div>
            <div className="text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
              LocalStorage Flags:
            </div>
            <div className="text-white font-mono space-y-1" style={{ fontWeight: 400, fontSize: '12px' }}>
              <div>hotmess_dev_auth_bypass: {localStorage.getItem('hotmess_dev_auth_bypass') || 'false'}</div>
              <div>hotmess_admin_override: {localStorage.getItem('hotmess_admin_override') || 'false'}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AuthDebug;