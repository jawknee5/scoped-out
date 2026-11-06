import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";
import { openInTab } from "@/lib/codeBlocks";

export const pillBtn = "inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border border-white/15 text-zinc-300 hover:bg-white/10 transition-colors";

export const PreviewDialog = ({ open, onOpenChange, html, title = "Live preview", subtitle }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-6xl w-[95vw] h-[85vh] bg-zinc-950 border-white/10 text-white flex flex-col" data-testid="preview-dialog">
      <DialogHeader className="flex-row items-center justify-between space-y-0 pr-8">
        <div>
          <DialogTitle className="font-heading">{title}</DialogTitle>
          <DialogDescription className="text-zinc-400">{subtitle || "Running in a safe sandbox."}</DialogDescription>
        </div>
        <button className={pillBtn} onClick={() => openInTab(html)} data-testid="preview-popout-btn">
          <ExternalLink className="h-3.5 w-3.5" /> New tab
        </button>
      </DialogHeader>
      <iframe title="Live site preview" srcDoc={html || ""} sandbox="allow-scripts allow-forms allow-modals"
        className="flex-1 w-full rounded-lg bg-white" data-testid="preview-iframe" />
    </DialogContent>
  </Dialog>
);
