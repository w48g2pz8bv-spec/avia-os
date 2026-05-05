import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type-safe table interfaces
export interface DBActivityLog {
  id: string;
  text: string;
  type: 'builder' | 'agent' | 'automation' | 'sync' | 'system';
  time: string;
  created_at?: string;
}

export interface DBKnowledgeEntry {
  id: string;
  content: string;
  sector: string;
  tags: string[];
  created_at?: string;
}

export interface DBDeploymentItem {
  id: string;
  asset_name: string;
  status: 'queued' | 'deployed';
  created_at?: string;
}
