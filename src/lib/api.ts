import { Task, Category, ContextEntry } from "@/types";

// Use environment variable or fallback
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  console.log(`API Request → ${options.method || "GET"} ${url}`, options.body ? JSON.parse(options.body as string) : "");

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`API Error: ${res.status} ${res.statusText}`, text);
      throw new Error(`API ${options.method || "GET"} ${path} ${res.status}: ${text}`);
    }

    const json = await res.json();
    console.log(`API Response ← ${options.method || "GET"} ${url}`, json);
    return json as T;
  } catch (err) {
    console.error("Network or parsing error:", err);
    throw err;
  }
}

// Fetch all tasks
export async function fetchTasks(): Promise<Task[]> {
  return request<Task[]>("/tasks/");
}

// Create a new task
export async function createTask(data: {
  title: string;
  description?: string;
  category?: string | null;
  priority_score?: number;
  deadline?: string | null;
  status?: Task["status"];
}): Promise<Task> {
  return request<Task>("/tasks/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Categories
export async function fetchCategories(): Promise<Category[]> {
  return request<Category[]>("/categories/");
}

// Context
export async function fetchContext(): Promise<ContextEntry[]> {
  return request<ContextEntry[]>("/context/");
}

export async function addContext(data: { content: string; source_type: ContextEntry["source_type"] }): Promise<ContextEntry> {
  return request<ContextEntry>("/context/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// AI suggestions
export async function getAISuggestions(taskData: { title: string; description?: string | null }): Promise<{
  priority_score: number;
  deadline: string;
  category?: string | null;
  enhanced_description?: string;
}> {
  return request("/ai/suggestions/", {
    method: "POST",
    body: JSON.stringify(taskData),
  });
}
