import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { getAISuggestions, createTask } from "@/lib/api";

export function QuickAddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const onSuggest = async () => {
    if (!title.trim()) {
      toast({ title: "Enter a title first" });
      return;
    }
    setLoading(true);
    try {
      const s = await getAISuggestions({ title, description });
      setDescription(s.enhanced_description || description);
      toast({
        title: "AI suggestions ready",
        description: `Priority ${s.priority_score}, due ${s.deadline || "soon"}`,
      });
    } catch (err) {
      toast({ title: "Error getting AI suggestions", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const s = await getAISuggestions({ title, description });

      const taskPayload = {
        title,
        description: s.enhanced_description || description || "",
        category: s.category ?? null,
        priority_score: s.priority_score ?? undefined,
        deadline: s.deadline ?? null,
        status: "pending" as const,
      };

      const createdTask = await createTask(taskPayload);
      console.log("Created task:", createdTask);

      setTitle("");
      setDescription("");
      toast({ title: "Task added", description: "Smart suggestions applied." });
    } catch (err) {
      toast({ title: "Error adding task", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="quick-add" className="space-y-3">
      <Input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <Button variant="soft" onClick={onSuggest} disabled={loading}>
          {loading ? "Thinking…" : "AI Suggest"}
        </Button>
        <Button variant="hero" onClick={onSubmit} disabled={loading}>
          Add Task
        </Button>
      </div>
    </div>
  );
}
