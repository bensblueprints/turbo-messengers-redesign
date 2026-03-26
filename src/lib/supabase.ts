import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'client' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  company_name?: string;
  phone?: string;
  role: UserRole;
  created_at: string;
}

export interface Job {
  id: string;
  client_id: string;
  job_type: 'process_service' | 'court_filing' | 'small_claims' | 'document_retrieval';
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  defendant_name?: string;
  defendant_address?: string;
  court_name?: string;
  case_number?: string;
  notes?: string;
  rush_service: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  assigned_to?: string;
  proof_of_service_url?: string;
}

export interface Document {
  id: string;
  job_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  uploaded_by: string;
  created_at: string;
}
