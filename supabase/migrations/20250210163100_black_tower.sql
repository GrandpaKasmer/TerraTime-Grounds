/*
  # Create tasks and user_profiles tables

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `preferred_language` (text)
      - `created_at` (timestamp)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `task_type` (text)
      - `start_time` (timestamp)
      - `end_time` (timestamp)
      - `duration` (interval)
      - `location_lat` (double precision)
      - `location_lng` (double precision)
      - `voice_notes` (text)
      - `photo_url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to:
      - Read their own profile
      - Create and read their own tasks
*/

-- Create user_profiles table
CREATE TABLE user_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users,
    full_name text,
    preferred_language text DEFAULT 'en',
    created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES user_profiles NOT NULL,
    task_type text NOT NULL,
    start_time timestamptz NOT NULL,
    end_time timestamptz,
    duration interval,
    location_lat double precision,
    location_lng double precision,
    voice_notes text,
    photo_url text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
    ON user_profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON user_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Create policies for tasks
CREATE POLICY "Users can create own tasks"
    ON tasks
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own tasks"
    ON tasks
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);