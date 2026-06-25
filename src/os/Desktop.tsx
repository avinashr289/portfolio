import { useCallback, useEffect, useState } from "react";
import { DOCK_ORDER, APPS } from "./appMeta";
import Terminal from "./Terminal";
import {
  AboutApp,
  ExperienceApp,
  ProjectsApp,
  SkillsApp,
  GalleryApp,
  ResumeApp,
  MailApp,
} from "./apps";
import type { AppId } from "./types";
import { useKonamiCode } from "../hooks";
import { setAudioEnabled, sfxOpen, sfxBoot, sfxPowerup } from "./audio";
import { profile } from "../data/resume";

function AppView({ appId, onOpen }: { appId: AppId; onOpen: (a: AppId) => void }) {
  switch (appId) {
    case "terminal": return <Terminal onOpen={onOpen} />;
    case "about":    return <AboutApp onOpen={onOpen} />;
    case "experience": return <ExperienceApp />;
    case "projects": return <ProjectsApp />;
    case "skills":   return <SkillsApp />;
    case "gallery":  return <GalleryApp />;
    case "resume":   return <ResumeApp />;
    case "mail":     return <MailApp />;
  }
}

export default function Desktop({ onTextMode }: { onTextMode: () => void }) {
  const [active, setActive] = useState<AppId>("terminal");
  const [sound, setSound] = useState(false);
  const [clock, setClock] = useState("--:--");
  const [konami, setKonami] = useState(false);
  const [dockVisible, setDockVisible] = useState(false);

  // Live clock
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
    };
    tick();
    const t = setInterval(tick, 15000);
    return () => clearInterval(t);
  }, []);

  const onOpen = useCallback((a: AppId) => {
    sfxOpen();
    setActive(a);
  }, []);

  const unlock = useCallback(() => {
    setKonami(true);
    sfxPowerup();
    setTimeout(() => setKonami(false), 3200);
  }, []);
  useKonamiCode(unlock);

  function toggleSound() {
    const next = !sound;
    setSound(next);
    setAudioEnabled(next);
    if (next) sfxBoot();
  }

  const accent = APPS[active].accent;

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#070810] font-mono text-slate-100">
      {/* backdrop: grid + glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.05) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div
          className="absolute -left-40 -top-40 h-[60vh] w-[60vh] rounded-full blur-[120px] transition-all duration-700"
          style={{ background: `radial-gradient(circle, ${accent}22, transparent 70%)` }}
        />
        <div
          className="absolute -bottom-40 -right-40 h-[55vh] w-[55vh] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(255,46,136,0.10), transparent 70%)" }}
        />
      </div>

      {/* top bar */}
      <header className="absolute inset-x-0 top-0 z-50 flex h-7 items-center gap-3 border-b border-white/10 bg-black/50 px-3 text-xs backdrop-blur">
        {active === "terminal" ? (
          <>
            <span className="font-semibold text-neon">◉ aviOS</span>
            <span className="hidden text-slate-500 sm:inline">/ {profile.name}</span>
          </>
        ) : (
          <button
            type="button"
            onClick={() => onOpen("terminal")}
            className="flex items-center gap-1.5 font-semibold text-neon hover:opacity-70 transition"
            title="Return to shell"
          >
            ← Return to Shell
          </button>
        )}
        <div className="ml-auto flex items-center gap-3">
          <button type="button" onClick={toggleSound} aria-pressed={sound} className="text-slate-400 hover:text-white">
            {sound ? "♪ on" : "♪ off"}
          </button>
          <button
            type="button"
            onClick={() => onOpen("mail")}
            className="rounded border border-magenta/50 bg-magenta/10 px-2 py-0.5 text-magenta transition hover:bg-magenta/20"
          >
            ✉ write to me
          </button>
          <button type="button" onClick={onTextMode} className="text-slate-400 hover:text-white">
            text mode
          </button>
          <span className="text-slate-300">{clock}</span>
        </div>
      </header>

      {/* main pane — fills remaining height */}
      <main
        className="absolute inset-x-0 overflow-hidden"
        style={{ top: "1.75rem", bottom: 0 }}
      >
        <div className="h-full overflow-auto">
          <AppView key={active} appId={active} onOpen={onOpen} />
        </div>
      </main>


      {/* popup dock — hidden until hover/tap near bottom edge */}
      <div
        className="absolute inset-x-0 bottom-0 z-50 flex justify-center"
        onMouseEnter={() => setDockVisible(true)}
        onMouseLeave={() => setDockVisible(false)}
      >
        {/* invisible trigger strip */}
        <div className="absolute inset-x-0 bottom-0 h-10" />
        {/* dock itself */}
        <div
          className="pointer-events-auto mb-3 flex items-center gap-1.5 rounded-2xl border border-white/10 bg-black/70 p-1.5 shadow-2xl backdrop-blur-md transition-all duration-200 sm:gap-2 sm:p-2"
          style={{
            opacity: dockVisible ? 1 : 0,
            transform: dockVisible ? "translateY(0)" : "translateY(80%)",
            pointerEvents: dockVisible ? "auto" : "none",
          }}
        >
          {DOCK_ORDER.map((id) => {
            const meta = APPS[id];
            const isActive = id === active;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onOpen(id)}
                title={meta.title}
                className="group relative grid h-10 w-10 place-items-center rounded-xl border bg-white/[0.03] text-sm transition-all hover:-translate-y-1 hover:bg-white/10 sm:h-11 sm:w-11"
                style={{
                  color: meta.accent,
                  borderColor: isActive ? `${meta.accent}88` : "rgba(255,255,255,0.10)",
                }}
              >
                {meta.glyph}
                <span className="pointer-events-none absolute -top-7 whitespace-nowrap rounded bg-black/80 px-1.5 py-0.5 text-[10px] text-slate-200 opacity-0 transition group-hover:opacity-100">
                  {meta.title}
                </span>
                {isActive && (
                  <span
                    className="absolute -bottom-0.5 h-1 w-1 rounded-full"
                    style={{ background: meta.accent }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* konami overlay */}
      {konami && (
        <div className="pointer-events-none absolute inset-0 z-[9500] grid place-items-center">
          <div className="rounded-xl border border-amber/60 bg-black/80 px-8 py-6 text-center shadow-2xl">
            <p className="text-3xl">🕹️ 1-UP</p>
            <p className="mt-2 text-sm uppercase tracking-widest text-amber">secret unlocked</p>
            <p className="mt-1 text-xs text-slate-400">root access granted. ship something cool.</p>
          </div>
        </div>
      )}
    </div>
  );
}
