/*
  # Add daily challenge fields to quizzes

  1. Changes to `quizzes` table
    - `is_daily_challenge` (boolean, default: false) - marks quiz as daily challenge
    - `valid_until` (timestamp, nullable) - expiration date for daily quizzes

  2. Index
    - Add index on `is_daily_challenge` for optimized queries

  3. Purpose
    - Enable daily quiz challenges that are automatically generated
    - Daily quizzes expire after 24 hours
    - Daily quizzes are excluded from regular quiz listings
*/

ALTER TABLE public.quizzes
  ADD COLUMN IF NOT EXISTS is_daily_challenge boolean NOT NULL DEFAULT false;

ALTER TABLE public.quizzes
  ADD COLUMN IF NOT EXISTS valid_until timestamp with time zone;

CREATE INDEX IF NOT EXISTS quizzes_is_daily_challenge_idx
  ON public.quizzes(is_daily_challenge);

CREATE INDEX IF NOT EXISTS quizzes_valid_until_idx
  ON public.quizzes(valid_until)
  WHERE valid_until IS NOT NULL;
