
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, FileText, ExternalLink, Globe, MapPin } from "lucide-react";

const GITHUB_USERNAME = "khantimmy27";
const CONTACT_EMAIL = "taimoor.qureshi@ucsf.edu";
const CONTACT_LINKEDIN = "https://www.linkedin.com/in/taimoor-qureshi/";
const CONTACT_LOCATION = "San Francisco, CA";

const PREFERRED_REPOS: string[] = [];

const resumeData = {
  name: "Taimoor Qureshi",
  title: "Data Scientist · Health Data Science · Bayesian Clinical Trials",
  summary:
    "I build practical, human-centered analytics for healthcare—Bayesian decision-making, clinical NLP, and dashboards that move the needle. I like clean models, clear visuals, and results that actually change operations.",
  highlights: [
    "UCSF capstone: Bayesian framework identified ineffective TB regimens ~10 months earlier",
    "3,500+ MCMC simulations translated into Go/No‑Go rules and projected $2–4.5M savings per Phase IIb study",
    "GPT‑4–assisted extraction from 10k+ EHR notes; higher recall vs rule‑based labels",
  ],
  experience: [
    {
      company: "UCSF — Health Data Science",
      role: "Data Scientist (Capstone Project)",
      period: "Oct 2024 – Present",
      bullets: [
        "Modeled TB clinical trial data with Bayesian methods to spot ineffective treatments ~10 months earlier, improving trial efficiency and patient safety.",
        "Translated posterior (MCMC) outputs into decision rules guiding Go/No‑Go; projected $2–4.5M savings per Phase IIb study.",
        "Validated performance across 3,500 sims using rankings, thresholds, and control comparisons; presented at JSM; first‑authored manuscript in progress.",
      ],
      links: [],
    },
    {
      company: "Roche",
      role: "Data Science & Ops Intern",
      period: "Jun 2024 – Sep 2024",
      bullets: [
        "Queried clinical trial data with SQL and built Python ETL to aggregate delays across 100+ studies.",
        "Created interactive Plotly dashboards by document type to surface bottlenecks and drive process improvements.",
        "Built Excel‑based statistical sampling tool to flag audit risks, reducing prep time by >70%.",
        "Designed 12 KPIs for lifecycle phases; adopted by 3 Clinical Operations teams.",
      ],
      links: [],
    },
    {
      company: "Bakar Computational Health Sciences Institute (UCSF)",
      role: "Research Assistant",
      period: "Nov 2023 – May 2024",
      bullets: [
        "Built a Python rule‑based labeling program to classify Crohn’s vs colitis in 10,000+ EHR notes (gold‑standard set).",
        "Used GPT‑4 zero/few‑shot prompting to extract structured diagnoses; achieved higher recall (91%) with comparable accuracy (87%) and precision (84%).",
      ],
      links: [],
    },
    {
      company: "UCSF",
      role: "Data Analytics Intern",
      period: "Mar 2023 – Jul 2023",
      bullets: [
        "Regression analysis to compare freezer performance; identified efficiency gaps and >$6,000 projected annual savings.",
        "Built a weekly Tableau dashboard tracking freezer KPIs; drove ~15% supply chain cost savings via real‑time monitoring.",
        "Presented recommendations with actionable metrics to lab leadership.",
      ],
      links: [],
    },
  ],
  projects: [
    {
      name: "Too Long; Don’t Wait (tl;dw)",
      details: [
        "Led a 3‑person team to ship an ER wait‑time prediction app in 5 days; 2nd place + $3,000 prize at Health Universe Hackathon.",
        "Built a real‑time ER queue tracker for ambulance routing and hospital transparency.",
      ],
    },
  ],
  education: [
    {
      school: "University of California, San Francisco",
      degree: "M.S., Health Data Science (Biostatistics)",
      period: "Jul 2023 – Jun 2025",
      details: [
        "GPA: 3.83/4.00; ML in R, Causal Inference, Biostat I–IV, Math for ML, Epidemiology",
      ],
    },
    {
      school: "University of California, Davis",
      degree: "B.S., Psychology (Pre‑Medicine)",
      period: "Sep 2019 – Jun 2022",
      details: ["GPA: 3.71/4.00"],
    },
  ],
  skills: [
    "Python, R, SQL",
    "pandas, numpy, scikit‑learn, PyTorch",
    "tidyverse, brms",
    "Tableau, Power BI, Plotly, Dash, ggplot2, Shiny",
    "PostgreSQL, BigQuery, MS SQL Server",
    "Bayesian modeling, Causal inference, NLP/LLMs",
  ],
  publications: [],
  speaking: [],
};

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-24 py-14">
    <motion.h2
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="text-2xl md:text-3xl font-semibold tracking-tight"
    >
      {title}
    </motion.h2>
    <div className="mt-6">{children}</div>
  </section>
);

function useGithubRepos(username: string) {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError(null);

    fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        const data = await r.json();
        const filtered = data
          .filter((repo: any) => !repo.fork && !repo.archived)
          .map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            desc: repo.description,
            url: repo.html_url,
            homepage: repo.homepage,
            stars: repo.stargazers_count,
            language: repo.language,
            updated: repo.updated_at,
          }));

        let selected = filtered;
        if (PREFERRED_REPOS.length) {
          selected = filtered.filter((r: any) => PREFERRED_REPOS.includes(r.name));
        }

        selected.sort((a: any, b: any) => b.stars - a.stars || new Date(b.updated).getTime() - new Date(a.updated).getTime());
        setRepos(selected.slice(0, 8));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [username]);

  return { repos, loading, error };
}

export default function Page() {
  const [theme, setTheme] = useState<"light" | "dark">(
    typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  );
  const [username, setUsername] = useState(GITHUB_USERNAME);
  const { repos, loading, error } = useGithubRepos(username);

  useEffect(() => {
    if (!window?.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const nav = [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "pubs", label: "Publications" },
    { id: "speaking", label: "Speaking" },
    { id: "contact", label: "Contact" },
  ];

  const initials = useMemo(() => {
    return resumeData.name
      .split(" ")
      .map((p) => p[0])
      .join("");
  }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-neutral-900/70 border-b border-neutral-200/60 dark:border-neutral-800/60">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 grid place-items-center font-bold">
              {initials}
            </div>
            <div className="leading-tight">
              <div className="font-semibold">{resumeData.name}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">{resumeData.title}</div>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="hover:opacity-80">
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href={`mailto:${CONTACT_EMAIL}`} className="p-2 hover:opacity-80" aria-label="Email">
              <Mail size={18} />
            </a>
            <a href={`https://github.com/${username || GITHUB_USERNAME}`} target="_blank" rel="noreferrer" className="p-2 hover:opacity-80" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href={CONTACT_LINKEDIN} target="_blank" rel="noreferrer" className="p-2 hover:opacity-80" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <button
              className="ml-2 rounded-xl border border-neutral-300 dark:border-neutral-700 px-3 py-1 text-xs"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </header>

      <section id="home" className="mx-auto max-w-6xl px-4 pt-12 pb-6">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="md:col-span-2">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">{resumeData.title}</h1>
            <p className="mt-4 text-neutral-600 dark:text-neutral-300 max-w-2xl">{resumeData.summary}</p>
            {CONTACT_LOCATION && (
              <div className="mt-3 inline-flex items-center gap-2 text-sm text-neutral-500"><MapPin size={16} /> {CONTACT_LOCATION}</div>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="rounded-2xl px-5 py-2 border border-neutral-300 dark:border-neutral-700 hover:shadow"
              >
                View Projects
              </a>
              <a
                href="/resume.pdf"
                className="rounded-2xl px-5 py-2 border border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 inline-flex items-center gap-2"
              >
                <FileText size={16} /> Resume
              </a>
            </div>

            <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
              {resumeData.highlights.map((h, i) => (
                <li key={i} className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-3">{h}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="md:col-span-1">
            <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 p-4">
              <div className="text-sm font-medium">GitHub Preview</div>
              <div className="mt-3 text-xs text-neutral-500">Connect your GitHub username to auto-load repos.</div>
              <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const input = form.elements.namedItem("gh") as HTMLInputElement;
                  if (input?.value) {
                    // simple validation
                  }
                  setUsername(input.value.trim());
                }}
              >
                <input name="gh" defaultValue={username} placeholder="github username" className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm" />
                <button className="rounded-xl border border-neutral-300 dark:border-neutral-700 px-3 text-sm">Save</button>
              </form>
              <div className="mt-4 text-xs text-neutral-500 inline-flex items-center gap-2"><Globe size={14} /> Public-only; no token required.</div>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4">
        <Section id="about" title="About">
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            I care about building rigorous, human-centered analytics that translate to better clinical decisions and healthier systems. I enjoy Bayesian methods, pragmatic ML, and clear storytelling.
          </p>
        </Section>

        <Section id="experience" title="Experience">
          <div className="space-y-6">
            {resumeData.experience.map((exp, i) => (
              <div key={i} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <div className="text-lg font-semibold">{exp.role}</div>
                    <div className="text-neutral-500">{exp.company}</div>
                  </div>
                  <div className="text-sm text-neutral-500">{exp.period}</div>
                </div>
                <ul className="mt-3 list-disc pl-5 text-sm space-y-2">
                  {exp.bullets.map((b: string, j: number) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
                {exp.links?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {exp.links.map((l: any, k: number) => (
                      <a key={k} className="text-sm inline-flex items-center gap-1 underline" href={l.href} target="_blank" rel="noreferrer">
                        {l.label} <ExternalLink size={14} />
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </Section>

        <Section id="projects" title="Projects">
          {loading && <div className="text-sm text-neutral-500">Loading repos…</div>}
          {error && <div className="text-sm text-red-500">GitHub error: {error}</div>}
          {!loading && !error && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {repos.map((r) => (
                <motion.a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-medium group-hover:underline">{r.name}</div>
                    <div className="text-xs text-neutral-500">★ {r.stars}</div>
                  </div>
                  <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3 min-h-[3.5rem]">
                    {r.desc || "No description provided."}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                    {r.language && <span>{r.language}</span>}
                    <span>Updated {new Date(r.updated).toLocaleDateString()}</span>
                    {r.homepage && (
                      <a className="inline-flex items-center gap-1 underline" href={r.homepage} onClick={(e) => e.stopPropagation()} target="_blank" rel="noreferrer">
                        Demo <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          )}
          {!loading && !error && repos.length === 0 && (
            <div className="text-sm text-neutral-500">No public repositories found. Double‑check your username or add repos.</div>
          )}
        </Section>

        <Section id="education" title="Education">
          <div className="grid md:grid-cols-2 gap-5">
            {resumeData.education.map((ed: any, i: number) => (
              <div key={i} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5">
                <div className="text-lg font-semibold">{ed.degree}</div>
                <div className="text-neutral-500">{ed.school}</div>
                <div className="text-sm text-neutral-500">{ed.period}</div>
                {ed.details?.length ? (
                  <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
                    {ed.details.map((d: string, j: number) => (
                      <li key={j}>{d}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </Section>

        <Section id="skills" title="Skills">
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((s: string, i: number) => (
              <span key={i} className="rounded-xl border border-neutral-300 dark:border-neutral-700 px-3 py-1 text-sm">
                {s}
              </span>
            ))}
          </div>
        </Section>

        <Section id="pubs" title="Publications">
          {resumeData.publications.length ? (
            <ul className="space-y-3">
              {resumeData.publications.map((p: any, i: number) => (
                <li key={i} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-neutral-500">{p.venue} • {p.year}</div>
                  {p.link && (
                    <a className="text-sm inline-flex items-center gap-1 underline mt-1" href={p.link} target="_blank" rel="noreferrer">
                      View <ExternalLink size={14} />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-neutral-500">Add publications in the resumeData above.</div>
          )}
        </Section>

        <Section id="speaking" title="Speaking">
          {resumeData.speaking.length ? (
            <ul className="space-y-3">
              {resumeData.speaking.map((p: any, i: number) => (
                <li key={i} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-neutral-500">{p.venue} • {p.year}</div>
                  {p.link && (
                    <a className="text-sm inline-flex items-center gap-1 underline mt-1" href={p.link} target="_blank" rel="noreferrer">
                      View <ExternalLink size={14} />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-neutral-500">Add talks in the resumeData above.</div>
          )}
        </Section>

        <Section id="contact" title="Contact">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 underline">
                <Mail size={16} /> {CONTACT_EMAIL}
              </a>
              <a href={`https://github.com/${username || GITHUB_USERNAME}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 underline">
                <Github size={16} /> github.com/{username || GITHUB_USERNAME}
              </a>
              <a href={CONTACT_LINKEDIN} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 underline">
                <Linkedin size={16} /> LinkedIn
              </a>
            </div>
          </div>
        </Section>
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-neutral-500 flex items-center justify-between">
          <div>© {new Date().getFullYear()} {resumeData.name}. All rights reserved.</div>
          <div className="flex items-center gap-3">
            <a href="#home" className="underline">Back to top</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
