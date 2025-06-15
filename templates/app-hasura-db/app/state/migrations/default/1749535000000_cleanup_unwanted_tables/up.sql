-- Drop foreign key constraints first
ALTER TABLE IF EXISTS public.checkpoints DROP CONSTRAINT IF EXISTS fk_checkpoints_root;

-- Drop tables in correct order (dependent tables first)
DROP TABLE IF EXISTS public.checkpoints;
DROP TABLE IF EXISTS public.root;
DROP TABLE IF EXISTS public.subjects;

-- Note: We keep templates table as it will be recreated in the next migration 