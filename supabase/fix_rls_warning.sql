-- Fix RLS warning for PostGIS system table
-- Optional - chỉ để clear warning trong dashboard

-- Enable RLS on spatial_ref_sys (PostGIS system table)
ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;

-- Allow public read access (cần thiết cho PostGIS)
CREATE POLICY "Allow public read access to spatial_ref_sys"
ON public.spatial_ref_sys
FOR SELECT
TO public
USING (true);
