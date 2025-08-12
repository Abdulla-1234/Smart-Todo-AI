import AppLayout from "@/components/layout/AppLayout";
import { SEO } from "@/components/seo/SEO";
import { QuickAddTask } from "@/components/tasks/QuickAddTask";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "@/lib/api";

export default function Index() {
  const { data: tasks = [] } = useQuery({ queryKey: ["tasks"], queryFn: fetchTasks });

  const high = tasks.filter((t) => t.priority_score >= 75).length;
  const dueSoon = tasks.filter(
    (t) => t.deadline && new Date(t.deadline) < new Date(Date.now() + 48 * 3600 * 1000)
  ).length;

  return (
    <AppLayout>
      <SEO
        title="Smart Todo AI – Dashboard"
        description="AI-powered task prioritization, deadline suggestions, and context-aware recommendations."
      />

      <section className="relative overflow-hidden">
        <div className="mb-8 rounded-xl border bg-card p-8 shadow-sm">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight">Focus on what matters</h1>
            <p className="mt-2 text-muted-foreground">
              Smart suggestions help you prioritize, plan deadlines, and capture insights from
              your day.
            </p>
            <div className="mt-4">
              <Button variant="hero" asChild>
                <Link to="/tasks">Go to Tasks</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Quick Add</CardTitle>
            </CardHeader>
            <CardContent>
              <QuickAddTask />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{high}</div>
              <div className="text-sm text-muted-foreground">scores ≥ 75</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Due Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dueSoon}</div>
              <div className="text-sm text-muted-foreground">next 48 hours</div>
            </CardContent>
          </Card>
        </div>

        {tasks.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {tasks.slice(0, 4).map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
}
