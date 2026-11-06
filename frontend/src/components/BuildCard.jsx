import { Eye, Download, Trash2, GitCompare } from "lucide-react";
import { pillBtn } from "@/components/PreviewDialog";

export const BuildCard = ({ build, selected, canPreview, onOpen, onDownload, onDelete, onToggleCompare }) => (
  <div
    data-testid={`build-card-${build.id}`}
    className={`rounded-2xl border p-5 bg-white/5 backdrop-blur-xl transition-colors ${selected ? "border-emerald-400/70" : "border-white/10 hover:border-white/25"}`}
  >
    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500">
      {build.agent_name} · {new Date(build.created_at).toLocaleString()}
    </p>
    <h3 className="font-heading text-lg text-white mt-1 line-clamp-1" data-testid={`build-title-${build.id}`}>{build.title}</h3>
    <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{build.files.map((f) => f.name).join(" · ")}</p>
    <div className="flex flex-wrap gap-2 mt-4">
      {canPreview && (
        <button className={pillBtn} onClick={onOpen} data-testid={`build-open-${build.id}`}><Eye className="h-3.5 w-3.5" /> Open</button>
      )}
      <button className={pillBtn} onClick={onDownload} data-testid={`build-download-${build.id}`}><Download className="h-3.5 w-3.5" /> Download</button>
      <button className={`${pillBtn} ${selected ? "bg-emerald-400/15 text-emerald-300" : ""}`} onClick={onToggleCompare} data-testid={`build-compare-${build.id}`}>
        <GitCompare className="h-3.5 w-3.5" /> {selected ? "Selected" : "Compare"}
      </button>
      <button className={`${pillBtn} hover:bg-red-500/20 hover:text-red-300`} onClick={onDelete} data-testid={`build-delete-${build.id}`}><Trash2 className="h-3.5 w-3.5" /></button>
    </div>
  </div>
);
