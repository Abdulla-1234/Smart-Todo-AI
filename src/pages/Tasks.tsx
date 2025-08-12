import AppLayout from "@/components/layout/AppLayout";
import { SEO } from "@/components/seo/SEO";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Task } from "@/types";
import { QuickAddTask } from "@/components/tasks/QuickAddTask";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { useQuery } from "@tanstack/react-query";
import { fetchTasks, fetchCategories } from "@/lib/api";

export default function TasksPage() {
  const { data: tasks = [] } = useQuery({ queryKey: ["tasks"], queryFn: fetchTasks });
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

  const [filters, setFilters] = useLocalStorage("task-filters", {
    category: undefined as string | undefined,
    status: undefined as Task["status"] | undefined,
    minPriority: 0,
  });

  const filtered = tasks.filter(
    (t) =>
      (filters.category ? t.category === filters.category : true) &&
      (filters.status ? t.status === filters.status : true) &&
      t.priority_score >= (filters.minPriority ?? 0)
  );

  return (
    <AppLayout>
      <SEO
        title="Smart Todo AI – Tasks"
        description="View, filter and add tasks with AI suggestions for priority and deadlines."
        path="/tasks"
      />

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {filtered.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
          {filtered.length === 0 && (
            <div className="text-muted-foreground">No tasks yet. Try adding one!</div>
          )}
        </div>
        <aside className="space-y-6">
          <TaskFilters
            tasks={tasks}
            categories={categories}
            onFilter={(f) => setFilters({ ...filters, ...f })}
          />
          <div className="rounded-lg border bg-card p-4">
            <h2 className="mb-3 text-sm font-medium">Quick Add</h2>
            <QuickAddTask />
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
