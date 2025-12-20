/**
 * HOTMESS LONDON — FROSTED AUDIO SYSTEM USAGE EXAMPLES
 * 
 * Real-world examples of how to use the Frosted Audio Card System
 * across different parts of the platform.
 */

import { FrostedAudioCard } from './FrostedAudioCard';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useState } from 'react';

// ============================================================================
// EXAMPLE 1: RADIO PAGE (Live Streaming)
// ============================================================================

export function RadioPageExample() {
  const player = useAudioPlayer();
  const [showFullPlayer, setShowFullPlayer] = useState(false);

  const liveRadioTrack = {
    id: 'radio-live-1',
    title: 'HOTMESS RADIO — Saturday Night Heat',
    artist: 'DJ Shadow',
    coverArt: 'https://example.com/radio-cover.jpg',
    audioUrl: 'https://radioking.com/stream/hotmess',
    source: 'radio' as const,
    isLive: true,
    transcript: 'Live transcript appears here as DJ speaks...',
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <h1 className="text-4xl font-black text-white mb-8">RADIO</h1>

      {/* Live Radio Card */}
      <FrostedAudioCard
        variant="live"
        track={liveRadioTrack}
        isPlaying={player.isPlaying}
        listenerCount={1247}
        djName="DJ Shadow"
        djImage="https://example.com/dj-shadow.jpg"
        sponsorLabel="Powered by SUPERHUNG"
        onPlay={() => player.play(liveRadioTrack)}
        onPause={player.pause}
      />

      {/* Mini Frost Bar (Global Player) */}
      {player.currentTrack && (
        <FrostedAudioCard
          variant="mini"
          track={player.currentTrack}
          isPlaying={player.isPlaying}
          onPlay={player.play}
          onPause={player.pause}
          onExpand={() => setShowFullPlayer(true)}
        />
      )}

      {/* Full Player Modal */}
      {showFullPlayer && (
        <FrostedAudioCard
          variant="full"
          track={player.currentTrack!}
          isPlaying={player.isPlaying}
          currentTime={player.currentTime}
          volume={player.volume}
          muted={player.muted}
          djName="DJ Shadow"
          djImage="https://example.com/dj-shadow.jpg"
          onPlay={player.play}
          onPause={player.pause}
          onSeek={player.seek}
          onVolumeChange={player.setVolume}
          onToggleMute={player.toggleMute}
          onCollapse={() => setShowFullPlayer(false)}
          onShare={() => console.log('Share radio')}
        />
      )}
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: RECORDS PAGE (Track Preview)
// ============================================================================

export function RecordsPageExample() {
  const player = useAudioPlayer();
  const [showTranscript, setShowTranscript] = useState(false);

  const recordsTrack = {
    id: 'rcr-001',
    title: 'HOTMESS',
    artist: 'Paul King x Stuart Whoo',
    album: 'RAW CONVICT RECORDS Vol. 1',
    coverArt: 'https://example.com/hotmess-cover.jpg',
    audioUrl: 'https://example.com/hotmess-preview.mp3',
    source: 'records' as const,
    duration: 243, // 4:03
    waveformData: Array.from({ length: 100 }, () => Math.random()),
    transcript: 'Lyrics: In the night, we come alive...',
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <h1 className="text-4xl font-black text-white mb-8">RECORDS</h1>

      {/* Track Card */}
      <FrostedAudioCard
        variant="inline"
        track={recordsTrack}
        isPlaying={player.isPlaying && player.currentTrack?.id === recordsTrack.id}
        currentTime={player.currentTime}
        showTranscript={showTranscript}
        onPlay={() => player.play(recordsTrack)}
        onPause={player.pause}
        onToggleTranscript={() => setShowTranscript(!showTranscript)}
      />

      {/* Transcript Panel */}
      {showTranscript && (
        <div className="mt-4">
          <FrostedAudioCard
            variant="transcript"
            track={recordsTrack}
            isPlaying={player.isPlaying}
            currentTime={player.currentTime}
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: BEACON WITH AUDIO INSTRUCTION
// ============================================================================

export function BeaconAudioExample() {
  const player = useAudioPlayer();

  const beaconTrack = {
    id: 'beacon-audio-1',
    title: 'Entry Instructions',
    coverArt: 'https://example.com/beacon-cover.jpg',
    audioUrl: 'https://example.com/beacon-instruction.mp3',
    source: 'beacon' as const,
    duration: 8, // 8 seconds
  };

  return (
    <div className="min-h-screen bg-black p-6 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <h2 className="text-2xl font-black text-white text-center">
          LISTEN FOR ENTRY
        </h2>

        <FrostedAudioCard
          variant="inline"
          track={beaconTrack}
          isPlaying={player.isPlaying}
          currentTime={player.currentTime}
          onPlay={() => player.play(beaconTrack)}
          onPause={player.pause}
        />

        <p className="text-white/60 text-center text-sm">
          +10 XP awarded after listening
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: CARE AFTERCARE AUDIO
// ============================================================================

export function CareAudioExample() {
  const player = useAudioPlayer();

  const careTrack = {
    id: 'care-aftercare-1',
    title: 'Grounding Exercise',
    coverArt: 'https://example.com/care-cover.jpg',
    audioUrl: 'https://example.com/grounding.mp3',
    source: 'care' as const,
    duration: 180, // 3 minutes
    transcript: 'Find a comfortable position. Take a deep breath...',
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <h1 className="text-4xl font-black text-white mb-8">AFTERCARE</h1>

      <div className="max-w-2xl mx-auto space-y-6">
        <p className="text-white/80 leading-relaxed">
          Take a moment to ground yourself after your experience.
          This guided exercise will help you reconnect.
        </p>

        <FrostedAudioCard
          variant="inline"
          track={careTrack}
          isPlaying={player.isPlaying}
          currentTime={player.currentTime}
          showTranscript={true}
          onPlay={() => player.play(careTrack)}
          onPause={player.pause}
        />

        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-500 text-sm">
            This is not medical advice. If you're in crisis, contact emergency services.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: COMMUNITY VOICE POST
// ============================================================================

export function CommunityVoiceExample() {
  const player = useAudioPlayer();

  const voicePost = {
    id: 'voice-post-1',
    title: 'Voice Reply from @user123',
    coverArt: 'https://example.com/user-avatar.jpg',
    audioUrl: 'https://example.com/voice-reply.mp3',
    source: 'community' as const,
    duration: 45,
    transcript: 'Hey everyone, just wanted to share my thoughts on...',
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <img 
              src="https://example.com/user-avatar.jpg" 
              className="w-10 h-10 rounded-full"
              alt="User"
            />
            <div>
              <p className="text-white font-bold">@user123</p>
              <p className="text-white/60 text-sm">2 hours ago</p>
            </div>
          </div>

          <FrostedAudioCard
            variant="inline"
            track={voicePost}
            isPlaying={player.isPlaying && player.currentTrack?.id === voicePost.id}
            currentTime={player.currentTime}
            onPlay={() => player.play(voicePost)}
            onPause={player.pause}
            onToggleTranscript={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: SHOP PRODUCT PROMO AUDIO
// ============================================================================

export function ShopAudioExample() {
  const player = useAudioPlayer();

  const productPromo = {
    id: 'shop-promo-1',
    title: 'Hear the Fabric',
    coverArt: 'https://example.com/product.jpg',
    audioUrl: 'https://example.com/product-audio.mp3',
    source: 'shop' as const,
    duration: 15,
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-white mb-8">PRODUCT</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square bg-white/5 rounded-2xl" />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white mb-2">
                SUPERHUNG Premium Harness
              </h2>
              <p className="text-white/60">
                £149.99
              </p>
            </div>

            {/* Audio Description */}
            <div>
              <p className="text-white/80 mb-3">
                Listen to the designer describe the craftsmanship:
              </p>

              <FrostedAudioCard
                variant="inline"
                track={productPromo}
                isPlaying={player.isPlaying && player.currentTrack?.id === productPromo.id}
                currentTime={player.currentTime}
                onPlay={() => player.play(productPromo)}
                onPause={player.pause}
              />
            </div>

            <button className="w-full h-14 bg-[#FF003D] text-white font-bold rounded-xl hover:bg-[#CC0031] transition-colors">
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: PODCAST EPISODE
// ============================================================================

export function PodcastExample() {
  const player = useAudioPlayer();
  const [showFullPlayer, setShowFullPlayer] = useState(false);

  const podcastEpisode = {
    id: 'podcast-ep-1',
    title: 'Conversations with Stewart Who?',
    artist: 'Episode 12: The Future of Gay Nightlife',
    coverArt: 'https://example.com/podcast-cover.jpg',
    audioUrl: 'https://example.com/podcast-ep12.mp3',
    source: 'podcast' as const,
    duration: 3600, // 1 hour
    transcript: 'Full episode transcript available...',
    waveformData: Array.from({ length: 100 }, () => Math.random()),
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <h1 className="text-4xl font-black text-white mb-8">PODCASTS</h1>

      <div className="max-w-3xl mx-auto space-y-6">
        <FrostedAudioCard
          variant="inline"
          track={podcastEpisode}
          isPlaying={player.isPlaying}
          currentTime={player.currentTime}
          onPlay={() => player.play(podcastEpisode)}
          onPause={player.pause}
          onToggleTranscript={() => {}}
        />

        <div className="flex gap-3">
          <button 
            onClick={() => setShowFullPlayer(true)}
            className="px-6 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            Full Player
          </button>
          <button className="px-6 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors">
            Download
          </button>
          <button className="px-6 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors">
            Share
          </button>
        </div>
      </div>

      {showFullPlayer && (
        <FrostedAudioCard
          variant="full"
          track={podcastEpisode}
          isPlaying={player.isPlaying}
          currentTime={player.currentTime}
          volume={player.volume}
          muted={player.muted}
          showTranscript={false}
          onPlay={player.play}
          onPause={player.pause}
          onSeek={player.seek}
          onVolumeChange={player.setVolume}
          onToggleMute={player.toggleMute}
          onCollapse={() => setShowFullPlayer(false)}
          onShare={() => console.log('Share podcast')}
          onSave={() => console.log('Save podcast')}
          onToggleTranscript={() => {}}
        />
      )}
    </div>
  );
}
