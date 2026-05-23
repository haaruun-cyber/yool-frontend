import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

const features = [
  { title: 'Notes', desc: 'Distraction-free writing with rich formatting.' },
  { title: 'Tasks', desc: 'Capture todos inside any document.' },
  { title: 'Journals', desc: 'Reflect with dated entries and prompts.' },
  { title: 'Templates', desc: 'Launch planners for study, travel, and budgets.' },
  { title: 'AI summaries', desc: 'Turn messy notes into crisp briefs.' },
  { title: 'Collaboration', desc: 'Share pages with read or edit access.' },
];

const faqs = [
  { q: 'Is there a free plan?', a: 'Yes — start with 5 active documents and core templates.' },
  { q: 'Can I use AI on the free plan?', a: 'AI features unlock on Pro and Team plans.' },
  { q: 'Do you support teams?', a: 'Team adds collaboration tooling on top of Pro.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">Y</span>
          Yool
        </div>
        <div className="flex gap-3 text-sm">
          <Link to="/login" className="text-ink-muted hover:text-ink">
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white shadow hover:bg-indigo-700"
          >
            Get started
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-200"
          >
            <Sparkles className="h-3 w-3" />
            Notion-inspired, student friendly
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl font-bold tracking-tight md:text-5xl"
          >
            A calmer workspace for notes, plans, and ideas.
          </motion.h1>
          <p className="mt-4 text-lg text-ink-muted">
            Lightweight like Todoist, flexible like Notion, and focused enough for coursework, client work, and side
            projects.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700"
            >
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 px-5 py-3 text-sm font-semibold hover:bg-surface-muted dark:border-slate-800"
            >
              View demo
            </Link>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-indigo-500/15 via-surface to-sky-500/10 p-6 shadow-2xl dark:border-slate-800"
        >
          <div className="rounded-2xl border border-slate-200/60 bg-surface/90 p-4 shadow-card dark:border-slate-800">
            <div className="mb-3 flex gap-2">
              <div className="h-2 w-2 rounded-full bg-red-400" />
              <div className="h-2 w-2 rounded-full bg-amber-400" />
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <div className="space-y-2 text-sm text-ink-muted">
              <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-900" />
              <div className="h-3 w-5/6 rounded bg-slate-100 dark:bg-slate-900" />
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-ink-muted">Product UI preview — connect your data in the app.</p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold">Everything you need</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-slate-200/80 bg-surface p-5 shadow-card dark:border-slate-800"
            >
              <Check className="mb-3 h-5 w-5 text-emerald-500" />
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold">Loved by focused builders</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { name: 'Amina K.', role: 'Grad student', quote: 'Finally a workspace that stays out of my way during finals.' },
            { name: 'Leo M.', role: 'Freelance PM', quote: 'Templates plus tasks in one place replaced three apps for me.' },
            { name: 'Sofia R.', role: 'Indie founder', quote: 'Dark mode and quick capture make this my daily driver.' },
          ].map((t) => (
            <div key={t.name} className="rounded-2xl border border-slate-200/80 bg-surface p-5 text-sm shadow-card dark:border-slate-800">
              <p className="text-ink-muted">“{t.quote}”</p>
              <p className="mt-4 font-semibold text-ink">{t.name}</p>
              <p className="text-xs text-ink-muted">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl border border-slate-200/80 bg-surface-muted/40 p-10 text-center dark:border-slate-800">
          <h2 className="text-2xl font-bold">Simple pricing</h2>
          <p className="mt-2 text-sm text-ink-muted">Free, Pro, and Team — upgrade when you are ready.</p>
          <Link to="/signup" className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white">
            Create account
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold">FAQ</h2>
        <div className="mt-8 space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border border-slate-200/80 bg-surface p-4 dark:border-slate-800">
              <p className="font-semibold">{f.q}</p>
              <p className="mt-2 text-sm text-ink-muted">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200/80 py-10 text-center text-xs text-ink-muted dark:border-slate-800">
        © {new Date().getFullYear()} Yool. Built for students, freelancers, and small teams.
      </footer>
    </div>
  );
}
