// HOTMESS LONDON - RadioKing API Integration
// Live radio streaming, schedule, and show management
//
// NOTE: This module works in two modes:
// 1. LIVE MODE (with API token): Full RadioKing integration with real-time data
// 2. FALLBACK MODE (without token): Mock data for development/demo
//
// To enable full RadioKing features:
// - Set RADIOKING_TOKEN in /lib/env.ts (get from RadioKing dashboard)
// - Live stats, now playing, and schedule will update automatically
//
// Stream URL works without token: https://listen.radioking.com/radio/736103/stream/802454

import { RADIOKING_TOKEN, RADIOKING_RADIO_ID } from './env';

const RADIOKING_API_URL = 'https://api.radioking.io/api';

export interface RadioShow {
  id: number;
  name: string;
  description: string;
  image: string | null;
  day: string; // 'monday', 'tuesday', etc.
  startTime: string; // 'HH:MM'
  endTime: string; // 'HH:MM'
  isLive: boolean;
  presenter?: {
    name: string;
    bio?: string;
    image?: string;
  };
}

export interface RadioTrack {
  id: number;
  title: string;
  artist: string;
  album?: string;
  albumArt?: string;
  startedAt: string; // ISO timestamp
  duration?: number; // seconds
}

export interface RadioStats {
  listeners: number;
  peakListeners: number;
  isLive: boolean;
  currentShow?: RadioShow;
}

export interface RadioSchedule {
  shows: RadioShow[];
  timezone: string;
}

/**
 * Fetch current playing track (Now Playing)
 */
export async function getNowPlaying(): Promise<RadioTrack | null> {
  // Return mock data if API credentials aren't configured
  if (!RADIOKING_TOKEN || !RADIOKING_RADIO_ID) {
    return {
      id: 1,
      title: 'HOTMESS Radio Live',
      artist: 'Various Artists',
      album: 'Live Stream',
      albumArt: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400',
      startedAt: new Date().toISOString(),
      duration: 0,
    };
  }

  try {
    const response = await fetch(
      `${RADIOKING_API_URL}/radios/${RADIOKING_RADIO_ID}/track/current`,
      {
        headers: {
          'Authorization': `Bearer ${RADIOKING_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`RadioKing API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      id: data.id,
      title: data.title,
      artist: data.artist,
      album: data.album,
      albumArt: data.cover_url,
      startedAt: data.started_at,
      duration: data.duration,
    };
  } catch (error) {
    console.error('Error fetching now playing:', error);
    return null;
  }
}

/**
 * Fetch radio statistics (listener count, etc.)
 */
export async function getRadioStats(): Promise<RadioStats | null> {
  // Return mock data if API credentials aren't configured
  if (!RADIOKING_TOKEN || !RADIOKING_RADIO_ID) {
    return {
      listeners: Math.floor(Math.random() * 50) + 10, // Random 10-60 listeners
      peakListeners: 150,
      isLive: true,
    };
  }

  try {
    const response = await fetch(
      `${RADIOKING_API_URL}/radios/${RADIOKING_RADIO_ID}/stats`,
      {
        headers: {
          'Authorization': `Bearer ${RADIOKING_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`RadioKing API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      listeners: data.listeners || 0,
      peakListeners: data.peak_listeners || 0,
      isLive: data.is_live || false,
    };
  } catch (error) {
    console.error('Error fetching radio stats:', error);
    return null;
  }
}

/**
 * Fetch weekly schedule
 */
export async function getSchedule(): Promise<RadioSchedule | null> {
  // Return mock data if API credentials aren't configured
  if (!RADIOKING_TOKEN || !RADIOKING_RADIO_ID) {
    return {
      shows: [
        {
          id: 1,
          name: 'Wake the Mess',
          description: 'Morning growl. Coffee, sweat, sin remnants from the night before.',
          image: null,
          day: 'monday',
          startTime: '06:00',
          endTime: '09:00',
          isLive: false,
          presenter: {
            name: 'DJ Dominik',
            bio: '15 years deep in underground club culture.',
            image: undefined,
          },
        },
        {
          id: 2,
          name: 'Nightbody Mixes',
          description: 'Sweaty silhouettes in sound form.',
          image: null,
          day: 'monday',
          startTime: '22:00',
          endTime: '02:00',
          isLive: true,
        },
      ],
      timezone: 'Europe/London',
    };
  }

  try {
    const response = await fetch(
      `${RADIOKING_API_URL}/radios/${RADIOKING_RADIO_ID}/planning`,
      {
        headers: {
          'Authorization': `Bearer ${RADIOKING_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`RadioKing API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    const shows: RadioShow[] = data.shows?.map((show: any) => ({
      id: show.id,
      name: show.name,
      description: show.description || '',
      image: show.image_url,
      day: show.day,
      startTime: show.start_time,
      endTime: show.end_time,
      isLive: false,
      presenter: show.presenter ? {
        name: show.presenter.name,
        bio: show.presenter.bio,
        image: show.presenter.image_url,
      } : undefined,
    })) || [];

    return {
      shows,
      timezone: data.timezone || 'Europe/London',
    };
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return null;
  }
}

/**
 * Get stream URL for player
 */
export function getStreamUrl(): string {
  // HOTMESS LONDON Radio stream
  return 'https://listen.radioking.com/radio/736103/stream/802454';
}

/**
 * Get current show based on day/time
 */
export async function getCurrentShow(): Promise<RadioShow | null> {
  try {
    const schedule = await getSchedule();
    if (!schedule) {
      // Fallback: return a default show
      return {
        id: 1,
        name: 'Nightbody Mixes',
        description: 'Sweaty silhouettes in sound form.',
        image: null,
        day: 'daily',
        startTime: '22:00',
        endTime: '02:00',
        isLive: true,
      };
    }

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.toTimeString().substring(0, 5); // 'HH:MM'

    const currentShow = schedule.shows.find(show => {
      if (show.day !== currentDay) return false;
      return currentTime >= show.startTime && currentTime < show.endTime;
    });

    if (currentShow) {
      return { ...currentShow, isLive: true };
    }

    return null;
  } catch (error) {
    console.error('Error getting current show:', error);
    return null;
  }
}

/**
 * Get recent tracks (history)
 */
export async function getRecentTracks(limit = 10): Promise<RadioTrack[]> {
  // Return mock data if API credentials aren't configured
  if (!RADIOKING_TOKEN || !RADIOKING_RADIO_ID) {
    return [];
  }

  try {
    const response = await fetch(
      `${RADIOKING_API_URL}/radios/${RADIOKING_RADIO_ID}/tracks/history?limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${RADIOKING_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`RadioKing API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.tracks?.map((track: any) => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album,
      albumArt: track.cover_url,
      startedAt: track.started_at,
      duration: track.duration,
    })) || [];
  } catch (error) {
    console.error('Error fetching recent tracks:', error);
    return [];
  }
}

/**
 * Client-side hook for real-time updates (polling)
 */
export function useRadioLive(intervalMs = 30000) {
  // This would be used in a React component
  // Returns { nowPlaying, stats, currentShow }
  // Updates every 30 seconds
  return {
    getNowPlaying,
    getRadioStats,
    getCurrentShow,
  };
}
