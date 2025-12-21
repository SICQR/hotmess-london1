import { motion } from 'motion/react';
import { Home, Radio, Shield } from 'lucide-react';
import { RouteId } from '../lib/routes';

interface NotFoundProps {
  onNavigate: (route: RouteId) => void;
}

export function NotFound({ onNavigate }: NotFoundProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        {/* 404 Display */}
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative inline-block"
          >
            <h1 
              className="text-[120px] md:text-[180px] leading-none text-hotmess-red"
              style={{ fontWeight: 900 }}
            >
              404
            </h1>
            <div className="absolute inset-0 bg-hotmess-red/20 blur-3xl -z-10" />
          </motion.div>
        </div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 mb-12"
        >
          <h2 className="text-white">
            Wrong door. Happens.
          </h2>
          
          <p className="text-hotmess-gray-300 max-w-md mx-auto">
            This page doesn't exist, moved, or never did. But you're still welcome here.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {/* Home */}
          <button
            onClick={() => onNavigate('home')}
            className="group p-6 bg-hotmess-red/10 border-2 border-hotmess-red hover:bg-hotmess-red transition-all duration-300"
          >
            <Home className="w-8 h-8 text-hotmess-red group-hover:text-black mx-auto mb-3 transition-colors" />
            <div className="text-white group-hover:text-black transition-colors uppercase tracking-wider">
              Home
            </div>
            <p className="text-hotmess-gray-400 group-hover:text-black/70 text-sm mt-2 transition-colors">
              Start fresh
            </p>
          </button>

          {/* Radio */}
          <button
            onClick={() => onNavigate('radio')}
            className="group p-6 bg-hotmess-pink/10 border-2 border-hotmess-pink hover:bg-hotmess-pink transition-all duration-300"
          >
            <Radio className="w-8 h-8 text-hotmess-pink group-hover:text-black mx-auto mb-3 transition-colors" />
            <div className="text-white group-hover:text-black transition-colors uppercase tracking-wider">
              Listen Live
            </div>
            <p className="text-hotmess-gray-400 group-hover:text-black/70 text-sm mt-2 transition-colors">
              24/7 radio
            </p>
          </button>

          {/* Privacy Hub */}
          <button
            onClick={() => onNavigate('dataPrivacy')}
            className="group p-6 bg-hotmess-purple/10 border-2 border-hotmess-purple hover:bg-hotmess-purple transition-all duration-300"
          >
            <Shield className="w-8 h-8 text-hotmess-purple group-hover:text-black mx-auto mb-3 transition-colors" />
            <div className="text-white group-hover:text-black transition-colors uppercase tracking-wider">
              Privacy Hub
            </div>
            <p className="text-hotmess-gray-400 group-hover:text-black/70 text-sm mt-2 transition-colors">
              Your data
            </p>
          </button>
        </motion.div>

        {/* Additional help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 pt-8 border-t border-hotmess-gray-800"
        >
          <p className="text-hotmess-gray-500 text-sm">
            Looking for something specific?{' '}
            <button
              onClick={() => onNavigate('care')}
              className="text-hotmess-gray-400 hover:text-white underline transition-colors"
            >
              Contact support
            </button>
          </p>
        </motion.div>

        {/* Background decoration */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-hotmess-red/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-hotmess-pink/5 rounded-full blur-3xl" />
        </div>
      </motion.div>
    </div>
  );
}