-- Migration: Add duration column to lessons table
-- Date: 2026-05-19
-- Description: Adds duration (in minutes) to track total lesson duration

-- Add duration column (allows NULL for existing lessons)
ALTER TABLE lessons
ADD COLUMN duration INTEGER;

-- Optional: Update existing lessons with calculated duration
-- This query calculates duration from existing instructions
UPDATE lessons l
SET duration = (
  SELECT CEIL(SUM(i.min * 60 + i.sec) / 60.0)
  FROM instructions i
  WHERE i.lesson_id = l.lesson_id
)
WHERE duration IS NULL;

-- Optional: Set default to 0 for lessons with no instructions
UPDATE lessons
SET duration = 0
WHERE duration IS NULL;

-- Add comment to document the column
COMMENT ON COLUMN lessons.duration IS 'Total lesson duration in minutes, calculated from all instructions';
