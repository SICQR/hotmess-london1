// HOTMESS LONDON - SoundCloud API Integration
// Fetch tracks, playlists, and embed players for HOTMESS Records

import { SOUNDCLOUD_CLIENT_ID } from './env';

const SOUNDCLOUD_API_URL = 'https://api.soundcloud.com';

// Type declarations for SoundCloud Widget API
interface SoundCloudWidgetAPI {
  play(): void;
  pause(): void;
  toggle(): void;
  seekTo(milliseconds: number): void;
  setVolume(volume: number): void;
  next(): void;
  prev(): void;
  skip(soundIndex: number): void;
}

interface SoundCloudWindow extends Window {
  SC?: {
    Widget: (iframeElement: HTMLIFrameElement) => SoundCloudWidgetAPI;
  };
}

export interface SoundCloudTrack {
  id: number;
  title: string;
  description: string;
  duration: number; // milliseconds
  genre: string;
  artwork_url: string | null;
  permalink_url: string;
  stream_url: string;
  waveform_url: string;
  playback_count: number;
  likes_count: number;
  download_count: number;
  user: {
    id: number;
    username: string;
    avatar_url: string;
    permalink_url: string;
  };
  created_at: string;
  tags: string;
}

export interface SoundCloudPlaylist {
  id: number;
  title: string;
  description: string;
  duration: number; // milliseconds
  artwork_url: string | null;
  permalink_url: string;
  tracks: SoundCloudTrack[];
  track_count: number;
  likes_count: number;
  user: {
    id: number;
    username: string;
    avatar_url: string;
  };
  created_at: string;
}

/**
 * Resolve SoundCloud URL to track/playlist data
 */
export async function resolveSoundCloudUrl(url: string): Promise<SoundCloudTrack | SoundCloudPlaylist | null> {
  try {
    const response = await fetch(
      `${SOUNDCLOUD_API_URL}/resolve?url=${encodeURIComponent(url)}&client_id=${SOUNDCLOUD_CLIENT_ID}`
    );

    if (!response.ok) {
      throw new Error(`SoundCloud API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error resolving SoundCloud URL:', error);
    return null;
  }
}

/**
 * Get track by ID
 */
export async function getTrack(trackId: number): Promise<SoundCloudTrack | null> {
  try {
    const response = await fetch(
      `${SOUNDCLOUD_API_URL}/tracks/${trackId}?client_id=${SOUNDCLOUD_CLIENT_ID}`
    );

    if (!response.ok) {
      throw new Error(`SoundCloud API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching SoundCloud track:', error);
    return null;
  }
}

/**
 * Get playlist by ID
 */
export async function getPlaylist(playlistId: number): Promise<SoundCloudPlaylist | null> {
  try {
    const response = await fetch(
      `${SOUNDCLOUD_API_URL}/playlists/${playlistId}?client_id=${SOUNDCLOUD_CLIENT_ID}`
    );

    if (!response.ok) {
      throw new Error(`SoundCloud API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching SoundCloud playlist:', error);
    return null;
  }
}

/**
 * Get user's tracks (for HOTMESS Records account)
 */
export async function getUserTracks(userId: number, limit = 50): Promise<SoundCloudTrack[]> {
  try {
    const response = await fetch(
      `${SOUNDCLOUD_API_URL}/users/${userId}/tracks?limit=${limit}&client_id=${SOUNDCLOUD_CLIENT_ID}`
    );

    if (!response.ok) {
      throw new Error(`SoundCloud API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user tracks:', error);
    return [];
  }
}

/**
 * Get user's playlists (for HOTMESS Records account)
 */
export async function getUserPlaylists(userId: number, limit = 20): Promise<SoundCloudPlaylist[]> {
  try {
    const response = await fetch(
      `${SOUNDCLOUD_API_URL}/users/${userId}/playlists?limit=${limit}&client_id=${SOUNDCLOUD_CLIENT_ID}`
    );

    if (!response.ok) {
      throw new Error(`SoundCloud API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    return [];
  }
}

/**
 * Generate SoundCloud embed HTML
 */
export function getSoundCloudEmbedHtml(url: string, options?: {
  autoPlay?: boolean;
  hideRelated?: boolean;
  showComments?: boolean;
  showUser?: boolean;
  showReposts?: boolean;
  visual?: boolean;
  color?: string;
}): string {
  const params = new URLSearchParams({
    url: url,
    auto_play: options?.autoPlay ? 'true' : 'false',
    hide_related: options?.hideRelated ? 'true' : 'false',
    show_comments: options?.showComments ? 'true' : 'false',
    show_user: options?.showUser ? 'true' : 'false',
    show_reposts: options?.showReposts ? 'false' : 'true',
    visual: options?.visual ? 'true' : 'false',
    color: options?.color || 'ff0000', // HOTMESS red
  });

  return `https://w.soundcloud.com/player/?${params.toString()}`;
}

/**
 * Generate SoundCloud widget iframe
 */
export function getSoundCloudWidgetUrl(url: string, options?: {
  autoPlay?: boolean;
  hideRelated?: boolean;
  showComments?: boolean;
  showUser?: boolean;
  showReposts?: boolean;
  visual?: boolean;
  color?: string;
}): string {
  return getSoundCloudEmbedHtml(url, options);
}

/**
 * Transform SoundCloud track to HOTMESS Records release format
 */
export function transformToRelease(track: SoundCloudTrack, releaseData?: {
  slug?: string;
  priceGBP?: number;
  downloadUrl?: string;
}) {
  return {
    id: track.id.toString(),
    slug: releaseData?.slug || track.permalink_url.split('/').pop() || '',
    title: track.title,
    artist: track.user.username,
    description: track.description,
    artwork: track.artwork_url || track.user.avatar_url,
    soundCloudUrl: track.permalink_url,
    soundCloudWidgetUrl: getSoundCloudWidgetUrl(track.permalink_url, {
      hideRelated: true,
      showComments: false,
      showUser: true,
      color: 'ff0000',
    }),
    duration: Math.floor(track.duration / 1000), // convert to seconds
    genre: track.genre,
    tags: track.tags ? track.tags.split(' ').map(t => t.replace(/"/g, '')) : [],
    plays: track.playback_count,
    likes: track.likes_count,
    downloads: track.download_count,
    releaseDate: track.created_at,
    priceGBP: releaseData?.priceGBP || 3.99,
    downloadUrl: releaseData?.downloadUrl,
  };
}

/**
 * Transform SoundCloud playlist to HOTMESS Records album format
 */
export function transformToAlbum(playlist: SoundCloudPlaylist, albumData?: {
  slug?: string;
  priceGBP?: number;
}) {
  return {
    id: playlist.id.toString(),
    slug: albumData?.slug || playlist.permalink_url.split('/').pop() || '',
    title: playlist.title,
    artist: playlist.user.username,
    description: playlist.description,
    artwork: playlist.artwork_url || playlist.user.avatar_url,
    soundCloudUrl: playlist.permalink_url,
    soundCloudWidgetUrl: getSoundCloudWidgetUrl(playlist.permalink_url, {
      hideRelated: true,
      showComments: false,
      visual: true,
      color: 'ff0000',
    }),
    trackCount: playlist.track_count,
    duration: Math.floor(playlist.duration / 1000), // convert to seconds
    tracks: playlist.tracks.map(track => transformToRelease(track)),
    likes: playlist.likes_count,
    releaseDate: playlist.created_at,
    priceGBP: albumData?.priceGBP || 9.99,
  };
}

/**
 * Search SoundCloud tracks
 */
export async function searchTracks(query: string, limit = 20): Promise<SoundCloudTrack[]> {
  try {
    const response = await fetch(
      `${SOUNDCLOUD_API_URL}/tracks?q=${encodeURIComponent(query)}&limit=${limit}&client_id=${SOUNDCLOUD_CLIENT_ID}`
    );

    if (!response.ok) {
      throw new Error(`SoundCloud API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching SoundCloud tracks:', error);
    return [];
  }
}

/**
 * Get track stream URL (requires authentication for private tracks)
 */
export function getStreamUrl(track: SoundCloudTrack): string {
  return `${track.stream_url}?client_id=${SOUNDCLOUD_CLIENT_ID}`;
}

/**
 * Client-side SoundCloud Widget API wrapper
 * Use this in React components to control embedded players
 */
export class SoundCloudWidget {
  private widget: SoundCloudWidgetAPI | null;
  private iframe: HTMLIFrameElement;

  constructor(iframeElement: HTMLIFrameElement) {
    this.iframe = iframeElement;
    this.widget = null;
    
    const win = (typeof window !== 'undefined' ? window : undefined) as SoundCloudWindow | undefined;
    if (win?.SC) {
      this.widget = win.SC.Widget(iframeElement);
    }
  }

  play() {
    this.widget?.play();
  }

  pause() {
    this.widget?.pause();
  }

  toggle() {
    this.widget?.toggle();
  }

  seekTo(milliseconds: number) {
    this.widget?.seekTo(milliseconds);
  }

  setVolume(volume: number) {
    // volume: 0-100
    this.widget?.setVolume(volume);
  }

  getCurrentSound(callback: (sound: SoundCloudTrack) => void) {
    this.widget?.getCurrentSound(callback);
  }

  bind(event: string, listener: (...args: any[]) => void) {
    // Events: 'ready', 'play', 'pause', 'finish', 'seek', 'playProgress', 'loadProgress'
    this.widget?.bind(event, listener);
  }

  unbind(event: string) {
    this.widget?.unbind(event);
  }
}

/**
 * Load SoundCloud Widget API script
 * Call this in _app.tsx or before using SoundCloudWidget
 */
export function loadSoundCloudWidgetAPI(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined'));
      return;
    }

    const win = window as SoundCloudWindow;
    if (win.SC) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load SoundCloud Widget API'));
    document.body.appendChild(script);
  });
}
