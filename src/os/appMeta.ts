import type { AppId, AppMeta } from "./types";

// Registry of OS "apps". Order here is the dock order.
export const APPS: Record<AppId, AppMeta> = {
  terminal:   { id: "terminal",   title: "terminal",   glyph: ">_", accent: "#00e5ff", w: 720, h: 460, startMaximized: true },
  about:      { id: "about",      title: "whoami",     glyph: "@",  accent: "#9b8cff", w: 560, h: 420 },
  experience: { id: "experience", title: "experience", glyph: "#",  accent: "#fcee0a", w: 680, h: 500 },
  projects:   { id: "projects",   title: "projects",   glyph: "/",  accent: "#19e6c1", w: 700, h: 460 },
  skills:     { id: "skills",     title: "skills",     glyph: "%",  accent: "#00e5ff", w: 560, h: 440 },
  gallery:    { id: "gallery",    title: "off-duty",   glyph: "~",  accent: "#ff2e88", w: 640, h: 480 },
  resume:     { id: "resume",     title: "resume",     glyph: "↧",  accent: "#fcee0a", w: 760, h: 560 },
  mail:       { id: "mail",       title: "write to me", glyph: "✉", accent: "#ff2e88", w: 620, h: 480 },
};

export const DOCK_ORDER: AppId[] = [
  "terminal",
  "about",
  "experience",
  "projects",
  "skills",
  "gallery",
  "resume",
  "mail",
];
