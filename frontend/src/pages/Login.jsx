import { motion } from "framer-motion";
import { ArrowRight, Target, Layers, Zap, FileText } from "lucide-react";

const ACCENT = "#c8ff2e";

export default function Login() {
  const handleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + "/dashboard";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const features = [
    { icon: Layers, title: "Multi-skilled agents", text: "Toggle skills to blend legal, research, finance and more into one assistant." },
    { icon: Zap, title: "Two steps ahead", text: "Every reply guides you to the single next best move — with the why." },
    { icon: FileText, title: "Reads your docs", text: "Attach files and it pulls only the most relevant passages per question." },
  ];

  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{ backgroundColor: "#0b0d07", color: "#f4f4ec" }}>
      {/* distinct backdrop: warm off-black + lime scope motif + grid */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(200,255,46,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,46,0.06) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(circle at 70% 40%, black 0%, transparent 70%)",
          }}
        />
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="absolute -right-40 top-1/2 -translate-y-1/2 opacity-[0.35]"
        >
          <svg width="820" height="820" viewBox="0 0 820 820" fill="none">
            {[380, 300, 220, 140, 70].map((r, i) => (
              <circle key={i} cx="410" cy="410" r={r} stroke={ACCENT} strokeOpacity={0.25 - i * 0.03} strokeWidth="1.5" />
            ))}
            <line x1="410" y1="20" x2="410" y2="800" stroke={ACCENT} strokeOpacity="0.15" strokeWidth="1" />
            <line x1="20" y1="410" x2="800" y2="410" stroke={ACCENT} strokeOpacity="0.15" strokeWidth="1" />
          </svg>
        </motion.div>
        <div className="absolute -left-32 -bottom-32 h-[420px] w-[420px] rounded-full blur-[120px]" style={{ background: "rgba(200,255,46,0.10)" }} />
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 min-h-screen flex flex-col">
        {/* top bar */}
        <div className="flex items-center justify-between py-7">
          <div className="flex items-center gap-2.5">
            <span className="grid place-items-center h-9 w-9 rounded-xl" style={{ backgroundColor: ACCENT }}>
              <Target className="h-5 w-5" style={{ color: "#0b0d07" }} />
            </span>
            <span className="font-heading text-lg tracking-tight">Scoped&nbsp;Out</span>
          </div>
          <button
            data-testid="top-login-button"
            onClick={handleLogin}
            className="text-sm font-medium px-4 py-2 rounded-full border transition-colors hover:bg-white/5"
            style={{ borderColor: "rgba(244,244,236,0.2)" }}
          >
            Sign in
          </button>
        </div>

        {/* hero */}
        <div className="flex-1 flex flex-col justify-center py-10 max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex w-fit items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-[11px] tracking-[0.25em] uppercase"
            style={{ backgroundColor: "rgba(200,255,46,0.12)", color: ACCENT }}
          >
            Build your own AI specialist
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-heading font-semibold mt-6 leading-[0.95] tracking-tight text-5xl sm:text-6xl lg:text-7xl"
          >
            Scope out the
            <br />
            <span style={{ color: ACCENT }}>perfect agent</span> for
            <br />
            any job you've got.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-7 text-lg max-w-xl leading-relaxed"
            style={{ color: "rgba(244,244,236,0.65)" }}
          >
            Configure a personal AI assistant with the exact role, goals and skills you need —
            or start from a powerful template and make it yours in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <button
              data-testid="google-login-button"
              onClick={handleLogin}
              className="group inline-flex items-center gap-3 pl-5 pr-6 py-3.5 rounded-full font-semibold transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: ACCENT, color: "#0b0d07" }}
            >
              <img alt="" className="h-5 w-5" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" />
              Continue with Google
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <span className="font-mono text-[11px] tracking-widest uppercase" style={{ color: "rgba(244,244,236,0.4)" }}>
              Free to start · No setup
            </span>
          </motion.div>

          {/* feature row */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.07 }}
                className="rounded-2xl p-5 border"
                style={{ borderColor: "rgba(244,244,236,0.12)", backgroundColor: "rgba(244,244,236,0.02)" }}
              >
                <f.icon className="h-5 w-5" style={{ color: ACCENT }} />
                <h3 className="font-heading text-base mt-3">{f.title}</h3>
                <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "rgba(244,244,236,0.55)" }}>
                  {f.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="py-6 font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(244,244,236,0.3)" }}>
          Scoped Out — your agents, precisely tuned
        </div>
      </div>
    </div>
  );
}
