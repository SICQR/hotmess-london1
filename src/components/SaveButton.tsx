// components/SaveButton.tsx
// Universal save button for any content type

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import { saveContent, unsaveContent, checkSaved, type ContentType } from '../lib/saved-api';
import { useAuth } from '../contexts/AuthContext';

interface SaveButtonProps {
  contentType: ContentType;
  contentId: string;
  metadata?: {
    title?: string;
    description?: string;
    image?: string;
    location?: string;
    date?: string;
    [key: string]: any;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function SaveButton({
  contentType,
  contentId,
  metadata,
  className = '',
  size = 'md',
  showLabel = false
}: SaveButtonProps) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if already saved on mount
  useEffect(() => {
    if (!user) {
      setChecking(false);
      return;
    }

    const checkStatus = async () => {
      const { saved: isSaved } = await checkSaved(contentType, contentId);
      setSaved(isSaved);
      setChecking(false);
    };

    checkStatus();
  }, [user, contentType, contentId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Could trigger login modal here
      alert('Please log in to save content');
      return;
    }

    setLoading(true);

    if (saved) {
      // Unsave
      const { error } = await unsaveContent(contentType, contentId);
      if (!error) {
        setSaved(false);
      } else {
        console.error('Failed to unsave:', error);
      }
    } else {
      // Save
      const { error } = await saveContent(contentType, contentId, metadata);
      if (!error) {
        setSaved(true);
      } else {
        console.error('Failed to save:', error);
      }
    }

    setLoading(false);
  };

  // Size variants
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (!user) {
    return null; // Hide button if not logged in
  }

  if (checking) {
    return (
      <div 
        className={`${sizeClasses[size]} flex items-center justify-center bg-white/5 border border-white/20 ${className}`}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className={`${iconSizes[size]} border-2 border-white/40 border-t-transparent rounded-full`}
        />
      </div>
    );
  }

  return (
    <motion.button
      onClick={handleToggle}
      disabled={loading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${showLabel ? 'px-4 py-2 gap-2' : sizeClasses[size]}
        flex items-center justify-center
        transition-all
        ${saved 
          ? 'bg-hot text-white border border-hot' 
          : 'bg-white/5 text-white/60 hover:text-white border border-white/20 hover:border-white/40'
        }
        ${className}
      `}
      title={saved ? `Unsave this ${contentType}` : `Save this ${contentType}`}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className={`${iconSizes[size]} border-2 border-current border-t-transparent rounded-full`}
        />
      ) : (
        <>
          <Bookmark 
            className={iconSizes[size]}
            fill={saved ? 'currentColor' : 'none'}
          />
          {showLabel && (
            <span className="uppercase tracking-wider" style={{ fontWeight: 700 }}>
              {saved ? 'Saved' : 'Save'}
            </span>
          )}
        </>
      )}
    </motion.button>
  );
}
