-- MessMarket Storage Setup
-- Creates bucket for marketplace product images

-- Create bucket for MessMarket images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'messmarket-images', 
  'messmarket-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own images
CREATE POLICY IF NOT EXISTS "Users can upload their own images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'messmarket-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own images
CREATE POLICY IF NOT EXISTS "Users can update their own images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'messmarket-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own images
CREATE POLICY IF NOT EXISTS "Users can delete their own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'messmarket-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public to read all images (bucket is public)
CREATE POLICY IF NOT EXISTS "Public can view all images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'messmarket-images');
