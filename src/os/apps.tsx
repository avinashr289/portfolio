import { useState } from "react";
import {
  profile,
  education,
  skillGroups,
  quests,
  projects,
  inventory,
  accentHex,
} from "../data/resume";
import type { AppId } from "./types";

// ── whoami / About ──────────────────────────────────────────────────────────
export function AboutApp({ onOpen }: { onOpen: (a: AppId) => void }) {
  return (
    <div className="p-5 font-mono text-sm text-slate-300">
      <pre className="mb-4 text-[11px] leading-tight text-neon/90">{`   _____   __   ___
  / _ \\ \\ / /  |_ _|
 | (_) \\ V /    | |
  \\___/ \\_/    |___|  avinash · runtime`}</pre>
      <div className="grid grid-cols-[88px_1fr] gap-x-3 gap-y-1.5">
        <span className="text-slate-500">name</span>
        <span className="text-white">{profile.name}</span>
        <span className="text-slate-500">role</span>
        <span className="text-amber">{profile.title}</span>
        <span className="text-slate-500">focus</span>
        <span>{profile.classLabel}</span>
        <span className="text-slate-500">location</span>
        <span>{profile.location}</span>
        <span className="text-slate-500">school</span>
        <span>
          {education.degree}, {education.school} ({education.years})
        </span>
      </div>
      <p className="mt-4 max-w-prose text-slate-400">{profile.tagline}</p>

      <div className="mt-5 border-t border-white/10 pt-4">
        <p className="mb-2 text-xs uppercase tracking-widest text-slate-500">contact</p>
        <div className="flex flex-col gap-1.5">
          <a className="text-neon hover:underline" href={`mailto:${profile.email}`}>
            ✉ {profile.email}
          </a>
          <span className="text-slate-300">☎ {profile.phone}</span>
          <a className="text-neon hover:underline" href={profile.github.url} target="_blank" rel="noreferrer">
            ⌥ {profile.github.label}
          </a>
          <a className="text-neon hover:underline" href={profile.linkedin.url} target="_blank" rel="noreferrer">
            in {profile.linkedin.label}
          </a>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Chip onClick={() => onOpen("experience")}>view experience →</Chip>
        <Chip onClick={() => onOpen("projects")}>view projects →</Chip>
        <Chip onClick={() => onOpen("resume")}>open resume →</Chip>
      </div>
    </div>
  );
}

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded border border-white/15 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-slate-300 transition hover:border-neon/60 hover:text-white"
    >
      {children}
    </button>
  );
}

// ── Experience ──────────────────────────────────────────────────────────────
export function ExperienceApp() {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex h-full flex-col font-mono text-sm md:flex-row">
      <nav className="shrink-0 border-b border-white/10 p-2 md:w-52 md:border-b-0 md:border-r">
        <p className="px-2 py-1 text-[10px] uppercase tracking-widest text-slate-500">~/experience</p>
        <div className="flex gap-1 overflow-x-auto md:flex-col">
          {quests.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOpen(i)}
              className={`whitespace-nowrap rounded px-2.5 py-2 text-left text-xs transition ${
                open === i ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5"
              }`}
            >
              <span className="block font-semibold">{q.company}</span>
              <span className="text-[10px] text-slate-500">{q.dates}</span>
            </button>
          ))}
        </div>
      </nav>

      <article className="min-h-0 flex-1 overflow-auto p-5">
        {(() => {
          const q = quests[open];
          return (
            <>
              <h3 className="text-base font-semibold text-white">
                {q.role} <span className="text-amber">@ {q.company}</span>
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                {q.note ? `${q.note} · ` : ""}
                {q.dates}
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {q.achievements.map((a) => (
                  <li
                    key={a}
                    className="rounded-full border border-amber/40 bg-amber/10 px-2.5 py-0.5 text-[11px] text-amber"
                  >
                    {a}
                  </li>
                ))}
              </ul>
              <ul className="mt-4 space-y-2 text-slate-300">
                {q.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-neon">▸</span>
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </>
          );
        })()}
      </article>
    </div>
  );
}

// ── Projects (file browser) ─────────────────────────────────────────────────
export function ProjectsApp() {
  const [sel, setSel] = useState(0);
  return (
    <div className="flex h-full flex-col font-mono text-sm md:flex-row">
      <nav className="shrink-0 border-b border-white/10 p-2 md:w-56 md:border-b-0 md:border-r">
        <p className="px-2 py-1 text-[10px] uppercase tracking-widest text-slate-500">~/projects</p>
        <div className="flex gap-1 overflow-x-auto md:flex-col">
          {projects.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setSel(i)}
              className={`flex items-center gap-2 whitespace-nowrap rounded px-2.5 py-2 text-left text-xs transition ${
                sel === i ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5"
              }`}
            >
              <span style={{ color: accentHex[p.accent] }}>▣</span>
              {p.name}
            </button>
          ))}
        </div>
      </nav>

      <article className="min-h-0 flex-1 overflow-auto p-5">
        {(() => {
          const p = projects[sel];
          const c = accentHex[p.accent];
          return (
            <>
              <div className="flex items-center gap-2">
                <span style={{ color: c }}>▣</span>
                <h3 className="text-base font-semibold text-white">{p.name}</h3>
              </div>
              <p className="mt-1 text-xs uppercase tracking-wide" style={{ color: c }}>
                {p.tag}
              </p>
              <p className="mt-3 leading-relaxed text-slate-300">{p.blurb}</p>
              <p className="mt-4 text-[10px] uppercase tracking-widest text-slate-500">stack</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded border border-white/15 bg-white/[0.04] px-2 py-0.5 text-[11px] text-slate-300"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </>
          );
        })()}
      </article>
    </div>
  );
}

// ── Skills ──────────────────────────────────────────────────────────────────
export function SkillsApp() {
  return (
    <div className="p-5 font-mono text-sm">
      <p className="mb-4 text-xs text-slate-500">
        <span className="text-neon">$</span> skills --list <span className="text-slate-600">// no levels, no bars — just the kit</span>
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {skillGroups.map((g) => {
          const c = accentHex[g.accent];
          return (
            <div key={g.group} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: c }}>
                {g.group}
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {g.skills.map((s) => (
                  <li
                    key={s}
                    className="rounded border px-2 py-0.5 text-[11px] text-slate-200"
                    style={{ borderColor: `${c}55`, background: `${c}12` }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Off-Duty gallery (anime / games / food) ─────────────────────────────────
export function GalleryApp() {
  const r = inventory.recipe;
  return (
    <div className="grid gap-4 p-5 font-mono text-sm sm:grid-cols-2">
      <Panel title={inventory.anime.label} accent="#ff2e88" glyph="✦">
        <ul className="space-y-1.5 text-slate-300">
          {inventory.anime.items.map((t, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-magenta">▸</span>
              {t}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title={inventory.games.label} accent="#00e5ff" glyph="◉">
        <ul className="space-y-1.5 text-slate-300">
          {inventory.games.items.map((t, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-neon">▸</span>
              {t}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title={`${r.title} — ${r.subtitle}`} accent="#fcee0a" glyph="☕" wide>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <p className="mb-1 text-[10px] uppercase tracking-widest text-slate-500">ingredients</p>
            <ul className="space-y-1 text-slate-300">
              {r.ingredients.map((it, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-amber">+</span>
                  {it}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <p className="mb-1 text-[10px] uppercase tracking-widest text-slate-500">method</p>
            <ol className="space-y-1 text-slate-300">
              {r.steps.map((it, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-amber">{i + 1}.</span>
                  {it}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-slate-500">
          {r.serves} · {r.cookTime}
        </p>
      </Panel>
    </div>
  );
}

function Panel({
  title,
  accent,
  glyph,
  wide,
  children,
}: {
  title: string;
  accent: string;
  glyph: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-lg border border-white/10 bg-white/[0.02] p-3 ${wide ? "sm:col-span-2" : ""}`}
    >
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color: accent }}>
        <span>{glyph}</span>
        {title}
      </p>
      {children}
    </div>
  );
}

// ── Write to me ─────────────────────────────────────────────────────────────
const MAIL_TO = "avinashr289@gmail.com";
const MAIL_SUBJECT = encodeURIComponent("Hey from your portfolio");
const MAIL_BODY = encodeURIComponent("Hi Avinash,\n\nI came across your portfolio and wanted to reach out.\n\n");
const MAILTO = `mailto:${MAIL_TO}?subject=${MAIL_SUBJECT}&body=${MAIL_BODY}`;

export function MailApp() {
  return (
    <div className="relative flex min-h-full flex-col items-center justify-center p-8 font-mono text-sm overflow-hidden">

      {/* visible grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,46,136,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,46,136,0.12) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* sweeping pink gradient — screensaver loop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #ff2e882a 0%, transparent 45%, #ff2e8819 100%)",
          backgroundSize: "300% 300%",
          animation: "gradientSweep 5s ease-in-out infinite",
        }}
      />
      {/* content — above the gradient layers */}
      <div className="relative z-10 flex flex-col items-center">
      <img
        src="/avatar.png"
        alt="Avinash R"
        className="h-28 w-28 rounded-full object-cover object-top"
        style={{ border: "2px solid #ff2e88", boxShadow: "0 0 24px #ff2e8866" }}
      />

      <h2 className="mt-5 text-xl font-semibold text-white">Say hello.</h2>
      <p className="mt-2 max-w-sm text-center text-slate-400 leading-relaxed">
        Got a project in mind, a role to share, or just want to connect?
        I read every message.
      </p>

      <div className="mt-6 flex flex-col items-center gap-3">
        {/* primary CTA — opens native mail */}
        <a
          href={MAILTO}
          className="flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-slate-900 transition hover:opacity-90 active:scale-95"
          style={{ background: "#ff2e88" }}
        >
          ✉ Compose an email
        </a>
        <p className="text-xs text-slate-500">
          Opens in your default mail app (Gmail, macOS Mail, etc.)
        </p>
      </div>

      {/* address line */}
      <div className="mt-8 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5">
        <span className="text-magenta">✉</span>
        <a href={`mailto:${MAIL_TO}`} className="text-neon hover:underline">
          {MAIL_TO}
        </a>
        <button
          type="button"
          title="Copy address"
          onClick={() => navigator.clipboard.writeText(MAIL_TO)}
          className="ml-2 rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-400 hover:text-white"
        >
          copy
        </button>
      </div>

      {/* quick links */}
      <div className="mt-6 flex gap-3">
        <a
          href={profile.github.url}
          target="_blank"
          rel="noreferrer"
          className="rounded border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400 hover:text-neon hover:border-neon/40 transition"
        >
          ⌥ GitHub
        </a>
        <a
          href={profile.linkedin.url}
          target="_blank"
          rel="noreferrer"
          className="rounded border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400 hover:text-neon hover:border-neon/40 transition"
        >
          in LinkedIn
        </a>
      </div>
      </div>{/* end content z-10 wrapper */}
    </div>
  );
}

// ── Resume viewer ───────────────────────────────────────────────────────────
export function ResumeApp() {
  return (
    <div className="flex h-full flex-col bg-[#0b0d13]">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2 font-mono text-xs text-slate-400">
        <span className="text-amber">↧</span>
        <span>Avinash_Resume.pdf</span>
        <a
          href="/Avinash_Resume.pdf"
          download
          className="ml-auto rounded border border-amber/50 bg-amber/10 px-2.5 py-1 text-amber hover:bg-amber/20"
        >
          download
        </a>
        <a
          href="/Avinash_Resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="rounded border border-white/15 px-2.5 py-1 text-slate-300 hover:bg-white/5"
        >
          open ↗
        </a>
      </div>
      <object
        data="/Avinash_Resume.pdf#toolbar=0&navpanes=0"
        type="application/pdf"
        className="min-h-0 flex-1"
        aria-label="Avinash R resume PDF"
      >
        <div className="grid h-full place-items-center p-6 text-center font-mono text-sm text-slate-400">
          <div>
            <p>Inline preview unavailable in this browser.</p>
            <a
              href="/Avinash_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block rounded border border-amber/50 bg-amber/10 px-3 py-1.5 text-amber"
            >
              Open the resume ↗
            </a>
          </div>
        </div>
      </object>
    </div>
  );
}
