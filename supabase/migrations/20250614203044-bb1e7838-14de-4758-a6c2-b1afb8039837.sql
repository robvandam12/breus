
-- Add columns for real-time validation to the immersion table
ALTER TABLE public.inmersion ADD COLUMN current_depth NUMERIC;
ALTER TABLE public.inmersion ADD COLUMN planned_bottom_time INTEGER;
