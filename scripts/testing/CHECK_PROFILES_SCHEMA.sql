-- ========================================
-- CHECK PROFILES TABLE SCHEMA
-- Run this to see what columns exist
-- ========================================

SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
ORDER BY ordinal_position;
