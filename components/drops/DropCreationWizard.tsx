// HOTMESS LONDON - Drop Creation Wizard
// Multi-step flow for creating bot-powered product drops

import { useState } from 'react';
import { X, Upload, Calendar, MapPin, Music, Zap } from 'lucide-react';
import { HotmessButton } from '../hotmess/Button';
import { DropType, DropCreateInput } from '../../types/drops';
import { useDropActions } from '../../hooks/useDrops';

interface DropCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  authToken: string;
  onSuccess?: (dropId: string) => void;
}

export function DropCreationWizard({
  isOpen,
  onClose,
  authToken,
  onSuccess,
}: DropCreationWizardProps) {
  const [step, setStep] = useState(1);
  const [dropType, setDropType] = useState<DropType>('instant');
  const { createDrop, loading } = useDropActions();

  const [formData, setFormData] = useState<Partial<DropCreateInput>>({
    title: '',
    description: '',
    price: 0,
    quantity: 1,
    images: [],
    type: 'instant',
    category: '',
    tags: [],
    city: 'london',
    xp_reward: 0,
  });

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const drop = await createDrop(formData as DropCreateInput, authToken);
    if (drop) {
      onSuccess?.(drop.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-900 rounded-2xl border border-white/10">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-neutral-900 border-b border-white/10">
          <div>
            <h2 className="text-2xl text-white">Create a Drop</h2>
            <p className="text-sm text-white/60">
              Step {step} of 3 • {dropType === 'instant' && 'Instant Drop'}
              {dropType === 'timed' && 'Timed Drop'}
              {dropType === 'location' && 'Location Drop'}
              {dropType === 'dual' && 'Dual Drop'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Step 1: Drop Type */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-white">Choose Drop Type</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setDropType('instant');
                    setFormData({ ...formData, type: 'instant' });
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    dropType === 'instant'
                      ? 'border-hot bg-hot/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <Zap className="w-6 h-6 text-hot mb-2" />
                  <h4 className="text-white">Instant Drop</h4>
                  <p className="text-xs text-white/60">Live immediately</p>
                </button>

                <button
                  onClick={() => {
                    setDropType('timed');
                    setFormData({ ...formData, type: 'timed' });
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    dropType === 'timed'
                      ? 'border-hot bg-hot/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <Calendar className="w-6 h-6 text-blue-400 mb-2" />
                  <h4 className="text-white">Timed Drop</h4>
                  <p className="text-xs text-white/60">Schedule for later</p>
                </button>

                <button
                  onClick={() => {
                    setDropType('location');
                    setFormData({ ...formData, type: 'location' });
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    dropType === 'location'
                      ? 'border-hot bg-hot/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <MapPin className="w-6 h-6 text-green-400 mb-2" />
                  <h4 className="text-white">Location Drop</h4>
                  <p className="text-xs text-white/60">Scan to unlock</p>
                </button>

                <button
                  onClick={() => {
                    setDropType('dual');
                    setFormData({ ...formData, type: 'dual' });
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    dropType === 'dual'
                      ? 'border-hot bg-hot/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <Music className="w-6 h-6 text-purple-400 mb-2" />
                  <h4 className="text-white">Dual Drop</h4>
                  <p className="text-xs text-white/60">Music + Product</p>
                </button>
              </div>

              <HotmessButton fullWidth onClick={() => setStep(2)}>
                Continue
              </HotmessButton>
            </div>
          )}

          {/* Step 2: Product Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-white">Product Details</h3>

              <div>
                <label className="block text-sm text-white/80 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-800 border border-white/10 rounded-xl text-white placeholder:text-white/40"
                  placeholder="Limited edition tee"
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-neutral-800 border border-white/10 rounded-xl text-white placeholder:text-white/40"
                  placeholder="Hand-printed, 100% cotton..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/80 mb-2">Price (£)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-neutral-800 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/80 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-neutral-800 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-800 border border-white/10 rounded-xl text-white"
                >
                  <option value="">Select category</option>
                  <option value="clothing">Clothing</option>
                  <option value="accessories">Accessories</option>
                  <option value="art">Art</option>
                  <option value="digital">Digital</option>
                  <option value="tickets">Tickets</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex gap-3">
                <HotmessButton variant="outline" fullWidth onClick={() => setStep(1)}>
                  Back
                </HotmessButton>
                <HotmessButton fullWidth onClick={() => setStep(3)}>
                  Continue
                </HotmessButton>
              </div>
            </div>
          )}

          {/* Step 3: Settings */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-white">Drop Settings</h3>

              <div>
                <label className="block text-sm text-white/80 mb-2">City</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-800 border border-white/10 rounded-xl text-white"
                >
                  <option value="london">London</option>
                  <option value="berlin">Berlin</option>
                  <option value="paris">Paris</option>
                  <option value="amsterdam">Amsterdam</option>
                </select>
              </div>

              {dropType === 'timed' && (
                <div>
                  <label className="block text-sm text-white/80 mb-2">Schedule For</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduled_at || ''}
                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-800 border border-white/10 rounded-xl text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-white/80 mb-2">XP Reward (per purchase)</label>
                <input
                  type="number"
                  value={formData.xp_reward}
                  onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-neutral-800 border border-white/10 rounded-xl text-white"
                  placeholder={`Suggested: ${(formData.price || 0) * 2} XP`}
                />
              </div>

              <div className="p-4 bg-hot/10 border border-hot/30 rounded-xl">
                <h4 className="text-white mb-2">What happens next?</h4>
                <ul className="text-sm text-white/80 space-y-1">
                  <li>• Bot auto-generates QR code and beacon</li>
                  <li>• Posted to relevant city rooms</li>
                  <li>• You earn XP for each sale</li>
                  <li>• Analytics available in seller dashboard</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <HotmessButton variant="outline" fullWidth onClick={() => setStep(2)}>
                  Back
                </HotmessButton>
                <HotmessButton
                  fullWidth
                  onClick={handleSubmit}
                  disabled={loading || !formData.title || !formData.price || !formData.category}
                >
                  {loading ? 'Creating...' : 'Create Drop'}
                </HotmessButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
