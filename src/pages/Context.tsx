import AppLayout from "@/components/layout/AppLayout";
import { SEO } from "@/components/seo/SEO";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ContextEntry, SourceType } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchContext, addContext as addContextApi } from "@/lib/api";

export default function ContextPage() {
  const queryClient = useQueryClient();
  const { data: entries = [] } = useQuery({ queryKey: ["context"], queryFn: fetchContext });

  const addContextMutation = useMutation({
    mutationFn: (payload: { content: string; source_type: SourceType }) => addContextApi(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["context"] }),
  });

  const addEntry = (content: string, source: SourceType) => {
    addContextMutation.mutate({ content, source_type: source });
    toast({ title: "Context added" });
  };

  return (
    <AppLayout>
      <SEO title="Smart Todo AI – Context" description="Capture daily context from messages, email and notes to power smarter task suggestions." path="/context" />

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Context History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entries.map(e => (
                <div key={e.id} className="rounded-lg border p-4">
                  <div className="mb-1 text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()} • {e.source_type}</div>
                  <div className="whitespace-pre-wrap">{e.content}</div>
                  {e.processed_insights && (
                    <div className="mt-2 text-xs text-muted-foreground">Keywords: {(e.processed_insights.keywords || []).join(', ')}</div>
                  )}
                </div>
              ))}
              {entries.length === 0 && (
                <div className="text-muted-foreground">No context captured yet.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Context</CardTitle>
          </CardHeader>
          <CardContent>
            <ContextForm onAdd={addEntry} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function ContextForm({ onAdd }: { onAdd: (content: string, source: SourceType) => void }) {
  const [content, setContent] = useLocalStorage<string>("context-draft", "");
  const [source, setSource] = useLocalStorage<SourceType>("context-source", "notes");

  return (
    <div className="space-y-3">
      <Textarea placeholder="Paste messages, emails, or notes here" value={content} onChange={(e) => setContent(e.target.value)} />
      <Select value={source} onValueChange={(v) => setSource(v as SourceType)}>
        <SelectTrigger>
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="notes">Notes</SelectItem>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="whatsapp">WhatsApp</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex items-center gap-2">
        <Button variant="soft" onClick={() => { setContent(""); }}>Clear</Button>
        <Button variant="hero" onClick={() => { if (content.trim()) { onAdd(content, source); setContent(""); } }}>Add Context</Button>
      </div>
    </div>
  );
}
