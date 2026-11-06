import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import { extractCodeBlocks, buildPreview, buildTitle, downloadZip } from "@/lib/codeBlocks";
import { PreviewDialog, pillBtn } from "@/components/PreviewDialog";
import { Eye, Download, Check } from "lucide-react";
import { toast } from "sonner";

export const CodeTools = ({ text, name = "site", agentId, messageId, parentBuildId }) => {
  const blocks = useMemo(() => extractCodeBlocks(text || ""), [text]);
  const preview = useMemo(() => buildPreview(blocks), [blocks]);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  if (!blocks.length) return null;

  const saveBuild = async () => {
    if (saved || !agentId) return;
    try {
      await api.post("/builds", { agent_id: agentId, message_id: messageId, parent_build_id: parentBuildId, title: buildTitle(blocks, `${name} build`), files: blocks });
      setSaved(true);
      toast.success("Saved to your Builds");
    } catch (error) {
      console.error("Build save failed:", error);
      toast.error("Preview opened, but the build could not be saved");
    }
  };

  const download = () => downloadZip(blocks, name).catch((error) => {
    console.error("Zip failed:", error);
    toast.error("Could not build the download");
  });

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3" data-testid="code-tools">
      {preview && (
        <button className={pillBtn} onClick={() => { setOpen(true); saveBuild(); }} data-testid="preview-site-btn">
          <Eye className="h-3.5 w-3.5" /> Live preview
        </button>
      )}
      <button className={pillBtn} onClick={download} data-testid="download-code-btn">
        <Download className="h-3.5 w-3.5" /> Download code ({blocks.length} file{blocks.length > 1 ? "s" : ""})
      </button>
      {saved && (
        <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400" data-testid="build-saved-badge">
          <Check className="h-3.5 w-3.5" /> Saved build
        </span>
      )}
      <PreviewDialog open={open} onOpenChange={setOpen} html={preview} subtitle="HTML, CSS and JS from this reply — saved to your Builds." />
    </div>
  );
};
