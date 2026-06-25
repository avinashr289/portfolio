// Accessible, static, keyboard-navigable version of the same content.
// Shown to reduced-motion users by default, and reachable via the "text mode"
// button. Reads the same data model as the OS desktop.

import {
  profile,
  education,
  skillGroups,
  quests,
  projects,
  inventory,
  accentHex,
} from "../data/resume";

export default function Fallback({ onDesktop }: { onDesktop?: () => void }) {
  return (
    <div className="min-h-[100dvh] bg-[#0b0d13] font-mono text-slate-100">
      <div className="mx-auto max-w-3xl px-5 py-12">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-widest text-amber">Text Mode</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">{profile.name}</h1>
          <p className="mt-1 text-sm text-neon">{profile.title}</p>
          <p className="mt-3 max-w-prose text-sm text-slate-400">{profile.tagline}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <a className="text-neon hover:underline" href={`mailto:${profile.email}`}>{profile.email}</a>
            <span className="text-slate-400">{profile.phone}</span>
            <a className="text-neon hover:underline" href={profile.github.url} target="_blank" rel="noreferrer">{profile.github.label}</a>
            <a className="text-neon hover:underline" href={profile.linkedin.url} target="_blank" rel="noreferrer">{profile.linkedin.label}</a>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="/Avinash_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-amber/50 bg-amber/10 px-4 py-2 text-xs uppercase tracking-wide text-amber hover:bg-amber/20"
            >
              ↧ Resume PDF
            </a>
            {onDesktop && (
              <button
                type="button"
                onClick={onDesktop}
                className="rounded-lg bg-neon px-4 py-2 text-xs uppercase tracking-wide text-slate-900 hover:bg-neon/80"
              >
                ▶ Launch the interactive desktop
              </button>
            )}
          </div>
        </header>

        <Section title="Experience">
          <div className="space-y-5">
            {quests.map((q, i) => (
              <article key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <h3 className="text-sm font-semibold text-white">
                  {q.role} <span className="text-amber">@ {q.company}</span>
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  {q.note ? `${q.note} · ` : ""}{q.dates}
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
                  {q.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="text-neon">▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        <Section title="Projects">
          <div className="space-y-4">
            {projects.map((p) => (
              <article key={p.name} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <h3 className="text-sm font-semibold text-white">{p.name}</h3>
                <p className="text-xs uppercase tracking-wide" style={{ color: accentHex[p.accent] }}>{p.tag}</p>
                <p className="mt-2 text-sm text-slate-300">{p.blurb}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <li key={s} className="rounded border border-white/15 px-2 py-0.5 text-[11px] text-slate-300">{s}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        <Section title="Skills">
          <div className="grid gap-3 sm:grid-cols-2">
            {skillGroups.map((g) => (
              <div key={g.group} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: accentHex[g.accent] }}>{g.group}</p>
                <ul className="flex flex-wrap gap-1.5">
                  {g.skills.map((s) => (
                    <li key={s} className="rounded border border-white/15 px-2 py-0.5 text-[11px] text-slate-300">{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Education">
          <p className="text-sm text-slate-300">
            {education.degree} — {education.school} ({education.years})
          </p>
        </Section>

        <Section title="Off-Duty">
          <div className="space-y-3 text-sm text-slate-300">
            <p><span className="text-magenta">Anime:</span> {inventory.anime.items.join(" · ")}</p>
            <p><span className="text-neon">Games:</span> {inventory.games.items.join(" · ")}</p>
            <p><span className="text-amber">{inventory.recipe.title}:</span> {inventory.recipe.ingredients.join(", ")}.</p>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-semibold uppercase tracking-wide text-white">{title}</h2>
      {children}
    </section>
  );
}
