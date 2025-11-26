/*
  # Add daily quiz completion tracking

  1. New Tables
    - `daily_quiz_completions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `quiz_id` (uuid)
      - `completed_at` (date)
      - `created_at` (timestamp)

  2. Purpose
    - Track which user completed a quiz on a specific date
    - Used to determine if user has completed their daily quiz for streak
    - Prevents counting the same quiz multiple times in one day

  3. Security
    - Enable RLS on `daily_quiz_completions` table
    - Add policy for authenticated users to view/insert their own completions
*/

CREATE TABLE IF NOT EXISTS public.daily_quiz_completions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  quiz_id uuid NOT NULL,
  completed_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone DEFAULT now(),

  CONSTRAINT daily_quiz_completions_pkey PRIMARY KEY (id),
  CONSTRAINT daily_quiz_completions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT daily_quiz_completions_unique_daily UNIQUE (user_id, completed_at)
);

CREATE INDEX IF NOT EXISTS daily_quiz_completions_user_id_idx ON public.daily_quiz_completions(user_id);
CREATE INDEX IF NOT EXISTS daily_quiz_completions_completed_at_idx ON public.daily_quiz_completions(completed_at);

ALTER TABLE public.daily_quiz_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own daily quiz completions"
  ON public.daily_quiz_completions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily quiz completions"
  ON public.daily_quiz_completions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
