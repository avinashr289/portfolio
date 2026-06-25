export type AppId =
  | "terminal"
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "gallery"
  | "resume"
  | "mail";

export interface WinState {
  id: number;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
}

export interface AppMeta {
  id: AppId;
  /** short label shown in dock + title bar */
  title: string;
  /** monospace glyph used as the app icon */
  glyph: string;
  /** accent token name from the theme */
  accent: string;
  /** default window size */
  w: number;
  h: number;
  /** open maximized by default */
  startMaximized?: boolean;
}
