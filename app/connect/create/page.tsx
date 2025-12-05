/**
 * CREATE CONNECT INTENT
 * Create an anonymous intent at a nightlife venue
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Flame, MapPin, Tag, ArrowLeft, Loader2 } from 'lucide-react';
import { BrutalistCard } from '@/components/BrutalistCard';
import { BrutalistHeader } from '@/components/BrutalistHeader';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

const SUGGESTED_TAGS = [
  'dance', 'chat', 'drinks', 'techno', 'house', 'queer', 
  'kinky', 'chill', 'wild', 'newbie', 'local', 'visiting',
  'friends', 'flirt', 'explore', 'party'
];

export default function CreateIntentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [beacons, setBeacons] = useState<any[]>([]);
  const [loadingBeacons, setLoadingBeacons] = useState(true);
  
  const [selectedBeacon, setSelectedBeacon] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');

  useEffect(() => {
    loadNearbyBeacons();
  }, []);

  async function loadNearbyBeacons() {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/beacons/active`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load beacons');
      }

      const data = await response.json();
      
      // Filter for connect-enabled beacons
      const connectBeacons = (data.beacons || []).filter((b: any) => 
        b.type === 'connect' || b.features?.includes('connect')
      );
      
      setBeacons(connectBeacons);
      
    } catch (error) {
      console.error('Error loading beacons:', error);
      toast.error('Failed to load nearby venues');
    } finally {
      setLoadingBeacons(false);
    }
  }

  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else if (selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      toast.error('Maximum 3 tags allowed');
    }
  }

  function addCustomTag() {
    const tag = customTag.trim().toLowerCase();
    
    if (!tag) return;
    
    if (tag.length > 20) {
      toast.error('Tag too long (max 20 characters)');
      return;
    }
    
    if (selectedTags.length >= 3) {
      toast.error('Maximum 3 tags allowed');
      return;
    }
    
    if (selectedTags.includes(tag)) {
      toast.error('Tag already added');
      return;
    }
    
    setSelectedTags([...selectedTags, tag]);
    setCustomTag('');
  }

  async function createIntent() {
    if (!selectedBeacon) {
      toast.error('Please select a venue');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error('Please log in');
        router.push('/login?redirect=/connect/create');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/connect/intents/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            beaconId: selectedBeacon,
            tags: selectedTags
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create intent');
      }

      toast.success('Intent created! 🔥');
      router.push('/connect');

    } catch (error: any) {
      console.error('Create intent error:', error);
      toast.error(error.message || 'Failed to create intent');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <BrutalistHeader
        icon={Flame}
        label="CONNECT"
        title="CREATE INTENT"
        subtitle="Let others know you're open to connect"
      />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Back button */}
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="border-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Select venue */}
        <BrutalistCard variant="section">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <h2 className="font-bold text-lg">SELECT VENUE</h2>
            </div>

            {loadingBeacons ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : beacons.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <p className="text-white/70">No Connect-enabled venues nearby</p>
                <p className="text-sm text-white/50">
                  Venues must have Connect feature enabled. Check back when you're at a club or event.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {beacons.map((beacon) => (
                  <button
                    key={beacon.id}
                    onClick={() => setSelectedBeacon(beacon.id)}
                    className={`w-full p-4 text-left border-2 transition-colors ${
                      selectedBeacon === beacon.id
                        ? 'bg-white/10 border-white'
                        : 'bg-white/5 border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <p className="font-bold">{beacon.name || beacon.venue}</p>
                      <p className="text-sm text-white/70">
                        {beacon.venue && beacon.city ? `${beacon.venue} • ${beacon.city}` : beacon.city}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </BrutalistCard>

        {/* Select tags */}
        <BrutalistCard variant="section">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              <h2 className="font-bold text-lg">ADD TAGS (OPTIONAL)</h2>
            </div>

            <p className="text-sm text-white/70">
              Add up to 3 tags to describe your vibe or what you're looking for.
              Tags are anonymous until mutual opt-in.
            </p>

            {/* Selected tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-white cursor-pointer hover:bg-white/10"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}

            {/* Suggested tags */}
            <div className="space-y-2">
              <p className="text-xs text-white/50 uppercase tracking-wide">Suggested</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={`cursor-pointer transition-colors ${
                      selectedTags.includes(tag)
                        ? 'border-white bg-white/10'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Custom tag input */}
            <div className="space-y-2">
              <p className="text-xs text-white/50 uppercase tracking-wide">Custom</p>
              <div className="flex gap-2">
                <Input
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
                  placeholder="Your own tag..."
                  maxLength={20}
                  disabled={selectedTags.length >= 3}
                  className="bg-black border-white/20"
                />
                <Button
                  onClick={addCustomTag}
                  disabled={!customTag || selectedTags.length >= 3}
                  variant="outline"
                  className="border-white/20"
                >
                  Add
                </Button>
              </div>
            </div>

            <p className="text-xs text-white/50">
              {selectedTags.length}/3 tags selected
            </p>
          </div>
        </BrutalistCard>

        {/* Privacy notice */}
        <div className="p-4 bg-white/5 border-2 border-white/10 text-sm space-y-2">
          <p className="font-bold">🔒 PRIVACY</p>
          <p className="text-white/70">
            Your intent is <strong>completely anonymous</strong> until someone opts-in and you opt-in to them back.
            Only then are identities revealed. Intents expire after 3 hours or when you leave the venue.
          </p>
        </div>

        {/* Create button */}
        <Button
          onClick={createIntent}
          disabled={!selectedBeacon || loading}
          className="w-full h-14 bg-red-500 hover:bg-red-600 text-white font-bold text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              CREATING...
            </>
          ) : (
            <>
              <Flame className="w-5 h-5 mr-2" />
              CREATE INTENT
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
