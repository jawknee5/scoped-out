import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api, streamChat } from "@/lib/api";
import { useTheme } from "@/context/ThemeContext";
import { personaOf } from "@/lib/personas";
import { PersonaBackground } from "@/components/PersonaBackground";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/Markdown";
import { SpeakButton } from "@/components/SpeakButton";
import { CodeTools } from "@/components/CodeTools";
import { ArrowLeft, Send, Settings2, GitBranch, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function Chat() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setPersona } = useTheme();
  const [agent, setAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const [a, m] = await Promise.all([
          api.get(`/agents/${agentId}`),
          api.get(`/agents/${agentId}/messages`),
        ]);
        setAgent(a.data);
        setPersona(a.data.persona);
        setMessages(m.data);
      } catch (error) {
        console.error("Failed to load agent/messages:", error);
        toast.error("Agent not found");
        navigate("/dashboard");
      }
    })();
  }, [agentId, navigate, setPersona]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, sending]);

  const sendMessage = async (text, extra = {}) => {
    const userId = `c-${Date.now()}-u`;
    const aiId = `c-${Date.now()}-a`;
    const buildRef = extra.build_id ? { id: extra.build_id, title: extra.title, mode: extra.mode } : undefined;
    setMessages((m) => [...m, { id: userId, role: "user", content: text, build_ref: buildRef }, { id: aiId, role: "assistant", content: "" }]);
    setSending(true);
    try {
      const { title, ...payload } = extra;
      const done = await streamChat(agentId, text, (delta) => {
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { ...copy[copy.length - 1], content: copy[copy.length - 1].content + delta };
          return copy;
        });
      }, undefined, payload);
      if (done?.id) {
        setMessages((m) => m.map((x) => (x.id === aiId ? { ...x, id: done.id, parent_build_id: done.parent_build_id } : x)));
      }
      if (extra.mode === "review") toast.success("QA review saved to the build");
    } catch (error) {
      console.error("Chat stream failed:", error);
      toast.error("The agent couldn't respond. Try again.");
      setMessages((m) => m.slice(0, -2));
      if (!extra.build_id) setInput(text);
    } finally {
      setSending(false);
    }
  };

  const send = () => {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput("");
    sendMessage(text);
  };

  const handoff = location.state?.handoff;
  const handoffSent = useRef(false);
  useEffect(() => {
    if (!agent || !handoff || handoffSent.current) return;
    handoffSent.current = true;
    navigate(location.pathname, { replace: true, state: null });
    const { message, ...extra } = handoff;
    sendMessage(message, extra);
  }, [agent, handoff]); // eslint-disable-line react-hooks/exhaustive-deps

  const p = personaOf(agent?.persona || "default");

  return (
    <div className="h-screen relative flex flex-col overflow-hidden">
      <PersonaBackground persona={agent?.persona || "default"} />

      <header className="sticky top-0 z-20 backdrop-blur-xl bg-zinc-950/60 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            data-testid="chat-back-button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </button>
          <div className="text-center">
            <div className="font-heading tracking-tight text-white" data-testid="chat-agent-name">{agent?.name || "…"}</div>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: p.accent }}>
              {p.label}
            </div>
          </div>
          <button
            data-testid="chat-edit-button"
            onClick={() => agent && navigate("/builder", { state: { agent } })}
            className="p-2 rounded-full border border-white/15 text-zinc-400 hover:bg-white/10 transition-colors"
          >
            <Settings2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 min-h-0 w-full max-w-4xl mx-auto px-6 flex flex-col">
        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto py-10 space-y-8" data-testid="chat-messages">
          {messages.length === 0 && !sending && agent && (
            <div className="h-full flex items-center justify-center text-center">
              <div className="max-w-md">
                <h2 className="font-heading text-3xl tracking-tight font-light text-white">
                  {agent.name}
                </h2>
                <p className="text-zinc-400 mt-3 font-light">
                  {agent.goal || "Ask anything — I'll guide you to the next best step."}
                </p>
              </div>
            </div>
          )}
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={m.id || `msg-${i}`} className="flex justify-end">
                <div className="bg-white/5 rounded-2xl px-6 py-4 max-w-[85%] text-zinc-100 font-light whitespace-pre-wrap">
                  {m.build_ref && (
                    <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-300 mb-2" data-testid="handoff-chip">
                      {m.build_ref.mode === "review" ? <ShieldCheck className="h-3.5 w-3.5" /> : <GitBranch className="h-3.5 w-3.5" />}
                      {m.build_ref.mode === "review" ? "QA handoff" : "Refining"} · {m.build_ref.title}
                    </span>
                  )}
                  {m.content}
                </div>
              </div>
            ) : (
              <motion.div key={m.id || `msg-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="pl-5 border-l-2" style={{ borderColor: p.accent }}>
                <Markdown>{m.content}</Markdown>
                {m.content && <SpeakButton text={m.content} accent={p.accent} />}
                {m.content && !(sending && i === messages.length - 1) && <CodeTools text={m.content} name={agent?.name} agentId={agent?.id} messageId={m.id} parentBuildId={m.parent_build_id} />}
              </motion.div>
            )
          )}
          {sending && messages[messages.length - 1]?.content === "" && (
            <div className="pl-5 border-l-2 flex gap-1.5 items-center" style={{ borderColor: p.accent }}>
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-2 w-2 rounded-full animate-bounce"
                  style={{ backgroundColor: p.accent, animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          )}
        </div>

        <div className="pb-6 pt-2">
          <div className="flex items-end gap-3 rounded-2xl backdrop-blur-xl bg-zinc-900/95 border border-white/10 p-3">
            <Textarea
              data-testid="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              rows={1}
              placeholder={`Message ${agent?.name || "your agent"}…`}
              className="bg-transparent border-0 text-white resize-none focus-visible:ring-0"
            />
            <button
              data-testid="chat-send"
              onClick={send}
              disabled={sending}
              className="p-3 rounded-xl text-zinc-950 transition-transform hover:scale-105 disabled:opacity-50"
              style={{ backgroundColor: p.accent }}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
