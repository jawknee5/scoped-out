import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Target, Layers, Zap, FileText } from "lucide-react";

const ACCENT = "#c8ff2e";

const SKILL_WORDS = [
  { t: "law", x: "12%", y: "22%" },
  { t: "research", x: "78%", y: "18%" },
  { t: "finance", x: "8%", y: "68%" },
  { t: "code", x: "88%", y: "62%" },
  { t: "strategy", x: "70%", y: "82%" },
  { t: "creative", x: "22%", y: "88%" },
  { t: "medical", x: "50%", y: "12%" },
];

export default function Login() {
  const spotlightRef = useRef(null);
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const handleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + "/dashboard";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e) => {
      if (!spotlightRef.current) return;
      spotlightRef.current.style.background = `radial-gradient(650px circle at ${e.clientX}px ${e.clientY}px, rgba(200,255,46,0.10), rgba(200,255,46,0.03) 30%, transparent 55%)`;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduceMotion]);

  const features = [
    { icon: Layers, title: "Multi-skilled agents", text: "Toggle skills to blend legal, research, finance and more into one assistant." },
    { icon: Zap, title: "Two steps ahead", text: "Every reply guides you to the single next best move — with the why." },
    { icon: FileText, title: "Reads your docs", text: "Attach files and it pulls only the most relevant passages per question." },
  ];

  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{ backgroundColor: "#0b0d07", color: "#f4f4ec" }}>
      {/* backdrop layers */}
      <div className="absolute inset-0 -z-10">
        {/* grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(200,255,46,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,46,0.06) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(circle at 70% 40%, black 0%, transparent 72%)",
          }}
        />
        {/* ambient aurora blobs */}
        {!reduceMotion && (
          <>
            <motion.div
              className="absolute h-[520px] w-[520px] rounded-full blur-[130px]"
              style={{ background: "rgba(200,255,46,0.10)", left: "-8%", top: "20%" }}
              animate={{ x: [0, 60, -20, 0], y: [0, -40, 30, 0], opacity: [0.6, 0.9, 0.7, 0.6] }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute h-[440px] w-[440px] rounded-full blur-[130px]"
              style={{ background: "rgba(80,180,255,0.08)", right: "0%", bottom: "-6%" }}
              animate={{ x: [0, -50, 20, 0], y: [0, 30, -20, 0], opacity: [0.5, 0.8, 0.6, 0.5] }}
              transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
        {/* anamorphic hero artwork */}
        <div
          className="absolute right-0 top-0 h-full w-[64%] bg-no-repeat bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://static.prod-images.emergentagent.com/jobs/dc78c072-16a0-4d45-9298-3c46a367ad53/images/05efac5482fef5c4225f9b27fa02f6506ffda24da2b8d8d5ed6e484cd4641ec5.jpeg)",
            maskImage: "linear-gradient(to right, transparent, black 40%)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 40%)",
          }}
        />
        {/* ghosted skill words revealed on load */}
        {SKILL_WORDS.map((s, i) => (
          <motion.span
            key={s.t}
            className="absolute font-mono uppercase tracking-[0.3em] text-[11px] select-none"
            style={{ left: s.x, top: s.y, color: "rgba(200,255,46,0.22)" }}
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.6 + i * 0.12, duration: 0.8 }}
          >
            {s.t}
          </motion.span>
        ))}
      </div>

      {/* cursor spotlight overlay */}
      <div ref={spotlightRef} className="pointer-events-none fixed inset-0 -z-10" style={{ mixBlendMode: "screen" }} />

      <div className="max-w-6xl mx-auto px-6 lg:px-10 min-h-screen flex flex-col relative">
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
            The only limits,
            <br />
            are <span style={{ color: ACCENT }}>your own.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-7 text-lg max-w-xl leading-relaxed"
            style={{ color: "rgba(244,244,236,0.65)" }}
          >
            No more "that's out of scope." Configure a personal AI with the exact role,
            skills and mission you need — you draw the lines, it delivers.
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
                whileHover={{ y: -4 }}
                className="rounded-2xl p-5 border transition-colors"
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
