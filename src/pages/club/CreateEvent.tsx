/**
 * HOTMESS LONDON — CREATE EVENT (CLUB MODE)
 * 
 * Multi-step form for clubs to create ticketed events.
 * Automatically generates beacons and integrates with Club Mode.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  DollarSign,
  Users,
  Image as ImageIcon,
  CheckCircle2,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { PageHeader } from '../../components/layouts/PageHeader';
import { HMButton } from '../../components/library/HMButton';
import { Card } from '../../components/design-system/Card';
import { HMInput } from '../../components/library/HMInput';
import { createEvent, ClubEvent } from '../../lib/clubMode/clubModeService';
import { RouteId } from '../../lib/routes';
import { toast } from 'sonner';

interface Props {
  clubId: string;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

type Step = 'details' | 'datetime' | 'tickets' | 'review';

export default function CreateEvent({ clubId, onNavigate }: Props) {
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [creating, setCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    cover_image: '',
    lineup: [] as string[],
    start_time: '',
    end_time: '',
    doors_open: '',
    capacity: 0,
    capacity_ga: 0,
    capacity_vip: 0,
    price_ga: 0, // in pence
    price_vip: 0, // in pence
    age_restriction: 18,
    gender_policy: 'men_only' as 'men_only' | 'all_genders' | 'women_only'
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Auto-generate slug from name
    if (field === 'name' && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleCreate = async () => {
    setCreating(true);

    try {
      const result = await createEvent({
        club_id: clubId,
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        cover_image: formData.cover_image || undefined,
        lineup: formData.lineup.length > 0 ? formData.lineup : undefined,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: formData.end_time ? new Date(formData.end_time).toISOString() : undefined,
        doors_open: formData.doors_open ? new Date(formData.doors_open).toISOString() : undefined,
        capacity: formData.capacity || undefined,
        capacity_ga: formData.capacity_ga || undefined,
        capacity_vip: formData.capacity_vip || undefined,
        price_ga: formData.price_ga,
        price_vip: formData.price_vip,
        age_restriction: formData.age_restriction,
        gender_policy: formData.gender_policy
      });

      if (result.ok) {
        toast.success('Event created successfully!');
        toast.success(`Generated ${result.beacons.length} beacons`);
        
        // Navigate to event detail
        onNavigate('clubEventDetail', { eventId: result.event.id });
      } else {
        toast.error(result.error);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to create event');
    } finally {
      setCreating(false);
    }
  };

  const canProgress = () => {
    switch (currentStep) {
      case 'details':
        return formData.name && formData.slug;
      case 'datetime':
        return formData.start_time;
      case 'tickets':
        return formData.capacity_ga > 0 || formData.capacity_vip > 0;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const steps: Step[] = ['details', 'datetime', 'tickets', 'review'];
  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <div className="min-h-screen bg-black">
      <PageHeader
        title="Create Event"
        subtitle="Set up ticketing and generate beacons"
        onBack={() => onNavigate('clubDashboard', { clubId })}
      />

      <div className="max-w-3xl mx-auto p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, idx) => (
              <div
                key={step}
                className={`flex items-center ${idx < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  idx <= currentStepIndex
                    ? 'bg-[#FF0080] text-white'
                    : 'bg-white/10 text-white/40'
                }`}>
                  {idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    idx < currentStepIndex ? 'bg-[#FF0080]' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            <span className={currentStep === 'details' ? 'text-white font-bold' : 'text-white/60'}>
              Details
            </span>
            <span className={currentStep === 'datetime' ? 'text-white font-bold' : 'text-white/60'}>
              Date & Time
            </span>
            <span className={currentStep === 'tickets' ? 'text-white font-bold' : 'text-white/60'}>
              Tickets
            </span>
            <span className={currentStep === 'review' ? 'text-white font-bold' : 'text-white/60'}>
              Review
            </span>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DetailsStep formData={formData} updateField={updateField} />
            </motion.div>
          )}

          {currentStep === 'datetime' && (
            <motion.div
              key="datetime"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DateTimeStep formData={formData} updateField={updateField} />
            </motion.div>
          )}

          {currentStep === 'tickets' && (
            <motion.div
              key="tickets"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <TicketsStep formData={formData} updateField={updateField} />
            </motion.div>
          )}

          {currentStep === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ReviewStep formData={formData} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <HMButton
            variant="secondary"
            onClick={() => {
              const prevIndex = currentStepIndex - 1;
              if (prevIndex >= 0) {
                setCurrentStep(steps[prevIndex]);
              } else {
                onNavigate('clubDashboard', { clubId });
              }
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </HMButton>

          {currentStep !== 'review' ? (
            <HMButton
              onClick={() => {
                const nextIndex = currentStepIndex + 1;
                if (nextIndex < steps.length) {
                  setCurrentStep(steps[nextIndex]);
                }
              }}
              disabled={!canProgress()}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </HMButton>
          ) : (
            <HMButton
              onClick={handleCreate}
              disabled={creating || !canProgress()}
            >
              {creating ? 'Creating...' : 'Create Event'}
              <CheckCircle2 className="w-4 h-4" />
            </HMButton>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STEP 1: DETAILS
// ============================================================================

function DetailsStep({ formData, updateField }: any) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase mb-2">
          Event Details
        </h2>
        <p className="text-white/60">
          Basic information about your event
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-white font-bold mb-2">
            Event Name *
          </label>
          <HMInput
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="e.g. Saturday Night Fever"
          />
        </div>

        <div>
          <label className="block text-white font-bold mb-2">
            Slug *
          </label>
          <HMInput
            value={formData.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            placeholder="saturday-night-fever"
          />
          <p className="text-white/40 text-sm mt-1">
            Used in URL: hotmess.london/events/{formData.slug || 'your-slug'}
          </p>
        </div>

        <div>
          <label className="block text-white font-bold mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Tell guests about your event..."
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder:text-white/40 focus:border-[#FF0080] focus:outline-none min-h-[120px]"
          />
        </div>

        <div>
          <label className="block text-white font-bold mb-2">
            Cover Image URL
          </label>
          <HMInput
            value={formData.cover_image}
            onChange={(e) => updateField('cover_image', e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-bold mb-2">
              Age Restriction
            </label>
            <HMInput
              type="number"
              value={formData.age_restriction}
              onChange={(e) => updateField('age_restriction', parseInt(e.target.value))}
              min="18"
              max="21"
            />
          </div>

          <div>
            <label className="block text-white font-bold mb-2">
              Gender Policy
            </label>
            <select
              value={formData.gender_policy}
              onChange={(e) => updateField('gender_policy', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:border-[#FF0080] focus:outline-none"
            >
              <option value="men_only">Men Only (18+)</option>
              <option value="all_genders">All Genders</option>
              <option value="women_only">Women Only</option>
            </select>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// STEP 2: DATE & TIME
// ============================================================================

function DateTimeStep({ formData, updateField }: any) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase mb-2">
          Date & Time
        </h2>
        <p className="text-white/60">
          When does your event happen?
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-white font-bold mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Start Date & Time *
          </label>
          <input
            type="datetime-local"
            value={formData.start_time}
            onChange={(e) => updateField('start_time', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:border-[#FF0080] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-white font-bold mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            Doors Open
          </label>
          <input
            type="datetime-local"
            value={formData.doors_open}
            onChange={(e) => updateField('doors_open', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:border-[#FF0080] focus:outline-none"
          />
          <p className="text-white/40 text-sm mt-1">
            When guests can start checking in
          </p>
        </div>

        <div>
          <label className="block text-white font-bold mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            End Date & Time
          </label>
          <input
            type="datetime-local"
            value={formData.end_time}
            onChange={(e) => updateField('end_time', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:border-[#FF0080] focus:outline-none"
          />
          <p className="text-white/40 text-sm mt-1">
            Optional. Defaults to 8 hours after start.
          </p>
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// STEP 3: TICKETS
// ============================================================================

function TicketsStep({ formData, updateField }: any) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase mb-2">
          Ticketing
        </h2>
        <p className="text-white/60">
          Set capacity and pricing for each tier
        </p>
      </div>

      <div className="space-y-6">
        {/* General Admission */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-4">
          <h3 className="text-white font-bold">General Admission (GA)</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-sm mb-2">
                Capacity
              </label>
              <HMInput
                type="number"
                value={formData.capacity_ga}
                onChange={(e) => updateField('capacity_ga', parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-2">
                Price (£)
              </label>
              <HMInput
                type="number"
                value={formData.price_ga / 100}
                onChange={(e) => updateField('price_ga', parseFloat(e.target.value) * 100 || 0)}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              <p className="text-white/40 text-xs mt-1">
                £{(formData.price_ga / 100).toFixed(2)} per ticket
              </p>
            </div>
          </div>
        </div>

        {/* VIP */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-4">
          <h3 className="text-white font-bold">VIP</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-sm mb-2">
                Capacity
              </label>
              <HMInput
                type="number"
                value={formData.capacity_vip}
                onChange={(e) => updateField('capacity_vip', parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-2">
                Price (£)
              </label>
              <HMInput
                type="number"
                value={formData.price_vip / 100}
                onChange={(e) => updateField('price_vip', parseFloat(e.target.value) * 100 || 0)}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              <p className="text-white/40 text-xs mt-1">
                £{(formData.price_vip / 100).toFixed(2)} per ticket
              </p>
            </div>
          </div>
        </div>

        {/* Total Capacity */}
        <div className="bg-[#FF0080]/10 border border-[#FF0080]/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-white font-bold">Total Capacity</span>
            <span className="text-[#FF0080] text-2xl font-black">
              {(formData.capacity_ga || 0) + (formData.capacity_vip || 0)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// STEP 4: REVIEW
// ============================================================================

function ReviewStep({ formData }: any) {
  const totalCapacity = (formData.capacity_ga || 0) + (formData.capacity_vip || 0);
  const potentialRevenue = 
    (formData.capacity_ga * formData.price_ga) + 
    (formData.capacity_vip * formData.price_vip);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-black text-white uppercase mb-4">
          Review & Create
        </h2>

        <div className="space-y-6">
          {/* Event Details */}
          <div>
            <h3 className="text-white font-bold mb-3">Event Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Name</span>
                <span className="text-white font-bold">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Slug</span>
                <span className="text-white">{formData.slug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Age Restriction</span>
                <span className="text-white">{formData.age_restriction}+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Policy</span>
                <span className="text-white">{formData.gender_policy.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Timing */}
          <div>
            <h3 className="text-white font-bold mb-3">Timing</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Start</span>
                <span className="text-white">
                  {new Date(formData.start_time).toLocaleString()}
                </span>
              </div>
              {formData.doors_open && (
                <div className="flex justify-between">
                  <span className="text-white/60">Doors Open</span>
                  <span className="text-white">
                    {new Date(formData.doors_open).toLocaleString()}
                  </span>
                </div>
              )}
              {formData.end_time && (
                <div className="flex justify-between">
                  <span className="text-white/60">End</span>
                  <span className="text-white">
                    {new Date(formData.end_time).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tickets */}
          <div>
            <h3 className="text-white font-bold mb-3">Tickets</h3>
            <div className="space-y-3">
              {formData.capacity_ga > 0 && (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white">General Admission</p>
                    <p className="text-white/60 text-sm">
                      {formData.capacity_ga} tickets
                    </p>
                  </div>
                  <p className="text-[#FF0080] font-bold">
                    £{(formData.price_ga / 100).toFixed(2)}
                  </p>
                </div>
              )}

              {formData.capacity_vip > 0 && (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white">VIP</p>
                    <p className="text-white/60 text-sm">
                      {formData.capacity_vip} tickets
                    </p>
                  </div>
                  <p className="text-[#FF0080] font-bold">
                    £{(formData.price_vip / 100).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <Users className="w-6 h-6 text-[#FF0080] mx-auto mb-2" />
            <p className="text-2xl font-black text-white">
              {totalCapacity}
            </p>
            <p className="text-white/60 text-sm">Total Capacity</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <DollarSign className="w-6 h-6 text-[#FF0080] mx-auto mb-2" />
            <p className="text-2xl font-black text-white">
              £{(potentialRevenue / 100).toLocaleString()}
            </p>
            <p className="text-white/60 text-sm">Max Revenue</p>
          </div>
        </Card>
      </div>

      {/* Auto-generation notice */}
      <Card className="p-4 bg-[#FF0080]/10 border-[#FF0080]/30">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#FF0080] flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-white font-bold mb-1">
              Beacons will be auto-generated
            </p>
            <p className="text-white/80">
              We'll create 2 beacons: one for browsing/purchasing, and one for door check-in.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
