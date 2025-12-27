'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MapPin, MapPinOff, Globe, Shield, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface LocationConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: (mode: 'off' | 'approximate' | 'precise') => void;
  feature?: string; // What feature is requesting location
  currentMode?: 'off' | 'approximate' | 'precise';
}

export function LocationConsentModal({
  isOpen,
  onClose,
  onConsent,
  feature = 'this feature',
  currentMode = 'off'
}: LocationConsentModalProps) {
  const [selectedMode, setSelectedMode] = useState<'off' | 'approximate' | 'precise'>(currentMode);
  const [saving, setSaving] = useState(false);

  const modes = [
    {
      value: 'off' as const,
      icon: MapPinOff,
      label: 'Off',
      description: 'No location tracking. You won\'t see nearby beacons or location-based features.',
      privacy: 'Maximum Privacy',
      color: 'text-gray-400'
    },
    {
      value: 'approximate' as const,
      icon: Globe,
      label: 'Approximate',
      description: 'City-level location only (e.g., "London"). Good balance of privacy and features.',
      privacy: 'Balanced',
      color: 'text-blue-400'
    },
    {
      value: 'precise' as const,
      icon: MapPin,
      label: 'Precise',
      description: 'GPS coordinates for nearby beacons, heat maps, and full discovery features.',
      privacy: 'Full Features',
      color: 'text-[#FF0080]'
    }
  ];

  async function handleSave() {
    try {
      setSaving(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to change location settings');
        return;
      }

      // Call backend function to update consent
      const { data, error } = await (supabase as any).rpc('update_location_consent', {
        p_user_id: user.id,
        p_mode: selectedMode,
        p_ip_address: null, // Browser doesn't expose IP
        p_user_agent: navigator.userAgent
      });

      if (error) throw error;

      toast.success(`Location mode set to: ${selectedMode.toUpperCase()}`);
      onConsent(selectedMode);
      onClose();
    } catch (error: any) {
      console.error('Location consent error:', error);
      toast.error(error.message || 'Failed to update location consent');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-2 border-[#FF0080] max-w-2xl text-white">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-tight" style={{ fontWeight: 900, fontSize: '1.5rem' }}>
            LOCATION CONSENT
          </DialogTitle>
          <DialogDescription className="text-white/60" style={{ fontSize: '0.875rem', fontWeight: 400 }}>
            {feature} requires location access. Choose your privacy level:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-6">
          {/* Privacy Notice */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#FF0080] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-white/80" style={{ fontWeight: 400 }}>
                <strong style={{ fontWeight: 700 }}>Your Privacy:</strong> We never sell location data. Approximate mode hides precise coordinates. You can change this anytime in Settings.
              </p>
            </div>
          </div>

          {/* Mode Selection */}
          <RadioGroup value={selectedMode} onValueChange={(val) => setSelectedMode(val as any)}>
            <div className="space-y-3">
              {modes.map((mode) => {
                const Icon = mode.icon;
                const isSelected = selectedMode === mode.value;

                return (
                  <label
                    key={mode.value}
                    htmlFor={`mode-${mode.value}`}
                    className={`
                      flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${isSelected
                        ? 'bg-white/10 border-[#FF0080]'
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                      }
                    `}
                  >
                    <RadioGroupItem
                      value={mode.value}
                      id={`mode-${mode.value}`}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-5 h-5 ${mode.color}`} />
                        <span className="uppercase tracking-tight" style={{ fontWeight: 800, fontSize: '1rem' }}>
                          {mode.label}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${isSelected ? 'bg-[#FF0080] text-white' : 'bg-white/10 text-white/60'}`}>
                          {mode.privacy}
                        </span>
                      </div>
                      <p className="text-sm text-white/70" style={{ fontWeight: 400 }}>
                        {mode.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </RadioGroup>

          {/* GDPR Notice */}
          <div className="p-3 bg-white/5 border border-white/10 rounded flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/50" style={{ fontWeight: 400 }}>
              By choosing Approximate or Precise, you consent to location tracking under GDPR Article 6(1)(a). 
              See our <a href="/legal/privacy" className="text-[#FF0080] hover:underline">Privacy Policy</a> for details.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#FF0080] hover:bg-[#FF0080]/80 text-white uppercase tracking-tight"
            style={{ fontWeight: 800 }}
          >
            {saving ? 'Saving...' : 'Save Preference'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
