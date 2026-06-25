// ──────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for all portfolio content.
// Edit this file to update the site — components read from here.
// Facts are pulled from /resumeBuilder/resume.html. Keep them accurate.
// ──────────────────────────────────────────────────────────────────────────

export const profile = {
  name: "Avinash R",
  title: "Backend Engineer",
  roleTags: ["SDE-3", "Backend Engineer", "Systems @ Scale", "Distributed Systems"],
  // Sleek descriptor (presentation only — not a resume fact)
  classLabel: "Distributed Systems · High-Scale Infra",
  tagline:
    "I build high-scale backend & on-chain systems — and refuel on anime, games, and good food.",
  location: "India",
  email: "avinashr289@gmail.com",
  phone: "+91 97915 46626",
  github: { label: "github.com/Avinashr289", url: "https://github.com/Avinashr289" },
  linkedin: { label: "linkedin.com/in/AvinashR", url: "https://linkedin.com/in/AvinashR" },
};

export const education = {
  school: "KCE Coimbatore",
  degree: "B.E. Computer Science and Engineering",
  years: "2015 – 2019",
};

// ── Skills — plain grouped lists. NO proficiency %, levels, or progress bars
//    (explicit user preference — never quantify skill). ──────────────────────
export type SkillGroup = { group: string; accent: AccentKey; skills: string[] };

export const skillGroups: SkillGroup[] = [
  {
    group: "Languages",
    accent: "neon",
    skills: ["Go", "TypeScript", "Node.js", "SQL", "NoSQL"],
  },
  {
    group: "Backend",
    accent: "amber",
    skills: ["FastAPI", "Ruby on Rails", "Laravel", "Redis", "DynamoDB"],
  },
  {
    group: "On-chain Systems",
    accent: "magenta",
    skills: ["EVM / Polygon", "Aptos / Move", "Web3.js"],
  },
  {
    group: "Frontend",
    accent: "violet",
    skills: ["ReactJS", "HTML / CSS", "jQuery"],
  },
  {
    group: "Cloud / DevOps",
    accent: "lime",
    skills: ["AWS", "GCP", "Docker", "Sentry", "Linux", "Git / GitHub"],
  },
];

// ── Experience as a "quest log" ────────────────────────────────────────────
export type Quest = {
  company: string;
  role: string;
  note?: string;
  dates: string;
  rank: string; // game-flavored rank label
  bullets: string[];
  achievements: string[]; // short badge-able metrics
};

export const quests: Quest[] = [
  {
    company: "White Martech Solutions",
    role: "SDE-3",
    note: "engage.kgen.io",
    dates: "Sep 2023 – Present",
    rank: "Current Deployment",
    bullets: [
      "Built Lazy Chain, a multi-chain abstraction layer delivering Web2-like UX for in-game currency, processing 1M+ transactions/day across 5 blockchains.",
      "Developed authentication middleware validating third-party game requests across 7 integrated titles — including Ludo, Zapak, Carrom, Hindustan Times, and Times Now — at the same scale.",
      "Built an on-chain inscription service recording in-game currency events as log inscriptions instead of ERC-20 transactions, cutting per-event gas cost ~60% (~25K vs ~65K gas) with real-time gas-price optimization across multichain routing.",
      "Hardened the platform for production scale with Redis distributed locks on balance mutations, balance-query optimizations, error categorization, and a DynamoDB-backed negative-balance detection pipeline — instrumented with Sentry and Slack observability.",
      "Engineered the custodial wallet & identity layer integrating AWS Cognito with Web3Auth — social logins (Google, Discord), encrypted private-key management, and custodian wallets across EVM and Aptos chains.",
      "Integrated a Shield anti-fraud system (webhooks, shieldId-based account blocking, session updates) with real-time Slack alerting to flag and block malicious users.",
    ],
    achievements: ["1M+ tx/day", "5 blockchains", "~60% gas saved", "7 titles integrated"],
  },
  {
    company: "BYJU'S",
    role: "Software Engineer",
    dates: "Dec 2021 – Sep 2023",
    rank: "Field Op",
    bullets: [
      "Designed a microservice generating monthly & annual progress reports from users' in-app activity and achievements.",
      "Integrated MoEngage, CleverTap, Zendesk, and AppsFlyer for unified data sync across the engagement and support stack.",
      "Built an AWS SNS notification system alerting relevant teams on user activity in real time, enabling swift cross-department action.",
      "Resolved production issues across North America and India regions with the support team, ensuring smooth operations and high customer satisfaction.",
    ],
    achievements: ["4 platforms synced", "Real-time alerts", "Multi-region ops"],
  },
  {
    company: "Magic Crate",
    role: "Software Engineer",
    dates: "May 2019 – Dec 2021",
    rank: "Field Op",
    bullets: [
      "Built an inventory forecasting system that cut unnecessary inventory spend by 30%.",
      "Developed REST APIs syncing lead data between the e-commerce site and CRM, enabling the support team to resolve customer issues faster.",
      "Created a responsive, cross-device quiz platform for children to answer activity-specific questions.",
      "Designed a lead-distribution algorithm allocating leads across 50+ BDAs monthly by lead score and individual conversion history.",
    ],
    achievements: ["30% spend cut", "50+ BDAs served"],
  },
  {
    company: "Magic Crate",
    role: "Software Engineer Intern",
    dates: "May 2018 – May 2019",
    rank: "Origin",
    bullets: [
      "Developed a CRM application in Laravel with a 3-person team, shipping to production in 4 months.",
      "Built a webhook system triggering Firebase to invoke an in-app call recorder; recordings stored in AWS S3 and surfaced to BDAs in the CRM for sales analysis.",
    ],
    achievements: ["Shipped in 4 months", "First production build"],
  },
];

// ── Flagship systems ───────────────────────────────────────────────────────
export type Project = {
  name: string;
  tag: string; // system-type label
  blurb: string;
  stack: string[];
  accent: AccentKey;
};

export const projects: Project[] = [
  {
    name: "Lazy Chain",
    tag: "Multi-chain Abstraction",
    blurb:
      "A multi-chain abstraction layer giving in-game currency a Web2-smooth UX. Processes 1M+ transactions/day across 5 blockchains.",
    stack: ["Go", "EVM", "Aptos", "Redis", "DynamoDB"],
    accent: "neon",
  },
  {
    name: "On-chain Inscription Service",
    tag: "Gas Optimization",
    blurb:
      "Records in-game currency events as log inscriptions instead of ERC-20 transfers, cutting per-event gas ~60% with real-time gas-price optimization across multichain routing.",
    stack: ["EVM", "Go", "Gas Optimization"],
    accent: "amber",
  },
  {
    name: "Custodial Wallet & Identity Layer",
    tag: "Identity & Key Management",
    blurb:
      "AWS Cognito + Web3Auth integration: social logins, encrypted private-key management, and custodian wallets across EVM and Aptos chains.",
    stack: ["AWS Cognito", "Web3Auth", "EVM", "Aptos"],
    accent: "violet",
  },
  {
    name: "Shield Anti-Fraud System",
    tag: "Fraud Defense",
    blurb:
      "Webhook-driven fraud defense with shieldId-based account blocking, session updates, and real-time Slack alerting to flag and block malicious users.",
    stack: ["Webhooks", "Slack API", "Node.js"],
    accent: "magenta",
  },
];

// ── Off-Duty — the anime + games + food personality section ────────────────
export const inventory = {
  // Anime
  anime: {
    label: "Anime",
    items: [
      "Drawn to long-form arcs and the slow build of a good story",
      "Equal parts the worldbuilding and the standout fight scenes",
      "Soundtracks on loop while shipping late",
    ],
  },
  // Games
  games: {
    label: "Games",
    items: [
      "Systems with deep mechanics — the same pull as a clean architecture",
      "A hard boss is just a problem with a pattern to learn",
      "Hidden input enabled: ↑ ↑ ↓ ↓ ← → ← → B A",
    ],
  },
  // Food — recipe card
  recipe: {
    title: "Dev Fuel",
    subtitle: "House recipe for shipping at scale",
    serves: "Serves: 1 engineer",
    cookTime: "Prep: one sprint",
    ingredients: [
      "Strong coffee, or chai",
      "Clean abstractions, folded in",
      "A generous handful of edge cases",
      "Good food, taken seriously",
    ],
    steps: [
      "Read the requirements twice. Open the editor.",
      "Cover the surface with tests.",
      "Let it rest through code review.",
      "Finish with observability. Ship.",
    ],
  },
};

export type AccentKey = "neon" | "magenta" | "amber" | "lime" | "violet";

export const accentHex: Record<AccentKey, string> = {
  neon: "#22d3ee",
  magenta: "#f472d0",
  amber: "#ffb347",
  lime: "#7CFFB2",
  violet: "#a78bfa",
};
