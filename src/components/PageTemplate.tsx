import { motion } from 'motion/react';
import { ArrowLeft, type LucideIcon } from 'lucide-react';
import { RouteId } from '../lib/routes';

interface PageTemplateProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  backRoute?: RouteId;
  backLabel?: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
  children: React.ReactNode;
}

export function PageTemplate({
  title,
  subtitle,
  icon: Icon,
  backRoute,
  backLabel,
  onNavigate,
  children,
}: PageTemplateProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Back button */}
      {backRoute && (
        <div className="border-b border-white/10 px-6 lg:px-12 py-6">
          <button
            onClick={() => onNavigate(backRoute)}
            className="flex items-center gap-2 text-white/60 hover:text-hot transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '12px' }}>
              {backLabel || 'Back'}
            </span>
          </button>
        </div>
      )}

      {/* Hero */}
      <div className="border-b border-white/10 px-6 lg:px-12 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {Icon && (
            <Icon size={48} className="text-hot mb-6" strokeWidth={2.5} />
          )}
          <h1 
            className="text-white uppercase tracking-[-0.03em] leading-none mb-6"
            style={{ fontWeight: 900, fontSize: 'clamp(48px, 10vw, 120px)' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p 
              className="text-white/60 max-w-3xl text-lg"
            >
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>

      {/* Content */}
      <div className="px-6 lg:px-12 py-12">
        {children}
      </div>
    </div>
  );
}
