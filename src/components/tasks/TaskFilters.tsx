import { Category, Task } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface Props {
  tasks: Task[];
  categories: Category[];
  onFilter: (filters: { category?: string; status?: Task["status"]; minPriority?: number }) => void;
}

export function TaskFilters({ tasks, categories, onFilter }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Select onValueChange={(v) => onFilter({ category: v === 'all' ? undefined : v })}>
        <SelectTrigger>
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={(v) => onFilter({ status: v === 'all' ? undefined : (v as Task["status"]) })}>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Min Priority</div>
        <Slider defaultValue={[0]} max={100} step={5} onValueChange={(v) => onFilter({ minPriority: v[0] })} />
      </div>
    </div>
  );
}
