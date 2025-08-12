export type Status = "pending" | "in-progress" | "completed";

export interface Task {
  id: string | number;
  title: string;
  description?: string;
  category?: string;
  priority_score: number;
  deadline?: string; // ISO string
  status: Status;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string | number;
  name: string;
  usage_frequency: number;
}

export type SourceType = "whatsapp" | "email" | "notes";

export interface ContextEntry {
  id: string | number;
  content: string;
  source_type: SourceType;
  processed_insights?: Record<string, any>;
  created_at: string;
}
