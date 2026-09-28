// Local, heuristic "AI Job Analysis" — no network call, no real model.
// Keyword/regex based extraction over the pasted job description text.

const SKILL_DICTIONARY = [
  "javascript",
  "typescript",
  "python",
  "java",
  "go",
  "rust",
  "sql",
  "react",
  "vue",
  "angular",
  "node.js",
  "node",
  "graphql",
  "rest api",
  "aws",
  "gcp",
  "azure",
  "docker",
  "kubernetes",
  "ci/cd",
  "figma",
  "product management",
  "project management",
  "agile",
  "scrum",
  "communication",
  "leadership",
  "data analysis",
  "machine learning",
  "sales",
  "seo",
  "copywriting",
  "excel",
];

const SENIOR_PATTERN = /\b(senior|sr\.?|staff|principal|lead|10\+? ?years|8\+? ?years)\b/i;
const JUNIOR_PATTERN = /\b(junior|jr\.?|entry.level|intern(ship)?|0-2 ?years|new grad)\b/i;
const MID_YEARS_PATTERN = /\b([2-5])\+?\s*(-|to)?\s*(\d+)?\s*years?\b/i;

const RED_FLAG_PHRASES: { pattern: RegExp; label: string; note: string }[] = [
  {
    pattern: /fast[- ]paced/i,
    label: `"Fast-paced environment"`,
    note: "Can be genuine energy — or a hint that workload management is loose. Ask about on-call/after-hours expectations.",
  },
  {
    pattern: /wear(ing)? many hats|jack of all trades/i,
    label: `"Wear many hats"`,
    note: "Often means the role scope is undefined. Ask what the first 90 days actually look like.",
  },
  {
    pattern: /unlimited pto/i,
    label: `"Unlimited PTO"`,
    note: "Ask what the average days-taken looks like — unlimited policies sometimes mean less time off in practice.",
  },
  {
    pattern: /rockstar|ninja|ninja|guru|ninja rockstar/i,
    label: `"Rockstar / ninja" language`,
    note: "Informal culture-signaling; not disqualifying, but worth reading the rest of the posting's tone carefully.",
  },
  {
    pattern: /competitive salary/i,
    label: `"Competitive salary" with no range`,
    note: "No posted range usually means it's worth asking for one before investing time in the process.",
  },
  {
    pattern: /work hard,? play hard/i,
    label: `"Work hard, play hard"`,
    note: "Sometimes shorthand for long hours framed as culture. Worth clarifying expected weekly hours.",
  },
  {
    pattern: /must be able to work under pressure/i,
    label: `"Must work well under pressure"`,
    note: "Could reflect a genuinely high-stakes role, or chronic understaffing. Ask for a concrete example.",
  },
];

export interface JobAnalysisResult {
  skills: string[];
  seniority: string;
  redFlags: { label: string; note: string }[];
  resumeBullets: string[];
}

export function analyzeJobDescription(description: string): JobAnalysisResult {
  const lower = description.toLowerCase();

  const skills = SKILL_DICTIONARY.filter((skill) => lower.includes(skill)).map(titleCaseSkill);

  let seniority = "Mid-level (estimated)";
  if (SENIOR_PATTERN.test(description)) {
    seniority = "Senior / Lead (estimated)";
  } else if (JUNIOR_PATTERN.test(description)) {
    seniority = "Junior / Entry-level (estimated)";
  } else {
    const yearsMatch = description.match(MID_YEARS_PATTERN);
    if (yearsMatch) seniority = `Mid-level, ~${yearsMatch[1]}+ years (estimated)`;
  }

  const redFlags = RED_FLAG_PHRASES.filter((f) => f.pattern.test(description)).map((f) => ({
    label: f.label,
    note: f.note,
  }));

  const topSkills = skills.slice(0, 3);
  const resumeBullets =
    topSkills.length > 0
      ? topSkills.map(
          (skill, i) =>
            `${["Delivered", "Led", "Drove"][i % 3]} measurable impact using **${skill}**, resulting in a quantifiable improvement to a key metric (add your number here).`,
        )
      : [
          "Delivered measurable impact on a core team metric within your first two quarters (add your number here).",
          "Partnered cross-functionally to ship a project end-to-end, ahead of schedule.",
          "Identified and resolved a recurring process gap, saving the team time each week.",
        ];

  return { skills, seniority, redFlags, resumeBullets };
}

function titleCaseSkill(skill: string): string {
  const specialCases: Record<string, string> = {
    "node.js": "Node.js",
    "ci/cd": "CI/CD",
    aws: "AWS",
    gcp: "GCP",
    seo: "SEO",
    sql: "SQL",
    "rest api": "REST APIs",
  };
  if (specialCases[skill]) return specialCases[skill];
  return skill.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function jobAnalysisToMarkdown(result: JobAnalysisResult): string {
  const skillsLine =
    result.skills.length > 0
      ? result.skills.map((s) => `- ${s}`).join("\n")
      : "- No specific tools detected — this posting reads as skills-agnostic; lean on transferable strengths.";

  const redFlagsLine =
    result.redFlags.length > 0
      ? result.redFlags.map((f) => `- **${f.label}** — ${f.note}`).join("\n")
      : "- No common red-flag phrases detected in this posting.";

  const bulletsLine = result.resumeBullets.map((b) => `- ${b}`).join("\n");

  return `Here's the breakdown of that posting:

**Required skills detected**
${skillsLine}

**Estimated seniority:** ${result.seniority}

**Things worth double-checking**
${redFlagsLine}

**Suggested resume bullets to adapt**
${bulletsLine}

This is a local, heuristic read of the text you pasted — always sanity-check against the full posting.`;
}
