# Avinash R — aviOS (Interactive Desktop Portfolio)

**aviOS** is an interactive **dev-terminal operating system** that doubles as the portfolio of
Avinash R (backend & blockchain engineer). It boots to a desktop with a dock and draggable,
resizable windows. The centerpiece is a real **terminal** — type commands like `whoami`,
`skills`, `experience kgen`, `projects`, `resume`, or `open gallery` and the content comes back
inline. Every section is also its own app window: a Files-style **projects** browser, an
**experience** viewer, a **skills** board (no bars — just the kit), an **off-duty** gallery
(anime · games · food), and a **resume** app that previews the actual PDF.

It's interactive but every piece is *functional* — a terminal-driven OS says "I think in
systems," and visitors can find anything fast. That's the answer to "why not just a PDF."

## Stack

- **Vite** + **React 18** + **TypeScript**.
- **Tailwind CSS** for all the OS chrome (windows, dock, terminal, panels).
- **WebAudio** for synthesized retro sound effects (no audio files).
- No 3D, no heavy deps — the whole app is **~57 KB gzipped**. Builds to static files
  (Vercel, Netlify, GitHub Pages, etc.); no backend.

## Run it

```bash
cd portfolio
npm install      # first time only
npm run dev      # start dev server (http://localhost:5173)
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build locally
```

## How to use it

- **Terminal:** click the window and type. `help` lists every command. Try `whoami`, `skills`,
  `experience kgen`, `projects`, `neofetch`, `contact`, `resume`, `open projects`. Up/Down arrows
  scroll command history; `clear` resets the screen.
- **Apps:** click any glyph in the **dock** (bottom) to open it — `>_` terminal, `@` whoami,
  `#` experience, `/` projects, `%` skills, `~` off-duty, `↧` resume.
- **Windows:** drag the title bar to move, drag the bottom-right corner to resize, double-click
  the title bar to maximize. The `– ▢ ✕` buttons minimize / maximize / close.
- **Resume:** the resume app previews `public/Avinash_Resume.pdf` inline with download / open
  buttons.
- **Sound:** off by default — toggle with **♪ sound** (top-right).
- **Text Mode:** the **text mode** button (top-right) switches to a static, fully accessible
  page with all the same content.
- **Easter egg:** the Konami code works anywhere — `↑ ↑ ↓ ↓ ← → ← → B A`.

## Accessibility

- Visitors with **`prefers-reduced-motion`** land in **Text Mode** automatically. Everyone can
  switch to it (and back to the desktop) via the buttons.
- The Text Mode page is semantic, keyboard-navigable, and lists every section.
- Windows are focus-managed; the dock and window controls are real buttons with labels.

## Updating content

All content lives in **`src/data/resume.ts`** (single source of truth, pulled from the resume at
`../resume.html`). The terminal, every app window, and Text Mode all read from it — so one edit
updates everything. To swap the resume PDF, replace **`public/Avinash_Resume.pdf`**.

## Project layout

```
src/
├── data/resume.ts          # all content (profile, experience, skills, projects, off-duty)
├── os/
│   ├── types.ts            # AppId + window/app types
│   ├── appMeta.ts          # app registry (titles, glyphs, accents) + dock order
│   ├── useWindows.ts       # window-manager state (open/close/focus/move/resize)
│   ├── Window.tsx          # draggable/resizable window chrome
│   ├── Desktop.tsx         # the shell: top bar, dock, boot, Konami, sound, text-mode toggle
│   ├── Terminal.tsx        # the terminal app + command interpreter
│   ├── apps.tsx            # about / experience / projects / skills / gallery / resume apps
│   └── audio.ts            # synthesized WebAudio sound effects
├── components/
│   └── Fallback.tsx        # accessible static "Text Mode"
├── hooks.ts                # reduced-motion + Konami code
└── App.tsx                 # chooses Desktop vs Text Mode
```

## Restyling

Theme colors (accents `neon` / `amber` / `magenta` / `lime` / `violet`) are in
`tailwind.config.js`. App glyphs, titles, and default window sizes are in `src/os/appMeta.ts`.
Terminal commands and their output live in `src/os/Terminal.tsx`.
