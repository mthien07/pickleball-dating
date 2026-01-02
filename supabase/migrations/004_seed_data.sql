-- PickleBall Dating App - Seed Data
-- Migration: 004_seed_data.sql
-- Created: 2026-01-02
-- Description: Insert sample data for development

-- =====================================================
-- 1. INSERT SAMPLE COURTS
-- =====================================================

INSERT INTO courts (
  name, address, location, images, description, amenities,
  price_per_hour, price_min, price_max, court_type, operating_hours,
  rating, review_count, is_partner, is_active
) VALUES
(
  'Premium Pickleball Center',
  '123 Nguyen Hue St, District 1, Ho Chi Minh City',
  ST_SetSRID(ST_Point(106.7011, 10.7763), 4326)::geography,
  ARRAY[
    'https://images.unsplash.com/photo-1606045345900-4379d95b5d9b?w=800',
    'https://images.unsplash.com/photo-1587280506354-e3e0db1c1b21?w=800'
  ],
  'Modern indoor facility with 6 professional courts, air conditioning, and premium equipment.',
  ARRAY['Parking', 'Locker', 'Canteen', 'Equipment Rental', 'Showers', 'Wi-Fi', 'Air Conditioning'],
  200000,
  150000,
  300000,
  'indoor',
  '{
    "monday": {"open": "06:00", "close": "22:00"},
    "tuesday": {"open": "06:00", "close": "22:00"},
    "wednesday": {"open": "06:00", "close": "22:00"},
    "thursday": {"open": "06:00", "close": "22:00"},
    "friday": {"open": "06:00", "close": "23:00"},
    "saturday": {"open": "06:00", "close": "23:00"},
    "sunday": {"open": "07:00", "close": "22:00"}
  }'::jsonb,
  4.8,
  156,
  TRUE,
  TRUE
),
(
  'District 2 Sports Complex',
  '456 Thao Dien St, District 2, Ho Chi Minh City',
  ST_SetSRID(ST_Point(106.7411, 10.8013), 4326)::geography,
  ARRAY[
    'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800'
  ],
  'Outdoor courts with beautiful garden views. Great for casual play.',
  ARRAY['Parking', 'Equipment Rental', 'Canteen', 'Wi-Fi'],
  120000,
  100000,
  150000,
  'outdoor',
  '{
    "monday": {"open": "06:00", "close": "21:00"},
    "tuesday": {"open": "06:00", "close": "21:00"},
    "wednesday": {"open": "06:00", "close": "21:00"},
    "thursday": {"open": "06:00", "close": "21:00"},
    "friday": {"open": "06:00", "close": "21:00"},
    "saturday": {"open": "06:00", "close": "22:00"},
    "sunday": {"open": "06:00", "close": "22:00"}
  }'::jsonb,
  4.5,
  89,
  TRUE,
  TRUE
),
(
  'Binh Thanh Pickleball Club',
  '789 Xo Viet Nghe Tinh St, Binh Thanh, Ho Chi Minh City',
  ST_SetSRID(ST_Point(106.7104, 10.8079), 4326)::geography,
  ARRAY[
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800'
  ],
  'Community-focused club with friendly atmosphere. Perfect for beginners.',
  ARRAY['Parking', 'Locker', 'Equipment Rental', 'Showers'],
  100000,
  80000,
  120000,
  'indoor',
  '{
    "monday": {"open": "07:00", "close": "21:00"},
    "tuesday": {"open": "07:00", "close": "21:00"},
    "wednesday": {"open": "07:00", "close": "21:00"},
    "thursday": {"open": "07:00", "close": "21:00"},
    "friday": {"open": "07:00", "close": "22:00"},
    "saturday": {"open": "08:00", "close": "22:00"},
    "sunday": {"open": "08:00", "close": "21:00"}
  }'::jsonb,
  4.3,
  67,
  FALSE,
  TRUE
),
(
  'Tan Binh Arena',
  '321 Cong Hoa St, Tan Binh, Ho Chi Minh City',
  ST_SetSRID(ST_Point(106.6421, 10.8014), 4326)::geography,
  ARRAY[
    'https://images.unsplash.com/photo-1606045345900-4379d95b5d9b?w=800'
  ],
  'Large facility with 8 courts. Hosts regular tournaments.',
  ARRAY['Parking', 'Locker', 'Canteen', 'Equipment Rental', 'Showers', 'Pro Shop'],
  180000,
  150000,
  250000,
  'indoor',
  '{
    "monday": {"open": "06:00", "close": "22:00"},
    "tuesday": {"open": "06:00", "close": "22:00"},
    "wednesday": {"open": "06:00", "close": "22:00"},
    "thursday": {"open": "06:00", "close": "22:00"},
    "friday": {"open": "06:00", "close": "23:00"},
    "saturday": {"open": "06:00", "close": "23:00"},
    "sunday": {"open": "07:00", "close": "22:00"}
  }'::jsonb,
  4.7,
  203,
  TRUE,
  TRUE
);

-- =====================================================
-- 2. INSERT SAMPLE COACHES
-- =====================================================

INSERT INTO coaches (
  display_name, avatar_url, bio, experience_years, certifications,
  skill_level, hourly_rate, rating, review_count,
  location, address, phone, email, gallery_urls, is_active
) VALUES
(
  'Coach Alex Tran',
  'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400',
  'Professional pickleball coach with 10+ years of experience. Former national team player. Specializing in advanced techniques and competitive play.',
  10,
  ARRAY['IPTPA Certified', 'PPR Certified Pro', 'National Team Coach'],
  'pro',
  500000,
  4.9,
  34,
  ST_SetSRID(ST_Point(106.7011, 10.7763), 4326)::geography,
  'District 1, Ho Chi Minh City',
  '+84 901 234 567',
  'alex.tran@email.com',
  ARRAY[
    'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800',
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800'
  ],
  TRUE
),
(
  'Coach Sarah Nguyen',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
  'Friendly and patient coach perfect for beginners. Focus on fundamentals and building confidence.',
  5,
  ARRAY['IPTPA Level 2', 'Beginner Specialist'],
  'advanced',
  350000,
  4.7,
  28,
  ST_SetSRID(ST_Point(106.7411, 10.8013), 4326)::geography,
  'District 2, Ho Chi Minh City',
  '+84 902 345 678',
  'sarah.nguyen@email.com',
  ARRAY[
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800'
  ],
  TRUE
),
(
  'Coach David Le',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400',
  'Tournament player and strategic coach. Expert in doubles strategy and match tactics.',
  8,
  ARRAY['USAPA Certified', 'Tournament Director'],
  'pro',
  450000,
  4.8,
  41,
  ST_SetSRID(ST_Point(106.7104, 10.8079), 4326)::geography,
  'Binh Thanh, Ho Chi Minh City',
  '+84 903 456 789',
  'david.le@email.com',
  ARRAY[
    'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800',
    'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800'
  ],
  TRUE
);

-- =====================================================
-- 3. HELPFUL QUERIES FOR VERIFICATION
-- =====================================================

-- Count tables
-- SELECT COUNT(*) as court_count FROM courts WHERE is_active = TRUE;
-- SELECT COUNT(*) as coach_count FROM coaches WHERE is_active = TRUE;

-- View sample data
-- SELECT id, name, court_type, price_per_hour, rating, is_partner FROM courts;
-- SELECT id, display_name, skill_level, hourly_rate, rating FROM coaches;

-- =====================================================
-- END OF MIGRATION 004
-- =====================================================
