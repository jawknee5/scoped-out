import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Markdown } from "@/components/Markdown";

export const VERDICT = {
  ready: { label: "QA: ready to publish", cls: "text-emerald-300 border-emerald-400/40 bg-emerald-400/10" },
  changes: { label: "QA: needs changes", cls: "text-amber-300 border-amber-400/40 bg-amber-400/10" },
  unknown: { label: "QA reviewed", cls: "text-sky-300 border-sky-400/40 bg-sky-400/10" },
};

export const ReviewDialog = ({ build, onClose }) => (
  <Dialog open={!!build} onOpenChange={(o) => !o && onClose()}>
    <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-zinc-950 border-white/10 text-white" data-testid="review-dialog">
      <DialogHeader>
        <DialogTitle className="font-heading">{VERDICT[build?.review?.verdict || "unknown"].label}</DialogTitle>
        <DialogDescription className="text-zinc-400">
          {build?.title} · reviewed by {build?.review?.agent_name} · {build?.review && new Date(build.review.created_at).toLocaleString()}
        </DialogDescription>
      </DialogHeader>
      {build?.review && <Markdown>{build.review.content}</Markdown>}
    </DialogContent>
  </Dialog>
);
