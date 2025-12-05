import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
import { ShieldAlert, Lock } from 'lucide-react';

interface RoleGateProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

export function RoleGate({ children, allowedRoles, fallback }: RoleGateProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  if (!user) {
    return (
      fallback || (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
          <EmptyState
            icon={ShieldAlert}
            title="NOT AUTHORIZED"
            message="You need to be logged in to access this area."
            primaryAction={{
              label: 'GO TO LOGIN',
              onClick: () => window.location.href = '/?route=login'
            }}
            secondaryAction={{
              label: 'GO HOME',
              onClick: () => window.location.href = '/'
            }}
          />
        </div>
      )
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      fallback || (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
          <EmptyState
            icon={Lock}
            title="ACCESS DENIED"
            message="You don't have permission to access this area. Contact support if you believe this is an error."
            primaryAction={{
              label: 'GO HOME',
              onClick: () => window.location.href = '/'
            }}
            secondaryAction={{
              label: 'CONTACT SUPPORT',
              onClick: () => window.location.href = '/?route=care'
            }}
          />
        </div>
      )
    );
  }

  return <>{children}</>;
}