import { useRef, type ReactNode } from "react";
import type { WinState } from "./types";
import { APPS } from "./appMeta";
import { sfxClose } from "./audio";

interface Props {
  win: WinState;
  active: boolean;
  mobile: boolean;
  children: ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMax: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (w: number, h: number) => void;
}

export default function Window({
  win,
  active,
  mobile,
  children,
  onFocus,
  onClose,
  onMinimize,
  onToggleMax,
  onMove,
  onResize,
}: Props) {
  const accent = APPS[win.appId].accent;
  const drag = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
  const rez = useRef<{ px: number; py: number; ow: number; oh: number } | null>(null);

  const maximized = win.maximized || mobile;

  function startDrag(e: React.PointerEvent) {
    if (maximized) return;
    onFocus();
    drag.current = { px: e.clientX, py: e.clientY, ox: win.x, oy: win.y };
    const onMoveEv = (ev: PointerEvent) => {
      if (!drag.current) return;
      const nx = drag.current.ox + (ev.clientX - drag.current.px);
      const ny = Math.max(28, drag.current.oy + (ev.clientY - drag.current.py));
      onMove(nx, ny);
    };
    const onUp = () => {
      drag.current = null;
      window.removeEventListener("pointermove", onMoveEv);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMoveEv);
    window.addEventListener("pointerup", onUp);
  }

  function startResize(e: React.PointerEvent) {
    e.stopPropagation();
    onFocus();
    rez.current = { px: e.clientX, py: e.clientY, ow: win.w, oh: win.h };
    const onMoveEv = (ev: PointerEvent) => {
      if (!rez.current) return;
      const nw = Math.max(320, rez.current.ow + (ev.clientX - rez.current.px));
      const nh = Math.max(220, rez.current.oh + (ev.clientY - rez.current.py));
      onResize(nw, nh);
    };
    const onUp = () => {
      rez.current = null;
      window.removeEventListener("pointermove", onMoveEv);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMoveEv);
    window.addEventListener("pointerup", onUp);
  }

  const style: React.CSSProperties = maximized
    ? { left: 0, top: mobile ? 36 : 28, width: "100%", height: mobile ? "calc(100% - 92px)" : "calc(100% - 84px)", zIndex: win.z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

  return (
    <section
      className="absolute flex flex-col overflow-hidden rounded-lg border bg-[#0b0d13]/95 backdrop-blur-sm shadow-2xl"
      style={{
        ...style,
        borderColor: active ? accent : "rgba(255,255,255,0.10)",
        boxShadow: active
          ? `0 0 0 1px ${accent}66, 0 18px 50px rgba(0,0,0,0.6)`
          : "0 12px 40px rgba(0,0,0,0.5)",
      }}
      onPointerDown={onFocus}
      role="dialog"
      aria-label={win.title}
    >
      {/* Title bar */}
      <header
        className="flex h-8 shrink-0 cursor-grab items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3 active:cursor-grabbing"
        onPointerDown={startDrag}
        onDoubleClick={onToggleMax}
      >
        <span className="font-mono text-xs" style={{ color: accent }}>
          {APPS[win.appId].glyph}
        </span>
        <span className="select-none font-mono text-xs tracking-wide text-slate-300">
          avi@os:~/{win.title}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Minimize"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onMinimize}
            className="grid h-4 w-4 place-items-center rounded-sm text-[10px] text-slate-500 hover:bg-white/10 hover:text-slate-200"
          >
            –
          </button>
          {!mobile && (
            <button
              type="button"
              aria-label="Maximize"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={onToggleMax}
              className="grid h-4 w-4 place-items-center rounded-sm text-[9px] text-slate-500 hover:bg-white/10 hover:text-slate-200"
            >
              ▢
            </button>
          )}
          <button
            type="button"
            aria-label="Close"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              sfxClose();
              onClose();
            }}
            className="grid h-4 w-4 place-items-center rounded-sm text-[10px] text-slate-500 hover:bg-magenta/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>

      {/* Resize handle */}
      {!maximized && (
        <div
          onPointerDown={startResize}
          className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize"
          style={{
            background:
              "linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.25) 60%, transparent 60%)",
          }}
        />
      )}
    </section>
  );
}
