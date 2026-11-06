import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { buildPreview } from "@/lib/codeBlocks";

const fileStatus = (name, mine, other) => {
  const a = mine.find((f) => f.name === name);
  const b = other.find((f) => f.name === name);
  if (!b) return { label: "only here", cls: "text-sky-300" };
  return a.body === b.body ? { label: "same", cls: "text-zinc-500" } : { label: "changed", cls: "text-amber-300" };
};

const Side = ({ build, other, side }) => {
  const html = buildPreview(build.files);
  return (
    <div className="flex flex-col min-h-0 gap-2" data-testid={`compare-side-${side}`}>
      <div>
        <p className="font-heading text-white line-clamp-1">{build.title}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-mono mt-1">
          {build.files.map((f) => {
            const s = fileStatus(f.name, build.files, other.files);
            return <span key={f.name} className={s.cls}>{f.name} · {s.label}</span>;
          })}
        </div>
      </div>
      {html ? (
        <iframe title={`Compare ${side}`} srcDoc={html} sandbox="allow-scripts allow-forms allow-modals" className="flex-1 w-full rounded-lg bg-white" />
      ) : (
        <div className="flex-1 grid place-items-center rounded-lg border border-white/10 text-zinc-500 text-sm">No previewable page in this build</div>
      )}
    </div>
  );
};

export const CompareDialog = ({ pair, onClose }) => (
  <Dialog open={pair.length === 2} onOpenChange={(o) => !o && onClose()}>
    <DialogContent className="max-w-[96vw] w-[96vw] h-[88vh] bg-zinc-950 border-white/10 text-white flex flex-col" data-testid="compare-dialog">
      <DialogHeader>
        <DialogTitle className="font-heading">Compare builds</DialogTitle>
        <DialogDescription className="text-zinc-400">Side by side, with which files changed between them.</DialogDescription>
      </DialogHeader>
      {pair.length === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
          <Side build={pair[0]} other={pair[1]} side="left" />
          <Side build={pair[1]} other={pair[0]} side="right" />
        </div>
      )}
    </DialogContent>
  </Dialog>
);
