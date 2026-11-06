import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { GitBranch, ShieldCheck } from "lucide-react";

const COPY = {
  refine: { title: "Refine into a new version", desc: "Your builder gets the full code and saves the result as the next version.", label: "What should change?", cta: "Start refining", placeholder: "e.g. Add a menu section, make the hero bolder, improve mobile spacing" },
  review: { title: "Send to QA for review", desc: "QA checks it before you publish and saves a verdict on the build.", label: "Anything QA should focus on? (optional)", cta: "Send to QA", placeholder: "e.g. Check the contact form and mobile layout" },
};

const pickDefault = (mode, build, agents) => {
  if (mode === "review") return (agents.find((a) => a.name.toLowerCase() === "qa") || agents[0])?.id;
  return agents.some((a) => a.id === build.agent_id) ? build.agent_id : (agents.find((a) => a.name === "Webcrafter") || agents[0])?.id;
};

export const HandoffDialog = ({ build, mode, agents, onClose }) => {
  const navigate = useNavigate();
  const [agentId, setAgentId] = useState("");
  const [note, setNote] = useState("");
  const [useReview, setUseReview] = useState(true);
  const c = COPY[mode] || COPY.refine;

  useEffect(() => {
    if (!build) return;
    setAgentId(pickDefault(mode, build, agents) || "");
    setNote(mode === "refine" && build.review?.verdict === "changes" ? "Fix the issues QA found." : "");
  }, [build, mode, agents]);

  const submit = () => {
    const message = note.trim() || (mode === "review" ? "Please review this build before I publish it." : "Improve it using your best judgement.");
    navigate(`/chat/${agentId}`, { state: { handoff: { message, build_id: build.id, mode, title: build.title, include_review: mode === "refine" && useReview } } });
  };

  return (
    <Dialog open={!!build} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-zinc-950 border-white/10 text-white" data-testid={`handoff-dialog-${mode}`}>
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2">
            {mode === "review" ? <ShieldCheck className="h-4 w-4" /> : <GitBranch className="h-4 w-4" />} {c.title}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">{build?.title} — {c.desc}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={agentId} onValueChange={setAgentId}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="handoff-agent-select"><SelectValue placeholder="Choose a crew member" /></SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10 text-white">
              {agents.map((a) => <SelectItem key={a.id} value={a.id} className="focus:bg-white/10">{a.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-400">{c.label}</label>
            <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder={c.placeholder} className="bg-white/5 border-white/10 text-white" data-testid="handoff-note" />
          </div>
          {mode === "refine" && build?.review && (
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <Checkbox checked={useReview} onCheckedChange={(v) => setUseReview(!!v)} data-testid="handoff-include-review" />
              Include the latest QA review feedback
            </label>
          )}
          <button disabled={!agentId} onClick={submit} data-testid="handoff-submit"
            className="w-full px-5 py-3 rounded-full bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50">
            {c.cta}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
