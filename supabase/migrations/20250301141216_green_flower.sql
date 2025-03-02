/*
  # Add user roles and teams

  1. Updates
    - Add `role` and `phone_number` to `user_profiles` table
    - Add `supervisor_id` to `user_profiles` table for worker-supervisor relationship
  
  2. New Tables
    - `teams` - For organizing workers under supervisors
    - `team_members` - Junction table for team membership
  
  3. Security
    - Enable RLS on new tables
    - Add policies for supervisors to manage their teams
*/

-- Update user_profiles table
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS phone_number text UNIQUE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'worker';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS supervisor_id uuid REFERENCES user_profiles(id);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supervisor_id uuid REFERENCES user_profiles(id) NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) NOT NULL,
  user_id uuid REFERENCES user_profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for teams
CREATE POLICY "Supervisors can create their own teams"
  ON teams
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = supervisor_id);

CREATE POLICY "Supervisors can view their own teams"
  ON teams
  FOR SELECT
  TO authenticated
  USING (auth.uid() = supervisor_id);

CREATE POLICY "Supervisors can update their own teams"
  ON teams
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = supervisor_id);

-- Create policies for team_members
CREATE POLICY "Supervisors can manage team members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = team_members.team_id
      AND teams.supervisor_id = auth.uid()
    )
  );

CREATE POLICY "Workers can view their own team memberships"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());