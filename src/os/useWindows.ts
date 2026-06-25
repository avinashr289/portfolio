import { useCallback, useRef, useState } from "react";
import type { AppId, WinState } from "./types";
import { APPS } from "./appMeta";

let nextId = 1;

export function useWindows() {
  const [wins, setWins] = useState<WinState[]>([]);
  const zTop = useRef(10);
  const spawn = useRef(0);

  const focus = useCallback((id: number) => {
    setWins((ws) => {
      const top = (zTop.current += 1);
      return ws.map((w) => (w.id === id ? { ...w, z: top, minimized: false } : w));
    });
  }, []);

  const open = useCallback((appId: AppId) => {
    setWins((ws) => {
      const existing = ws.find((w) => w.appId === appId);
      const top = (zTop.current += 1);
      if (existing) {
        return ws.map((w) =>
          w.id === existing.id ? { ...w, z: top, minimized: false } : w
        );
      }
      const meta = APPS[appId];
      const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
      const vh = typeof window !== "undefined" ? window.innerHeight : 800;
      const mobile = vw < 760;
      const w = mobile ? vw : Math.min(meta.w, vw - 40);
      const h = mobile ? vh - 110 : Math.min(meta.h, vh - 120);
      const i = spawn.current++ % 6;
      const x = mobile ? 0 : Math.max(20, (vw - w) / 2 - 90 + i * 32);
      const y = mobile ? 44 : Math.max(44, (vh - h) / 2 - 70 + i * 30);
      return [
        ...ws,
        {
          id: nextId++,
          appId,
          title: meta.title,
          x,
          y,
          w,
          h,
          z: top,
          minimized: false,
          maximized: mobile || !!meta.startMaximized,
        },
      ];
    });
  }, []);

  const close = useCallback((id: number) => {
    setWins((ws) => ws.filter((w) => w.id !== id));
  }, []);

  const minimize = useCallback((id: number) => {
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  }, []);

  const toggleMax = useCallback((id: number) => {
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)));
  }, []);

  const move = useCallback((id: number, x: number, y: number) => {
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const resize = useCallback((id: number, w: number, h: number) => {
    setWins((ws) => ws.map((win) => (win.id === id ? { ...win, w, h } : win)));
  }, []);

  return { wins, open, close, focus, minimize, toggleMax, move, resize };
}
