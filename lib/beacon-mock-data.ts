/**
 * MOCK DATA GENERATORS FOR BEACON FLOWS
 * Temporary data for testing beacon type-specific modals
 */

export function getMockDataForBeaconType(beaconType: string, beaconName: string) {
  switch (beaconType) {
    case 'checkin':
      return {
        venueName: beaconName,
        venueAddress: '281 Kingsland Rd, London E2 8AS',
        xpEarned: 10,
        streak: 3,
        firstTime: false,
        totalCheckIns: 12,
        currentlyHere: 47,
      };

    case 'scan-to-buy':
      return {
        product: {
          id: 'prod-1',
          name: beaconName,
          price: 45.00,
          imageUrl: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800',
          category: 'RAW ESSENTIALS',
          inStock: true,
        },
        xpEarned: 20,
      };

    case 'reward':
      return {
        reward: {
          type: 'discount' as const,
          title: '25% Off Your Next Order',
          description: 'Valid for 7 days on all RAW Essentials',
          value: '25% OFF',
        },
        xpBonus: 50,
      };

    case 'music':
      return {
        track: {
          id: 'track-1',
          title: beaconName,
          artist: 'Paul King x Stuart Whoo',
          releaseDate: '2025-12-15',
          coverArt: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800',
          label: 'RAW CONVICT',
        },
        xpEarned: 25,
      };

    case 'event':
      return {
        event: {
          id: 'event-1',
          name: beaconName,
          venue: 'The Glory',
          address: '281 Kingsland Rd, London E2 8AS',
          date: '2025-12-31',
          time: '23:00',
          imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
          price: 15,
          capacity: 300,
          attending: 247,
          isGuestlist: true,
        },
        xpEarned: 20,
      };

    case 'quest':
      return {
        quest: {
          id: 'quest-1',
          title: beaconName,
          description: 'Complete your first night out',
          totalXP: 300,
          currentStep: 2,
          totalSteps: 5,
          steps: [
            {
              id: 'step-1',
              title: 'Create Your Profile',
              description: 'Set up your HOTMESS profile',
              xp: 50,
              completed: true,
              current: false,
            },
            {
              id: 'step-2',
              title: 'Check In at a Venue',
              description: 'Scan your first venue beacon',
              xp: 50,
              completed: true,
              current: false,
            },
            {
              id: 'step-3',
              title: 'Connect with Someone',
              description: 'Match or chat with another user',
              xp: 75,
              completed: false,
              current: true,
            },
            {
              id: 'step-4',
              title: 'RSVP to an Event',
              description: 'Join an upcoming event',
              xp: 75,
              completed: false,
              current: false,
            },
            {
              id: 'step-5',
              title: 'Share Your Experience',
              description: 'Post to the community',
              xp: 50,
              completed: false,
              current: false,
            },
          ],
          reward: {
            title: 'First Night Out Badge',
            description: 'Unlock exclusive badge and 2x XP for one week',
          },
        },
        stepXPEarned: 50,
      };

    case 'scan-to-join':
      return {
        room: {
          id: 'room-1',
          name: beaconName,
          description: 'Join the London community to connect with queer men, get event updates, and stay in the loop.',
          memberCount: 2847,
          telegramUrl: 'https://t.me/hotmess_london',
          category: 'Community',
          imageUrl: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800',
        },
        xpEarned: 20,
      };

    default:
      return null;
  }
}
