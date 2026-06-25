import { useEffect, useState } from "react";

// ── ASCII art ─────────────────────────────────────────────────────────────────

const CLIENT = `  .========.
  |  >_ avi |
  |  local  |
  '========'`;

const SERVER_A = `  .=========.
  | [=] [=] |
  |---------|
  | [=] [=] |
  |---------|
  |  .===.  |
  '========='`;

const SERVER_B = `  .=========.
  | [ ] [=] |
  |---------|
  | [=] [ ] |
  |---------|
  |  [ . ]  |
  '========='`;

// ── Sequence data ─────────────────────────────────────────────────────────────

const HANDSHAKE = [
  { ms:  550, dir: "right", label: "SYN",     color: "#00e5ff" },
  { ms: 1150, dir: "left",  label: "SYN-ACK", color: "#ffb347" },
  { ms: 1700, dir: "right", label: "ACK",     color: "#00e5ff" },
] as const;

const STATUS = [
  { ms: 2350, label: "TCP/IP  ", value: "ESTABLISHED", c: "#7cffb2" },
  { ms: 2850, label: "TLS 1.3 ", value: "NEGOTIATED",  c: "#7cffb2" },
  { ms: 3350, label: "IDENTITY", value: "VERIFIED",    c: "#00e5ff" },
];

// ── Component ─────────────────────────────────────────────────────────────────

type Stage = "handshake" | "secured";

export function BootScreen({ onDone }: { onDone: () => void }) {
  const [visiblePackets, setVisiblePackets] = useState<number[]>([]);
  const [visibleStatus,  setVisibleStatus]  = useState<number[]>([]);
  const [stage,          setStage]          = useState<Stage>("handshake");
  const [serverFrame,    setServerFrame]    = useState(0);
  const [fading,         setFading]         = useState(false);

  // Reveal packets + status lines, then banner, then fade
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    HANDSHAKE.forEach((h, i) => {
      timers.push(setTimeout(() => setVisiblePackets(p => [...p, i]), h.ms));
    });
    STATUS.forEach((s, i) => {
      timers.push(setTimeout(() => setVisibleStatus(p => [...p, i]), s.ms));
    });
    timers.push(setTimeout(() => setStage("secured"), 4000));
    // Hold banner briefly then fade out
    timers.push(setTimeout(() => setFading(true),     5200));
    timers.push(setTimeout(() => onDone(),             5950));

    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  // Server rack blink
  useEffect(() => {
    const iv = setInterval(() => setServerFrame(f => 1 - f), 650);
    return () => clearInterval(iv);
  }, []);

  const serverArt = serverFrame === 0 ? SERVER_A : SERVER_B;

  return (
    <div
      className="fixed inset-0 z-[9000] flex flex-col overflow-hidden bg-[#070a10] font-mono"
      style={{ transition: "opacity 0.75s", opacity: fading ? 0 : 1 }}
    >
      {/* ── Top status bar ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-8 pt-6 text-[11px] select-none" style={{ color: "#334155" }}>
        <span style={{ color: "#00e5ff44" }}>aviOS</span>
        <span>
          {stage === "handshake" && <span className="animate-pulse">ESTABLISHING CONNECTION...</span>}
          {stage === "secured"   && <span style={{ color: "#7cffb2" }}>● CONNECTION SECURED</span>}
        </span>
      </div>

      {/* ── Handshake diagram ─────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center gap-10 px-4">

        {/* Three-column layout: client · arrows · server */}
        <div className="flex items-center gap-8 md:gap-20">

          {/* Client box */}
          <div className="flex flex-col items-center gap-2">
            <pre className="leading-snug text-[15px] md:text-[17px] font-bold"
              style={{ color: "#00e5ffaa" }}>{CLIENT}</pre>
            <span className="text-[11px] tracking-widest font-semibold" style={{ color: "#475569" }}>CLIENT</span>
          </div>

          {/* Packet arrows */}
          <div className="flex flex-col gap-4" style={{ minWidth: "clamp(180px, 28vw, 300px)" }}>
            {HANDSHAKE.map((h, i) => (
              visiblePackets.includes(i) && (
                <div
                  key={i}
                  className="overflow-hidden whitespace-nowrap text-[14px] md:text-[16px] font-bold"
                  style={{
                    color: h.color,
                    transformOrigin: h.dir === "right" ? "left center" : "right center",
                    animation: "drawPacket 0.38s ease-out forwards",
                  }}
                >
                  {h.dir === "right"
                    ? `------[ ${h.label} ]-------->`
                    : `<--------[ ${h.label} ]------`}
                </div>
              )
            ))}
          </div>

          {/* Server box */}
          <div className="flex flex-col items-center gap-2">
            <pre className="leading-snug text-[15px] md:text-[17px] font-bold"
              style={{ color: "#ffb347aa" }}>{serverArt}</pre>
            <span className="text-[11px] tracking-widest font-semibold" style={{ color: "#475569" }}>avi@aviOS</span>
          </div>
        </div>

        {/* Status lines */}
        {visibleStatus.length > 0 && (
          <div className="flex flex-col gap-2 text-[13px] md:text-[15px] font-semibold">
            {STATUS.filter((_, i) => visibleStatus.includes(i)).map((s, i) => (
              <div key={i} className="flex gap-3">
                <span style={{ color: "#475569" }}>{s.label}</span>
                <span style={{ color: "#1e293b" }}>{"............"}</span>
                <span style={{ color: s.c }} className="tracking-widest">{s.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* CONNECTION SECURED banner */}
        {stage === "secured" && (
          <div
            className="px-10 py-3 text-center text-base md:text-lg tracking-[0.2em] font-bold"
            style={{
              color: "#7cffb2",
              border: "1px solid #7cffb244",
              boxShadow: "0 0 32px #7cffb222",
              animation: "fadeInUp 0.5s ease-out forwards",
            }}
          >
            CONNECTION SECURED
          </div>
        )}
      </div>
    </div>
  );
}
