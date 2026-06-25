import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  profile,
  education,
  skillGroups,
  quests,
  projects,
  inventory,
} from "../data/resume";
import type { AppId } from "./types";
import { sfxKey, sfxEnter, sfxError } from "./audio";

interface Line {
  prompt?: string;
  node: ReactNode;
}

const PROMPT = "avi@os:~$";

function C({ children }: { children: React.ReactNode }) {
  return <span className="rounded bg-white/10 px-1 text-neon">{children}</span>;
}

function Banner() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <img
          src={`${import.meta.env.BASE_URL}avatar.png`}
          alt="Avinash R"
          className="h-20 w-20 shrink-0 rounded-full object-cover object-top"
          style={{ border: "2px solid #00e5ff", boxShadow: "0 0 14px #00e5ff55" }}
        />
        <div>
          <p className="text-white font-semibold text-base leading-tight">Avinash R</p>
          <p className="text-neon text-xs mt-0.5">{profile.title} · aviOS v3.0</p>
          <p className="text-slate-400 text-xs mt-2 leading-relaxed">
            Try{" "}
            <C>open projects</C> to browse my work,{" "}
            <C>experience kgen</C> for my current role, or{" "}
            <C>whoami</C> for a quick intro.{" "}
            Type <C>help</C> for the full command list.
          </p>
        </div>
      </div>
      <div className="border-b border-white/10" />
    </div>
  );
}

export default function Terminal({ onOpen }: { onOpen: (a: AppId) => void }) {
  const [lines, setLines] = useState<Line[]>(() => [
    { node: <Banner /> },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  function push(node: ReactNode, prompt?: string) {
    setLines((l) => [...l, { node, prompt }]);
  }

  function run(raw: string) {
    const cmd = raw.trim();
    push(<span className="text-slate-200">{cmd}</span>, PROMPT);
    if (cmd) {
      setHistory((h) => [...h, cmd]);
      setHIdx(-1);
    }
    const [name, ...args] = cmd.split(/\s+/);
    const arg = args.join(" ").toLowerCase();

    switch (name.toLowerCase()) {
      case "":
        break;
      case "help":
        push(<HelpOut />);
        break;
      case "whoami":
      case "about":
        push(<WhoamiOut />);
        if (name.toLowerCase() === "about") onOpen("about");
        break;
      case "skills":
        push(<SkillsOut />);
        break;
      case "exp":
      case "experience":
        if (arg) showRole(arg, push);
        else push(<ExpListOut />);
        break;
      case "projects":
        push(<ProjListOut />);
        break;
      case "ls":
        push(<LsOut arg={arg} />);
        break;
      case "cat":
        catFile(arg, push);
        break;
      case "education":
      case "edu":
        push(
          <span className="text-slate-300">
            {education.degree} — {education.school} ({education.years})
          </span>
        );
        break;
      case "contact":
        push(<ContactOut />);
        break;
      case "resume":
        push(<span className="text-slate-400">Opening resume…</span>);
        onOpen("resume");
        break;
      case "gallery":
      case "offduty":
        push(<GalleryOut />);
        if (name.toLowerCase() === "offduty") onOpen("gallery");
        break;
      case "open": {
        const valid: AppId[] = [
          "terminal",
          "about",
          "experience",
          "projects",
          "skills",
          "gallery",
          "resume",
          "mail",
        ];
        const target = (arg === "whoami" ? "about" : arg) as AppId;
        if (valid.includes(target)) {
          push(<span className="text-slate-400">Launching {target}…</span>);
          onOpen(target);
        } else {
          sfxError();
          push(<span className="text-magenta">open: unknown app '{arg}'. Try: about, experience, projects, skills, gallery, resume</span>);
        }
        return;
      }
      case "neofetch":
        push(<Neofetch />);
        break;
      case "echo":
        push(<span className="text-slate-300">{args.join(" ")}</span>);
        break;
      case "date":
        push(<span className="text-slate-300">Always shipping o'clock.</span>);
        break;
      case "sudo":
        sfxError();
        push(<span className="text-magenta">avi is not in the sudoers file. This incident will be reported. 🚨</span>);
        break;
      case "konami":
        push(
          <span className="text-amber">
            Hint: ↑ ↑ ↓ ↓ ← → ← → B A — try it anywhere.
          </span>
        );
        break;

      // ── funny commands ──────────────────────────────────────────────────────
      case "coffee":
      case "chai":
        push(
          <div className="text-amber">
            <pre className="leading-tight">{`    ( (
     ) )
  ........
  |      |]
  \\      /
   \`----'`}</pre>
            <p className="mt-1">Brewing… ☕ <span className="text-slate-400">Caffeine levels restored. Ready to ship.</span></p>
          </div>
        );
        break;
      case "git":
        if (arg.startsWith("blame")) {
          push(<span className="text-magenta">fatal: it was definitely the PM's fault.</span>);
        } else if (arg.startsWith("push")) {
          push(<span className="text-magenta">error: pre-push hook failed — did you test in prod? (just kidding. please don't.)</span>);
        } else if (arg.startsWith("commit")) {
          push(<span className="text-amber">[main abc1234] "fix: fix the fix that fixed the previous fix"</span>);
        } else if (arg.startsWith("log")) {
          push(
            <div className="text-slate-300 space-y-0.5">
              <p><span className="text-amber">abc1234</span> fix: fix the fix that fixed the previous fix</p>
              <p><span className="text-amber">def5678</span> chore: remove console.log (this time for real)</p>
              <p><span className="text-amber">789abcd</span> feat: it works on my machine</p>
              <p><span className="text-amber">012efgh</span> hotfix: revert "feat: it works on my machine"</p>
            </div>
          );
        } else {
          push(<span className="text-magenta">git: '{arg || "??"}' is not a git command. But you already knew that.</span>);
        }
        break;
      case "npm":
        if (arg.startsWith("install") || arg === "i") {
          push(
            <div className="text-slate-300">
              <p>added 847 packages, removed 3, changed 12 packages in 47s</p>
              <p className="text-magenta mt-0.5">47 vulnerabilities (12 moderate, 35 high, 0 critical... actually 3 critical)</p>
              <p className="text-slate-500 mt-0.5">npm warn: have you tried turning it off and on again?</p>
            </div>
          );
        } else if (arg.startsWith("run build")) {
          push(<span className="text-lime">✓ built in 498ms (suspiciously fast — proceed with caution)</span>);
        } else {
          push(<span className="text-slate-300">npm {arg} — completed. node_modules is now 4GB.</span>);
        }
        break;
      case "docker":
        if (arg.startsWith("ps")) {
          push(
            <div className="text-slate-300 font-mono text-xs space-y-0.5">
              <p className="text-slate-500">CONTAINER ID   IMAGE              STATUS        NAMES</p>
              <p><span className="text-neon">a1b2c3d4</span>   lazy-chain:prod    Up 47 days    lazy-chain</p>
              <p><span className="text-neon">e5f6a7b8</span>   postgres:14        Up 47 days    db</p>
              <p><span className="text-neon">c9d0e1f2</span>   redis:7            Up 47 days    cache</p>
              <p><span className="text-amber">dead1234</span>   todo-app:latest    Exited (137)  that-side-project</p>
            </div>
          );
        } else {
          push(<span className="text-slate-300">docker {arg} — it works in the container at least.</span>);
        }
        break;
      case "ping":
        push(
          <div className="text-slate-300 space-y-0.5">
            <p>PING {arg || "google.com"}: 56 bytes of data.</p>
            <p>64 bytes: icmp_seq=0 time=<span className="text-lime">2.1ms</span></p>
            <p>64 bytes: icmp_seq=1 time=<span className="text-lime">1.9ms</span></p>
            <p className="text-slate-500">--- {arg || "google.com"} ping statistics ---</p>
            <p>3 packets transmitted, 3 received, <span className="text-lime">0% packet loss</span></p>
            <p className="text-slate-500">(your internet is fine. the bug is elsewhere.)</p>
          </div>
        );
        break;
      case "ssh":
        push(
          <span className="text-magenta">
            ssh: connect to host {arg || "prod"} port 22: <span className="text-amber">Are you sure this is a good idea?</span> Production is sleeping. Let it sleep.
          </span>
        );
        break;
      case "rm":
        if (arg.includes("-rf") || arg.includes("--force")) {
          sfxError();
          push(
            <div>
              <p className="text-magenta">rm: cannot remove '/': Permission denied.</p>
              <p className="text-slate-400 mt-0.5">Nice try. This is a portfolio, not a footgun simulator.</p>
            </div>
          );
        } else {
          push(<span className="text-slate-400">removed '{arg}' (not really — this is a demo)</span>);
        }
        break;
      case "vim":
      case "vi":
        push(
          <div className="text-slate-300">
            <p>Opened {arg || "file"} in vim.</p>
            <p className="text-slate-500 mt-0.5">Type <span className="text-amber">:q!</span> to exit.</p>
            <p className="text-slate-500">Or don't. You may be here a while.</p>
          </div>
        );
        break;
      case "emacs":
        push(<span className="text-magenta">error: an operating system without a text editor. please install vim.</span>);
        break;
      case "blockchain":
      case "web3":
        push(
          <div className="text-slate-300 space-y-0.5">
            <p><span className="text-neon">lazy-chain</span>: syncing block 18,291,447… ✓</p>
            <p>gas price: <span className="text-amber">12 gwei</span> (good time to transact)</p>
            <p>pending txns: <span className="text-lime">1,047,291</span> (the usual)</p>
            <p className="text-slate-500 mt-0.5">pro tip: log inscriptions cost ~60% less gas than ERC-20 transfers.</p>
          </div>
        );
        break;
      case "go":
        if (arg.startsWith("run")) {
          push(
            <div className="text-slate-300">
              <p className="text-lime">✓ compiled in 0.3s</p>
              <p className="text-slate-400 mt-0.5">Server listening on :8080</p>
              <p className="text-slate-500">Handling 1M+ requests/day like it's nothing.</p>
            </div>
          );
        } else if (arg === "build") {
          push(<span className="text-lime">✓ built binary in 1.2s (try doing that in Node.js)</span>);
        } else {
          push(<span className="text-slate-300">go {arg} — the gopher approves.</span>);
        }
        break;
      case "anime":
        push(
          <div className="text-magenta space-y-0.5">
            <p>Loading recommendations…</p>
            <p className="text-slate-300">Current status: deep in a long-form arc.</p>
            <p className="text-slate-300">Watching: classified. Ask in person.</p>
            <p className="text-slate-500 mt-0.5">Soundtrack on loop while shipping late.</p>
          </div>
        );
        break;
      case "food":
        push(
          <div className="text-amber space-y-0.5">
            <p>☕ Dev Fuel status: <span className="text-lime">OPTIMAL</span></p>
            <p className="text-slate-300">Last meal: something taken seriously.</p>
            <p className="text-slate-300">Next meal: after this feature lands.</p>
            <p className="text-slate-500 mt-0.5">Recipe: <span className="text-neon">open gallery</span> → Dev Fuel card.</p>
          </div>
        );
        break;
      case "fortune":
        push(<FortuneCookie />);
        break;
      case "cowsay":
        push(
          <pre className="text-slate-300 leading-tight">{` _________________________________
< ${(args.join(" ") || "moo").slice(0, 30).padEnd(30)} >
 ---------------------------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`}</pre>
        );
        break;
      case "status":
        push(<SystemStatus />);
        break;
      case "hire":
      case "hireavi":
        push(
          <div className="text-lime space-y-0.5">
            <p>✓ request received</p>
            <p>✓ qualification check: PASSED</p>
            <p>✓ vibe check: PASSED</p>
            <p className="text-amber mt-1">→ Send an email: <a href="mailto:avinashr289@gmail.com" className="underline">avinashr289@gmail.com</a></p>
          </div>
        );
        break;
      case "exit":
      case "quit":
        push(<span className="text-slate-400">There is no escape. You're already inside the portfolio.</span>);
        break;

      case "clear":
        setLines([]);
        return;
      default:
        sfxError();
        push(
          <span className="text-magenta">
            command not found: {name} — type <Cmd>help</Cmd>
          </span>
        );
        return;
    }
    sfxEnter();
  }

  return (
    <div
      className="flex h-full flex-col bg-[#070a10] font-mono text-[15px] leading-relaxed"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={bodyRef} className="min-h-0 flex-1 space-y-1 overflow-auto p-3">
        {lines.map((l, i) => (
          <div key={i} className="flex gap-2">
            {l.prompt && <span className="shrink-0 text-lime">{l.prompt}</span>}
            <div className="min-w-0 break-words">{l.node}</div>
          </div>
        ))}
        {/* live input line */}
        <div className="flex gap-2">
          <span className="shrink-0 text-lime">{PROMPT}</span>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                sfxKey();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  run(input);
                  setInput("");
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  if (!history.length) return;
                  const ni = hIdx < 0 ? history.length - 1 : Math.max(0, hIdx - 1);
                  setHIdx(ni);
                  setInput(history[ni]);
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  if (hIdx < 0) return;
                  const ni = hIdx + 1;
                  if (ni >= history.length) {
                    setHIdx(-1);
                    setInput("");
                  } else {
                    setHIdx(ni);
                    setInput(history[ni]);
                  }
                }
              }}
              className="w-full bg-transparent text-slate-100 caret-neon outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Cmd({ children }: { children: ReactNode }) {
  return <span className="rounded bg-white/10 px-1 text-neon">{children}</span>;
}

function showRole(arg: string, push: (n: ReactNode) => void) {
  const q =
    quests.find((x) => x.company.toLowerCase().includes(arg)) ??
    quests[Number(arg) - 1];
  if (!q) {
    sfxError();
    push(<span className="text-magenta">experience: no match for '{arg}'. Try <span className="text-neon">experience</span> to list.</span>);
    return;
  }
  push(
    <div>
      <p className="text-white">
        {q.role} <span className="text-amber">@ {q.company}</span>{" "}
        <span className="text-slate-500">({q.dates})</span>
      </p>
      <ul className="mt-1 space-y-1 text-slate-300">
        {q.bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-neon">▸</span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function catFile(arg: string, push: (n: ReactNode) => void) {
  const f = arg.replace(/^\.?\//, "");
  if (f === "experience.md" || f === "experience") {
    push(<ExpListOut />);
  } else if (f === "skills.txt" || f === "skills") {
    push(<SkillsOut />);
  } else if (f === "readme.md" || f === "readme" || f === "about.md") {
    push(<WhoamiOut />);
  } else if (f === "projects" || f === "projects.md") {
    push(<ProjListOut />);
  } else {
    sfxError();
    push(<span className="text-magenta">cat: {arg || "?"}: No such file. Try: readme.md, experience.md, skills.txt</span>);
  }
}

function HelpOut() {
  const serious: [string, string][] = [
    ["whoami", "who is Avinash"],
    ["skills", "the tech kit (no bars, promise)"],
    ["experience [n|name]", "e.g. experience kgen"],
    ["projects", "flagship systems"],
    ["resume", "open the actual PDF"],
    ["contact", "email / phone / links"],
    ["gallery", "off-duty: anime · games · food"],
    ["open <app>", "launch a window"],
    ["neofetch", "system info, the fun way"],
    ["clear", "clear the screen"],
  ];
  const fun: [string, string][] = [
    ["coffee / chai", "restore caffeine levels"],
    ["git <blame|log|push>", "commit messages from hell"],
    ["npm install", "adds 847 packages instantly"],
    ["docker ps", "see what's actually running"],
    ["go run main.go", "gopher goes brrr"],
    ["hire", "apply for the role"],
    ["ping <host>", "it's not your network"],
    ["ssh prod", "please don't"],
    ["vim", "you might be stuck"],
    ["fortune", "dev wisdom"],
    ["status", "system health check"],
  ];
  return (
    <div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-0.5 sm:grid-cols-2">
        {serious.map(([c, d]) => (
          <div key={c} className="flex gap-2">
            <span className="w-44 shrink-0 text-neon">{c}</span>
            <span className="text-slate-400">{d}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10px] uppercase tracking-widest text-slate-600">fun commands</p>
      <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-0.5 sm:grid-cols-2">
        {fun.map(([c, d]) => (
          <div key={c} className="flex gap-2">
            <span className="w-44 shrink-0 text-amber/80">{c}</span>
            <span className="text-slate-500">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhoamiOut() {
  return (
    <div className="text-slate-300">
      <p className="text-white">{profile.name}</p>
      <p className="text-amber">{profile.title}</p>
      <p className="mt-1 max-w-prose text-slate-400">{profile.tagline}</p>
      <p className="mt-1 text-slate-500">{profile.classLabel} · {profile.location}</p>
    </div>
  );
}

function SkillsOut() {
  return (
    <div className="space-y-1">
      {skillGroups.map((g) => (
        <div key={g.group} className="flex flex-wrap gap-x-2">
          <span className="w-32 shrink-0 text-neon">{g.group}</span>
          <span className="text-slate-300">{g.skills.join(" · ")}</span>
        </div>
      ))}
    </div>
  );
}

function ExpListOut() {
  return (
    <div className="space-y-0.5">
      {quests.map((q, i) => (
        <div key={i} className="flex gap-2 text-slate-300">
          <span className="text-slate-500">{i + 1}.</span>
          <span className="text-white">{q.role}</span>
          <span className="text-amber">@ {q.company}</span>
          <span className="text-slate-500">{q.dates}</span>
        </div>
      ))}
      <p className="pt-1 text-slate-500">→ <span className="text-neon">experience kgen</span> for details, or <span className="text-neon">open experience</span>.</p>
    </div>
  );
}

function ProjListOut() {
  return (
    <div className="space-y-1">
      {projects.map((p) => (
        <div key={p.name} className="text-slate-300">
          <span className="text-lime">▣ {p.name}</span> <span className="text-slate-500">— {p.tag}</span>
        </div>
      ))}
      <p className="pt-1 text-slate-500">→ <span className="text-neon">open projects</span> to browse them.</p>
    </div>
  );
}

function LsOut({ arg }: { arg: string }) {
  if (arg.includes("project")) return <ProjListOut />;
  return (
    <div className="flex flex-wrap gap-x-4 text-slate-300">
      <span className="text-neon">readme.md</span>
      <span className="text-neon">experience.md</span>
      <span className="text-neon">skills.txt</span>
      <span className="text-lime">projects/</span>
      <span className="text-amber">resume.pdf</span>
      <span className="text-magenta">off-duty/</span>
    </div>
  );
}

function ContactOut() {
  return (
    <div className="space-y-0.5">
      <a className="block text-neon hover:underline" href={`mailto:${profile.email}`}>✉ {profile.email}</a>
      <span className="block text-slate-300">☎ {profile.phone}</span>
      <a className="block text-neon hover:underline" href={profile.github.url} target="_blank" rel="noreferrer">⌥ {profile.github.label}</a>
      <a className="block text-neon hover:underline" href={profile.linkedin.url} target="_blank" rel="noreferrer">in {profile.linkedin.label}</a>
    </div>
  );
}

function GalleryOut() {
  return (
    <div className="space-y-1 text-slate-300">
      <p><span className="text-magenta">anime ✦</span> {inventory.anime.items[0]}</p>
      <p><span className="text-neon">games ◉</span> {inventory.games.items[0]}</p>
      <p><span className="text-amber">food ☕</span> {inventory.recipe.title} — {inventory.recipe.subtitle}</p>
      <p className="pt-1 text-slate-500">→ <span className="text-neon">offduty</span> opens the full gallery.</p>
    </div>
  );
}

function Neofetch() {
  return (
    <div className="flex gap-4">
      <pre className="text-neon/80 leading-tight">{`   .--.
  |o_o |
  |:_/ |
 //   \\ \\
(|     | )
/'\\_   _/'\\
\\___)=(___/`}</pre>
      <div className="text-slate-300">
        <p><span className="text-amber">avi</span>@<span className="text-amber">os</span></p>
        <p className="text-slate-500">-----------</p>
        <p><span className="text-neon">OS</span>: aviOS 3.0 (dev terminal)</p>
        <p><span className="text-neon">Role</span>: {profile.title}</p>
        <p><span className="text-neon">Uptime</span>: since 2018</p>
        <p><span className="text-neon">Shell</span>: zsh + caffeine</p>
        <p><span className="text-neon">Kernel</span>: Go · TypeScript · Distributed Systems</p>
        <p><span className="text-neon">Host</span>: White Martech (engage.kgen.io)</p>
      </div>
    </div>
  );
}

const FORTUNES = [
  "The best code is the code you don't have to write.",
  "It's not a bug — it's an undocumented feature.",
  "Works on my machine. Ship the machine.",
  "There are only two hard problems in CS: cache invalidation, naming, and off-by-one errors.",
  "Premature optimization is the root of all evil. Late optimization is a production incident.",
  "The cloud is just someone else's computer having a bad day.",
  "99 little bugs in the code. Take one down, patch it around. 127 little bugs in the code.",
  "Documentation is like a love letter you write to your future self.",
  "Any sufficiently complex Go service is indistinguishable from a blockchain.",
  "The first 90% of the code accounts for the first 90% of development time. The remaining 10% also accounts for 90% of the development time.",
];

function FortuneCookie() {
  const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
  return (
    <div className="border-l-2 border-amber/60 pl-3 text-slate-300 italic">
      "{fortune}"
    </div>
  );
}

function SystemStatus() {
  return (
    <div className="space-y-1 text-sm">
      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">aviOS system status</p>
      {[
        { label: "lazy-chain", status: "OPERATIONAL", color: "text-lime" },
        { label: "auth middleware", status: "OPERATIONAL", color: "text-lime" },
        { label: "inscription svc", status: "OPERATIONAL", color: "text-lime" },
        { label: "shield anti-fraud", status: "OPERATIONAL", color: "text-lime" },
        { label: "side projects", status: "DREAMING", color: "text-amber" },
        { label: "work-life balance", status: "DEGRADED", color: "text-magenta" },
        { label: "node_modules", status: "BLOATED", color: "text-magenta" },
        { label: "coffee supply", status: "CRITICAL", color: "text-magenta" },
      ].map(({ label, status, color }) => (
        <div key={label} className="flex gap-2">
          <span className="w-36 text-slate-400">{label}</span>
          <span className={color}>● {status}</span>
        </div>
      ))}
    </div>
  );
}
