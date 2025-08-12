import { ContextEntry, Task } from "@/types";
import { addDays } from "date-fns";

const KEYWORDS: Record<string, string[]> = {
  urgent: ["urgent", "asap", "immediately", "now", "priority"],
  soon: ["soon", "this week", "quick", "short"],
  complex: ["spec", "proposal", "architecture", "report", "analysis", "debug"],
  email: ["email", "inbox", "reply", "follow up"],
  meeting: ["meeting", "standup", "sync", "review", "retro"],
};

function scoreFromText(text: string): number {
  const lower = text.toLowerCase();
  let score = 0;
  if (KEYWORDS.urgent.some(k => lower.includes(k))) score += 50;
  if (KEYWORDS.soon.some(k => lower.includes(k))) score += 20;
  if (KEYWORDS.complex.some(k => lower.includes(k))) score += 10;
  score += Math.min(10, (text.match(/!/g) || []).length * 2);
  return score;
}

function deriveCategory(text: string): string | undefined {
  const lower = text.toLowerCase();
  if (KEYWORDS.email.some(k => lower.includes(k))) return "Communication";
  if (KEYWORDS.meeting.some(k => lower.includes(k))) return "Meetings";
  if (KEYWORDS.complex.some(k => lower.includes(k))) return "Deep Work";
  return undefined;
}

export function analyzeContext(entries: ContextEntry[]) {
  const corpus = entries.map(e => e.content).join("\n").toLowerCase();
  const keywords = Object.values(KEYWORDS).flat().filter(k => corpus.includes(k));
  const unique = Array.from(new Set(keywords)).slice(0, 12);
  const urgency = KEYWORDS.urgent.some(k => corpus.includes(k)) ? "high" : (KEYWORDS.soon.some(k => corpus.includes(k)) ? "medium" : "low");
  return { keywords: unique, urgency };
}

export function suggestForTask(
  task: Pick<Task, "title" | "description">,
  existing: Task[] = [],
  context: ContextEntry[] = []
) {
  const base = scoreFromText(task.title + " " + (task.description || ""));
  const contextInfo = analyzeContext(context);
  const workload = existing.filter(t => t.status !== "completed").length;
  const workloadPenalty = Math.min(20, Math.max(0, workload - 5) * 2);

  const priority_score = Math.max(0, Math.min(100, base + (contextInfo.urgency === 'high' ? 20 : contextInfo.urgency === 'medium' ? 10 : 0) - workloadPenalty));

  const isComplex = KEYWORDS.complex.some(k => (task.title + " " + (task.description || "")).toLowerCase().includes(k));
  const days = priority_score > 70 ? 1 : priority_score > 50 ? 3 : isComplex ? 7 : 5;
  const deadline = addDays(new Date(), days).toISOString();

  const category = deriveCategory(task.title + " " + (task.description || "")) || (contextInfo.keywords.includes("meeting") ? "Meetings" : undefined);

  const enhanced_description = `${task.description || ""}`.trim() + (contextInfo.keywords.length
    ? `\n\nContext hints: ${contextInfo.keywords.slice(0,5).join(", ")}`
    : "");

  return { priority_score, deadline, category, enhanced_description };
}
