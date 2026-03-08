import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BellRing,
  BrainCircuit,
  CheckCircle2,
  Crown,
  LineChart,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import BrandIcon from "@/components/brand/BrandIcon";

const signalCards = [
  {
    title: "Signal Quality Scoring",
    description:
      "Cortexa ranks demand, margin potential, competition pressure, and launch timing in one decision-ready score.",
    icon: Radar,
  },
  {
    title: "Live Market Alerts",
    description:
      "Catch rising product shifts, pricing gaps, and velocity spikes before slower teams react.",
    icon: BellRing,
  },
  {
    title: "AI Signal Guidance",
    description:
      "Every signal comes with a practical next move: launch, wait, reposition, bundle, or defend margin.",
    icon: BrainCircuit,
  },
];

const planCards = [
  {
    name: "Starter",
    price: "TRY 0",
    period: "/ month",
    description: "For testing the platform and validating early AI signal workflows.",
    cta: "Start Free",
    href: "/kayit",
    featured: false,
    items: [
      "20 AI signals per month",
      "Core dashboard access",
      "Basic signal monitoring",
      "Manual operations tracking",
    ],
  },
  {
    name: "Professional",
    price: "TRY 499",
    period: "/ month",
    description: "For teams that need stronger signals, more analysis volume, and professional execution support.",
    cta: "Choose Professional",
    href: "/kayit",
    featured: true,
    items: [
      "100 AI signals per month",
      "Advanced market and pricing signals",
      "Customer and KPI tracking",
      "Faster decision support workflows",
      "Best fit for growing operators",
    ],
  },
  {
    name: "Enterprise",
    price: "TRY 899",
    period: "/ month",
    description: "For high-volume sellers who want unlimited AI signal coverage and full control.",
    cta: "Go Enterprise",
    href: "/kayit",
    featured: false,
    items: [
      "Unlimited AI signals",
      "Trend and competitor intelligence",
      "Marketplace integration support",
      "Unlimited inventory monitoring",
      "Priority support access",
    ],
  },
];

const metrics = [
  { label: "Signal monitoring", value: "24/7" },
  { label: "Decision speed", value: "3x faster" },
  { label: "Signal layers", value: "12+" },
  { label: "Built for", value: "Professional teams" },
];

export default function TanitimPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(22,163,74,0.28),transparent_28%),radial-gradient(circle_at_top_right,rgba(5,150,105,0.22),transparent_24%),linear-gradient(135deg,#166534_0%,#15803d_22%,#14532d_48%,#052e16_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.2)_0%,rgba(2,6,23,0.76)_40%,#020617_100%)]" />

      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
            <div className="flex items-center gap-3">
              <BrandIcon variant="glass" />
              <div>
                <p className="text-lg font-black tracking-tight">Cortexa</p>
                <p className="text-xs uppercase tracking-[0.28em] text-emerald-200/80">
                  AI Signals Platform
                </p>
              </div>
            </div>

            <nav className="hidden items-center gap-6 text-sm font-medium text-white/70 md:flex">
              <a href="#signals" className="transition-colors hover:text-white">
                AI Signals
              </a>
              <a href="#pricing" className="transition-colors hover:text-white">
                Pricing
              </a>
              <a href="#overview" className="transition-colors hover:text-white">
                Overview
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/giris"
                className="hidden rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5 hover:text-white sm:inline-flex"
              >
                Sign In
              </Link>
              <Link
                href="/kayit"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-green-800 shadow-xl shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-50"
              >
                Start Free
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </header>

        <main>
          <section className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-100">
                <Sparkles size={14} />
                Premium AI intelligence for e-commerce operators
              </div>

              <h1 className="mt-6 text-5xl font-black leading-[1.02] tracking-tight text-white md:text-7xl">
                Dark-mode signal intelligence built for decisive teams.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50/80 md:text-xl">
                Cortexa turns raw marketplace movement into clear AI signals so you can spot demand shifts, pricing
                windows, and growth opportunities before the market catches up.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/kayit"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-bold text-green-800 transition-all hover:-translate-y-0.5 hover:bg-emerald-50"
                >
                  Create Account
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="#pricing"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-base font-semibold text-white/90 transition-colors hover:bg-white/10"
                >
                  See Subscription Plans
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {[
                  "Identify high-potential AI signals before categories get crowded",
                  "Translate demand and pricing movement into practical next steps",
                  "Combine market intelligence with operational visibility",
                  "Present a more professional product story with your own brand colors",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-4 backdrop-blur-sm"
                  >
                    <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-emerald-300" />
                    <p className="text-sm leading-6 text-white/78">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-8 top-10 h-32 w-32 rounded-full bg-green-400/20 blur-3xl" />
              <div className="absolute -right-6 bottom-12 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />

              <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-emerald-200">Signal Feed</p>
                    <p className="mt-1 text-sm font-semibold text-white/85">Cortexa live overview</p>
                  </div>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">
                    Active
                  </span>
                </div>

                <div className="mt-6 rounded-3xl border border-emerald-300/15 bg-gradient-to-br from-green-600/20 via-emerald-700/10 to-transparent p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-emerald-200">High-priority signal</p>
                      <h2 className="mt-2 text-2xl font-black">Momentum spike detected</h2>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3 text-emerald-200">
                      <LineChart size={22} />
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-white/72">
                    Demand is accelerating while pricing pressure remains manageable. Cortexa flags this as a strong
                    execution window for early positioning.
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <MiniStat label="Signal score" value="91/100" icon={<Target size={15} />} />
                  <MiniStat label="Pricing fit" value="High" icon={<BarChart3 size={15} />} />
                  <MiniStat label="Action window" value="48 hrs" icon={<Zap size={15} />} />
                </div>

                <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-2 text-emerald-200">
                    <BrainCircuit size={16} />
                    <p className="text-sm font-semibold">AI Recommendation</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/72">
                    Enter with premium positioning, stay above the category median, and deploy inventory during the
                    next two-day growth window.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="overview" className="border-y border-white/10 bg-black/15 backdrop-blur-sm">
            <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-5">
                  <p className="text-3xl font-black tracking-tight text-white">{metric.value}</p>
                  <p className="mt-1 text-sm text-emerald-50/65">{metric.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="signals" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-200">AI Signals</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
                The product story should feel sharp, dark, and premium.
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/72">
                This landing page now follows the same dark green gradient family used in the splash experience,
                while keeping the message focused on AI signals and subscription value.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {signalCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[30px] border border-white/10 bg-white/6 p-7 shadow-xl shadow-black/10 backdrop-blur-sm"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/25 to-emerald-500/15 text-emerald-200">
                    <card.icon size={24} />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-white">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/68">{card.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="pricing" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-200">Pricing</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
                Subscription plans, presented with the same dark premium tone.
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/72">
                Start free, upgrade to Professional for stronger AI signal coverage, or move to Enterprise for
                unlimited visibility and control.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {planCards.map((plan) => (
                <div
                  key={plan.name}
                  className={`flex h-full flex-col rounded-[32px] border p-8 backdrop-blur-sm ${
                    plan.featured
                      ? "border-emerald-300/40 bg-gradient-to-b from-green-600/25 via-emerald-800/20 to-white/6 shadow-2xl shadow-green-950/30"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-white">{plan.name}</p>
                    {plan.featured ? (
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-green-800">
                        Most Popular
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-5xl font-black tracking-tight text-white">{plan.price}</span>
                    <span className="pb-1 text-sm text-white/45">{plan.period}</span>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-white/70">{plan.description}</p>

                  <div className="mt-6 space-y-3">
                    {plan.items.map((item) => (
                      <div key={item} className="flex items-start gap-3 text-sm text-white/80">
                        <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-emerald-300" />
                        <span className="leading-6">{item}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={plan.href}
                    className={`mt-8 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all ${
                      plan.featured
                        ? "bg-white text-green-800 hover:-translate-y-0.5 hover:bg-emerald-50"
                        : "border border-white/10 bg-white/8 text-white hover:-translate-y-0.5 hover:bg-white/12"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
            <div className="grid gap-4 lg:grid-cols-3">
              <DarkFeatureCard
                icon={<ShieldCheck size={18} />}
                title="Credible visual direction"
                description="The page now matches the darker splash palette instead of a bright white landing treatment."
              />
              <DarkFeatureCard
                icon={<BellRing size={18} />}
                title="AI signals stay central"
                description="Messaging remains focused on intelligence, alerts, timing, and execution recommendations."
              />
              <DarkFeatureCard
                icon={<Crown size={18} />}
                title="Pricing is easier to sell"
                description="Plans are shown in a more premium frame so the subscription section feels more valuable."
              />
            </div>
          </section>

          <section className="px-6 pb-20 pt-14 lg:px-8">
            <div className="mx-auto max-w-7xl overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 p-10 text-white shadow-2xl shadow-black/30 md:p-14">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/80">Launch with Cortexa</p>
              <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <h2 className="text-4xl font-black tracking-tight md:text-5xl">
                    Keep the page dark. Keep the message sharp.
                  </h2>
                  <p className="mt-4 text-lg leading-8 text-emerald-50/90">
                    Cortexa gives your brand a cleaner premium presence while clearly explaining AI signals and
                    subscription value in English.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/kayit"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-green-800 transition-all hover:-translate-y-0.5 hover:bg-emerald-50"
                  >
                    Get Started
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/giris"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/25 px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2 text-emerald-200">
        {icon}
        <span className="text-[11px] font-bold uppercase tracking-[0.18em]">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function DarkFeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-emerald-200">
        {icon}
      </div>
      <h3 className="mt-5 text-xl font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-white/68">{description}</p>
    </div>
  );
}
