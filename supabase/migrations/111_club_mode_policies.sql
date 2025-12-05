-- ============================================================================
-- HOTMESS LONDON - CLUB MODE RLS POLICIES
-- Production-ready security policies for club management
-- ============================================================================

-- ============================================================================
-- HELPER FUNCTION: Check if user can manage a club
-- ============================================================================

CREATE OR REPLACE FUNCTION public.user_can_manage_club(club_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM clubs
    WHERE id = club_id
    AND (
      owner_id = auth.uid()
      OR auth.uid() = ANY(managers)
      OR auth.uid() = ANY(door_staff)
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.user_can_manage_club(uuid) TO authenticated;

COMMENT ON FUNCTION public.user_can_manage_club IS 'Returns true if current user is owner, manager, or door staff of the club';

-- ============================================================================
-- CLUB_EVENTS POLICIES
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Public read club events" ON club_events;
DROP POLICY IF EXISTS "Authenticated create events" ON club_events;
DROP POLICY IF EXISTS "Club owners update events" ON club_events;
DROP POLICY IF EXISTS "Club owners delete events" ON club_events;

-- Public read
CREATE POLICY "Public read club events"
ON club_events FOR SELECT
USING (true);

-- Authenticated users can insert events for clubs they manage
CREATE POLICY "Club managers can create events"
ON club_events FOR INSERT
TO authenticated
WITH CHECK (public.user_can_manage_club(club_id));

-- Club managers can update their club's events
CREATE POLICY "Club managers can update events"
ON club_events FOR UPDATE
TO authenticated
USING (public.user_can_manage_club(club_id))
WITH CHECK (public.user_can_manage_club(club_id));

-- Club managers can delete their club's events
CREATE POLICY "Club managers can delete events"
ON club_events FOR DELETE
TO authenticated
USING (public.user_can_manage_club(club_id));

-- ============================================================================
-- CLUB_TICKETS POLICIES
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Public read club tickets" ON club_tickets;
DROP POLICY IF EXISTS "Users read own tickets" ON club_tickets;
DROP POLICY IF EXISTS "Club staff read event tickets" ON club_tickets;
DROP POLICY IF EXISTS "Authenticated purchase tickets" ON club_tickets;
DROP POLICY IF EXISTS "Club staff update tickets" ON club_tickets;

-- Public read
CREATE POLICY "Public read club tickets"
ON club_tickets FOR SELECT
USING (true);

-- Insert: Club managers OR the buyer themselves
CREATE POLICY "Club managers or buyers can create tickets"
ON club_tickets FOR INSERT
TO authenticated
WITH CHECK (
  buyer_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM club_events ce
    WHERE ce.id = event_id
    AND public.user_can_manage_club(ce.club_id)
  )
);

-- Update: Only club managers (for check-in operations)
CREATE POLICY "Club managers can update tickets"
ON club_tickets FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM club_events ce
    WHERE ce.id = event_id
    AND public.user_can_manage_club(ce.club_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM club_events ce
    WHERE ce.id = event_id
    AND public.user_can_manage_club(ce.club_id)
  )
);

-- Delete: Only club managers
CREATE POLICY "Club managers can delete tickets"
ON club_tickets FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM club_events ce
    WHERE ce.id = event_id
    AND public.user_can_manage_club(ce.club_id)
  )
);

-- ============================================================================
-- CLUBS POLICIES (if not already set)
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Public read clubs" ON clubs;
DROP POLICY IF EXISTS "Authenticated create clubs" ON clubs;
DROP POLICY IF EXISTS "Club owners update clubs" ON clubs;

-- Public read
CREATE POLICY "Public read clubs"
ON clubs FOR SELECT
USING (true);

-- Authenticated users can create clubs (they become owner)
CREATE POLICY "Authenticated users can create clubs"
ON clubs FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

-- Club managers can update their clubs
CREATE POLICY "Club managers can update clubs"
ON clubs FOR UPDATE
TO authenticated
USING (public.user_can_manage_club(id))
WITH CHECK (public.user_can_manage_club(id));

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON POLICY "Public read club events" ON club_events IS 'Anyone can view events';
COMMENT ON POLICY "Club managers can create events" ON club_events IS 'Only club managers can create events for their venue';
COMMENT ON POLICY "Club managers can update events" ON club_events IS 'Only club managers can update their events';
COMMENT ON POLICY "Club managers can delete events" ON club_events IS 'Only club managers can delete their events';

COMMENT ON POLICY "Public read club tickets" ON club_tickets IS 'Anyone can view tickets (QR codes are unique)';
COMMENT ON POLICY "Club managers or buyers can create tickets" ON club_tickets IS 'Club managers can issue tickets, buyers can purchase';
COMMENT ON POLICY "Club managers can update tickets" ON club_tickets IS 'Only club managers can update tickets (for check-in)';
COMMENT ON POLICY "Club managers can delete tickets" ON club_tickets IS 'Only club managers can delete tickets';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Show all policies for club tables
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('clubs', 'club_events', 'club_tickets')
ORDER BY tablename, policyname;
