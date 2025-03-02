import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yxqkjyweogfkbeqrzsyk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cWtqeXdlb2dma2JlcXJ6c3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MzU5MjksImV4cCI6MjA1NjQxMTkyOX0.W7ActdPtA6b3bY8GH_oE6cVig8wbS5Ly2-IzI9l7VzQ';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface UserProfile {
    id: string;
    full_name: string | null;
    phone_number: string | null;
    preferred_language: string;
    role: string;
    supervisor_id: string | null;
    created_at: string;
}

export interface Task {
    id: string;
    user_id: string;
    task_type: string;
    start_time: string;
    end_time: string | null;
    duration: number | null;
    location_lat: number | null;
    location_lng: number | null;
    voice_notes: string | null;
    photo_url: string | null;
    created_at: string;
}

export interface Team {
    id: string;
    supervisor_id: string;
    name: string;
    created_at: string;
}

export interface TeamMember {
    id: string;
    team_id: string;
    user_id: string;
    created_at: string;
}