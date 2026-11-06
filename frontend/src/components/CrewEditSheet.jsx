import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { MODELS } from "@/lib/personas";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Wrench } from "lucide-react";
import { toast } from "sonner";

const TEXT_FIELDS = [
  { key: "name", label: "Name", rows: 0 },
  { key: "description", label: "Description", rows: 2 },
  { key: "role", label: "Role", rows: 2 },
  { key: "goal", label: "Goal", rows: 3 },
  { key: "background", label: "Background", rows: 5 },
  { key: "expected_output", label: "Expected output", rows: 4 },
  { key: "tone", label: "Tone", rows: 0 },
];

const cls = "bg-white/5 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-white/30";

export const CrewEditSheet = ({ agent, onClose, onSaved, onAdvanced }) => {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(agent ? { ...agent } : null); }, [agent]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    setSaving(true);
    try {
      const res = await api.put(`/agents/${agent.id}`, form);
      toast.success(`${res.data.name} updated`);
      onSaved(res.data);
    } catch (error) {
      console.error("Crew update failed:", error);
      toast.error("Could not save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={!!agent} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl bg-zinc-950 border-white/10 text-white overflow-y-auto" data-testid="crew-edit-sheet">
        <SheetHeader>
          <SheetTitle className="font-heading text-white">Edit crew member</SheetTitle>
          <SheetDescription className="text-zinc-400">Change any parameter and save — it applies to the next chat.</SheetDescription>
        </SheetHeader>
        {form && (
          <div className="space-y-5 mt-6">
            {TEXT_FIELDS.map(({ key, label, rows }) => (
              <div key={key} className="space-y-1.5">
                <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-400">{label}</label>
                {rows ? (
                  <Textarea rows={rows} value={form[key] || ""} onChange={(e) => set(key, e.target.value)} className={cls} data-testid={`crew-edit-${key}`} />
                ) : (
                  <Input value={form[key] || ""} onChange={(e) => set(key, e.target.value)} className={cls} data-testid={`crew-edit-${key}`} />
                )}
              </div>
            ))}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-400">Model</label>
              <Select
                value={`${form.model_provider}::${form.model_name}`}
                onValueChange={(v) => { const [p, n] = v.split("::"); setForm((f) => ({ ...f, model_provider: p, model_name: n })); }}
              >
                <SelectTrigger className={cls} data-testid="crew-edit-model"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  {MODELS.map((m) => (
                    <SelectItem key={`${m.provider}::${m.name}`} value={`${m.provider}::${m.name}`} className="focus:bg-white/10">{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2 pb-6">
              <button data-testid="crew-edit-save" onClick={save} disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-zinc-950 text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-60">
                <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save changes"}
              </button>
              <button data-testid="crew-edit-advanced" onClick={() => onAdvanced(form)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 text-sm text-zinc-300 hover:bg-white/10 transition-colors">
                <Wrench className="h-4 w-4" /> Skills & docs
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
