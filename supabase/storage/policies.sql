-- PickleBall Dating App - Storage Policies
-- File: supabase/storage/policies.sql
-- Created: 2026-01-02
-- Description: RLS policies for storage buckets

-- =====================================================
-- 1. PROFILE-PHOTOS BUCKET POLICIES
-- =====================================================

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload own avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own photos
CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own photos
CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Public can view all profile photos (bucket is public)
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- =====================================================
-- 2. COURT-IMAGES BUCKET POLICIES
-- =====================================================

-- Only admins can upload court images (via service_role key)
-- No INSERT/UPDATE/DELETE policies = only service_role can modify

-- Public can view all court images (bucket is public)
CREATE POLICY "Court images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'court-images');

-- =====================================================
-- 3. MESSAGE-IMAGES BUCKET POLICIES
-- =====================================================

-- Users can upload message images to conversations they're part of
CREATE POLICY "Users can upload message images to their conversations"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'message-images'
  -- Folder structure: message-images/{conversation_id}/{filename}
  AND (storage.foldername(name))[1] IN (
    SELECT c.id::text FROM conversations c
    JOIN matches m ON c.match_id = m.id
    WHERE m.user_id_1 = auth.uid() OR m.user_id_2 = auth.uid()
  )
);

-- Users can view message images from their conversations
CREATE POLICY "Users can view message images from their conversations"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'message-images'
  AND (storage.foldername(name))[1] IN (
    SELECT c.id::text FROM conversations c
    JOIN matches m ON c.match_id = m.id
    WHERE m.user_id_1 = auth.uid() OR m.user_id_2 = auth.uid()
  )
);

-- Users can delete their own message images
CREATE POLICY "Users can delete own message images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'message-images'
  AND (storage.foldername(name))[1] IN (
    SELECT c.id::text FROM conversations c
    JOIN matches m ON c.match_id = m.id
    WHERE m.user_id_1 = auth.uid() OR m.user_id_2 = auth.uid()
  )
);

-- =====================================================
-- 4. REVIEW-IMAGES BUCKET POLICIES
-- =====================================================

-- Authenticated users can upload review images
CREATE POLICY "Authenticated users can upload review images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'review-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own review images
CREATE POLICY "Users can update own review images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'review-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own review images
CREATE POLICY "Users can delete own review images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'review-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Public can view all review images (bucket is public)
CREATE POLICY "Review images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'review-images');

-- =====================================================
-- 5. VERIFY POLICIES
-- =====================================================

-- Query to view all storage policies
-- SELECT
--   schemaname,
--   tablename,
--   policyname,
--   permissive,
--   roles,
--   cmd,
--   qual
-- FROM pg_policies
-- WHERE tablename = 'objects'
-- ORDER BY policyname;
