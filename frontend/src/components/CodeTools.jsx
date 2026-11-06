import { useMemo, useState } from "react";
import JSZip from "jszip";
import { extractCodeBlocks, buildPreview } from "@/lib/codeBlocks";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Eye, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const btn = "inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border border-white/15 text-zinc-300 hover:bg-white/10 transition-colors";

export const CodeTools = ({ text, name = "site" }) => {
  const blocks = useMemo(() => extractCodeBlocks(text || ""), [text]);
  const preview = useMemo(() => buildPreview(blocks), [blocks]);
  const [open, setOpen] = useState(false);
  if (!blocks.length) return null;

  const download = async () => {
    try {
      const zip = new JSZip();
      blocks.forEach((b) => zip.file(b.name, b.body));
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${name.toLowerCase().replace(/\W+/g, "-")}-code.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (error) {
      console.error("Zip failed:", error);
      toast.error("Could not build the download");
    }
  };

  const popOut = () => {
    const url = URL.createObjectURL(new Blob([preview], { type: "text/html" }));
    window.open(url, "_blank", "noopener");
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3" data-testid="code-tools">
      {preview && (
        <button className={btn} onClick={() => setOpen(true)} data-testid="preview-site-btn">
          <Eye className="h-3.5 w-3.5" /> Live preview
        </button>
      )}
      <button className={btn} onClick={download} data-testid="download-code-btn">
        <Download className="h-3.5 w-3.5" /> Download code ({blocks.length} file{blocks.length > 1 ? "s" : ""})
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl w-[95vw] h-[85vh] bg-zinc-950 border-white/10 text-white flex flex-col" data-testid="preview-dialog">
          <DialogHeader className="flex-row items-center justify-between space-y-0 pr-8">
            <div>
              <DialogTitle className="font-heading">Live preview</DialogTitle>
              <DialogDescription className="text-zinc-400">HTML, CSS and JS from this reply, running in a safe sandbox.</DialogDescription>
            </div>
            <button className={btn} onClick={popOut} data-testid="preview-popout-btn">
              <ExternalLink className="h-3.5 w-3.5" /> New tab
            </button>
          </DialogHeader>
          <iframe title="Live site preview" srcDoc={preview || ""} sandbox="allow-scripts allow-forms allow-modals"
            className="flex-1 w-full rounded-lg bg-white" data-testid="preview-iframe" />
        </DialogContent>
      </Dialog>
    </div>
  );
};
