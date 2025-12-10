/**
 * Test fixtures for RIGHT NOW module
 */
import { RightNowPost } from '../../lib/rightNowClient'

export const mockRightNowPost: RightNowPost = {
  id: 'test-post-id-1',
  user_id: 'test-user-id',
  mode: 'hookup',
  headline: 'Looking for fun tonight',
  body: 'In Soho, who wants to meet up?',
  city: 'London',
  country: 'UK',
  geo_bin: '51.5074_-0.1278_250m',
  lat: 51.5074,
  lng: -0.1278,
  membership_tier: 'free',
  xp_band: 'fresh',
  safety_flags: [],
  near_party: false,
  sponsored: false,
  created_at: new Date().toISOString(),
  expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  score: 50,
}

export const mockRightNowPosts: RightNowPost[] = [
  mockRightNowPost,
  {
    ...mockRightNowPost,
    id: 'test-post-id-2',
    mode: 'crowd',
    headline: 'Party at my place',
    body: 'BYOB, Vauxhall area',
    city: 'London',
    membership_tier: 'hnh',
    xp_band: 'sinner',
    near_party: true,
    score: 85,
  },
  {
    ...mockRightNowPost,
    id: 'test-post-id-3',
    mode: 'care',
    headline: 'Safe space available',
    body: 'If you need somewhere safe to go',
    city: 'Manchester',
    membership_tier: 'sponsor',
    xp_band: 'icon',
    safety_flags: ['verified_host'],
    score: 120,
  },
]

export const mockProfile = {
  id: 'test-user-id',
  username: 'testuser',
  display_name: 'Test User',
  gender: 'man',
  dob: '1995-01-01',
  home_city: 'London',
  country: 'UK',
  xp_band: 'fresh',
  membership_tier: 'free',
  shadow_banned: false,
}

export const mockCreatePostInput = {
  mode: 'hookup' as const,
  headline: 'Test post',
  text: 'Test body',
  lat: 51.5074,
  lng: -0.1278,
}
