import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { buildPreview, downloadZip } from "@/lib/codeBlocks";
import { BuildCard } from "@/components/BuildCard";
import { PreviewDialog } from "@/components/PreviewDialog";
import { CompareDialog } from "@/components/CompareDialog";
import { HandoffDialog } from "@/components/HandoffDialog";
import { ReviewDialog } from "@/components/ReviewDialog";
import { ArrowLeft, GitCompare } from "lucide-react";
import { toast } from "sonner";

export default function Builds() {
  const navigate = useNavigate();
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  const [picked, setPicked] = useState([]);
  const [comparing, setComparing] = useState(false);
  const [agents, setAgents] = useState([]);
  const [handoff, setHandoff] = useState({ build: null, mode: "refine" });
  const [reviewing, setReviewing] = useState(null);

  useEffect(() => {
    api.get("/agents").then((r) => setAgents(r.data)).catch((error) => console.error("Load agents failed:", error));
    api.get("/builds")
      .then((r) => setBuilds(r.data))
      .catch((error) => { console.error("Load builds failed:", error); toast.error("Could not load builds"); })
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p.slice(-1), id]));

  const remove = async (b) => {
    try {
      await api.delete(`/builds/${b.id}`);
      setBuilds((list) => list.filter((x) => x.id !== b.id));
      setPicked((p) => p.filter((x) => x !== b.id));
      toast.success("Build deleted");
    } catch (error) {
      console.error("Delete build failed:", error);
      toast.error("Could not delete build");
    }
  };

  const pair = comparing ? picked.map((id) => builds.find((b) => b.id === id)).filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="max-w-7xl mx-auto px-6 py-10">
        <button onClick={() => navigate("/dashboard")} className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white" data-testid="builds-back-btn">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </button>
        <div className="flex flex-wrap items-end justify-between gap-4 mt-6 mb-8">
          <div>
            <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-zinc-500">Saved automatically when you preview</p>
            <h1 className="font-heading text-3xl sm:text-4xl tracking-tight font-light mt-2">Site builds</h1>
          </div>
          <button
            data-testid="compare-open-btn"
            disabled={picked.length !== 2}
            onClick={() => setComparing(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-zinc-950 font-medium disabled:opacity-40 transition-opacity"
          >
            <GitCompare className="h-4 w-4" /> Compare {picked.length}/2
          </button>
        </div>
        {loading ? (
          <p className="text-zinc-500" data-testid="builds-loading">Loading…</p>
        ) : builds.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-zinc-400" data-testid="builds-empty">
            No builds yet. Ask Webcrafter for a site, then hit <span className="text-white">Live preview</span> — it lands here.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="builds-grid">
            {builds.map((b) => (
              <BuildCard
                key={b.id}
                build={b}
                selected={picked.includes(b.id)}
                canPreview={!!buildPreview(b.files)}
                onOpen={() => setViewing(b)}
                onDownload={() => downloadZip(b.files, b.title)}
                onDelete={() => remove(b)}
                onToggleCompare={() => toggle(b.id)}
                onRefine={() => setHandoff({ build: b, mode: "refine" })}
                onReview={() => setHandoff({ build: b, mode: "review" })}
                onViewReview={() => setReviewing(b)}
              />
            ))}
          </div>
        )}
      </main>
      <PreviewDialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)} html={viewing ? buildPreview(viewing.files) : ""} title={viewing?.title} subtitle={viewing?.agent_name} />
      <CompareDialog pair={pair} onClose={() => setComparing(false)} />
      <HandoffDialog build={handoff.build} mode={handoff.mode} agents={agents} onClose={() => setHandoff({ build: null, mode: handoff.mode })} />
      <ReviewDialog build={reviewing} onClose={() => setReviewing(null)} />
    </div>
  );
}
