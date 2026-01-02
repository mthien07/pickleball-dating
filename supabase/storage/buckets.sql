-- PickleBall Dating App - Storage Buckets
-- File: supabase/storage/buckets.sql
-- Created: 2026-01-02
-- Description: Create storage buckets for app assets

-- =====================================================
-- 1. CREATE STORAGE BUCKETS
-- =====================================================

-- Bucket 1: Profile Photos (Public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  TRUE,  -- Public read
  5242880,  -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket 2: Court Images (Public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'court-images',
  'court-images',
  TRUE,  -- Public read
  10485760,  -- 10 MB
  ARRAY['image/jpeg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket 3: Message Images (Private with RLS)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'message-images',
  'message-images',
  FALSE,  -- Private, RLS-protected
  10485760,  -- 10 MB
  ARRAY['image/jpeg', 'image/png', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket 4: Review Images (Public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-images',
  'review-images',
  TRUE,  -- Public read
  5242880,  -- 5 MB
  ARRAY['image/jpeg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. VERIFY BUCKETS
-- =====================================================

-- Query to verify buckets were created
-- SELECT id, name, public, file_size_limit, allowed_mime_types
-- FROM storage.buckets
-- WHERE id IN ('profile-photos', 'court-images', 'message-images', 'review-images');
