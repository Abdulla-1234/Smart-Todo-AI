import { Task } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const priorityColor = (score: number) =>
  score >= 75 ? "text-destructive" : score >= 50 ? "text-accent-foreground" : "text-muted-foreground";

export function TaskCard({ task }: { task: Task }) {
  return (
    <Card className="hover:shadow-elevated transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{task.title}</CardTitle>
            {task.description && (
              <CardDescription className="mt-1 line-clamp-2">{task.description}</CardDescription>
            )}
          </div>
          {task.category && (
            <Badge variant="secondary">{task.category}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm mt-2">
          <div className={cn("font-medium", priorityColor(task.priority_score))}>
            Priority: {task.priority_score}
          </div>
          <div className="text-muted-foreground">
            {task.deadline ? `Due ${format(new Date(task.deadline), 'PP')}` : 'No deadline'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
