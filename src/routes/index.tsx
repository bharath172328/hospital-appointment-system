import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Activity, Calendar, Shield, Stethoscope, Users, Clock, Star, CheckCircle2,
  Sparkles, ArrowRight, Quote, HeartPulse, Brain, Baby, Bone, Eye, Search,
  PhoneCall, ShieldCheck, BadgeCheck, Award,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DoctorCard } from "@/components/doctor-card";
import heroImg from "@/assets/hero-doctor.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediCare — Book trusted doctors online" },
      { name: "description", content: "Find verified specialists, book appointments instantly, and manage your healthcare with confidence — all in one calm, modern place." },
    ],
  }),
  component: HomePage,
});

const SPECIALTIES = [
  { name: "Cardiologist", icon: HeartPulse, tint: "from-rose-500/10 to-rose-500/0", color: "text-rose-500" },
  { name: "Dermatologist", icon: Shield, tint: "from-amber-500/10 to-amber-500/0", color: "text-amber-500" },
  { name: "Pediatrician", icon: Baby, tint: "from-sky-500/10 to-sky-500/0", color: "text-sky-500" },
  { name: "Neurologist", icon: Brain, tint: "from-violet-500/10 to-violet-500/0", color: "text-violet-500" },
  { name: "Orthopedic Surgeon", icon: Bone, tint: "from-emerald-500/10 to-emerald-500/0", color: "text-emerald-500" },
  { name: "General Physician", icon: Stethoscope, tint: "from-primary/10 to-primary/0", color: "text-primary" },
];

const TESTIMONIALS = [
  { name: "Sarah Martinez", role: "Patient · New York", text: "Booked a cardiologist in under two minutes. The whole experience felt premium and genuinely reassuring.", rating: 5 },
  { name: "James Kapoor", role: "Patient · London", text: "Finally a healthcare app that respects my time. The doctors are top-notch and the interface is a joy to use.", rating: 5 },
  { name: "Priya Reddy", role: "Patient · Singapore", text: "I manage my entire family's appointments in one beautifully clean dashboard. Couldn't recommend more.", rating: 5 },
];

const STEPS = [
  { n: "01", title: "Find your specialist", desc: "Search verified doctors by name, specialty, or live availability.", icon: Search },
  { n: "02", title: "Pick a perfect time", desc: "Choose a slot that fits your day — mornings, evenings or weekends.", icon: Calendar },
  { n: "03", title: "Get exceptional care", desc: "Consult, follow up, and track your full health history in one place.", icon: HeartPulse },
];

const TRUST_LOGOS = ["Mayo", "Cleveland", "Johns Hopkins", "Cedars-Sinai", "Mount Sinai", "Stanford Health"];

function HomePage() {
  const { data: doctors } = useQuery({
    queryKey: ["doctors", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("available", true)
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="overflow-hidden">
      {/* ─────────── HERO ─────────── */}
      <section className="relative">
        {/* Layered background */}
        <div className="absolute inset-0 -z-10 bg-gradient-soft" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_oklch(0.55_0.18_245/0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,_oklch(0.65_0.14_215/0.20),transparent_50%)]" />
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, oklch(0.55 0.18 245 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.55 0.18 245 / 0.06) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent 75%)",
          }}
        />

        <div className="container relative mx-auto grid gap-14 px-4 py-20 md:grid-cols-[1.05fr_1fr] md:items-center md:py-28">
          <div className="space-y-7 animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card/70 px-3.5 py-1.5 text-xs font-medium text-primary shadow-card backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Trusted by 15,000+ patients worldwide
            </span>

            <h1 className="text-[2.6rem] font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[3.75rem]">
              Healthcare that feels{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-hero bg-clip-text text-transparent">effortless</span>
                <span className="absolute inset-x-0 bottom-1 -z-0 h-3 rounded-full bg-primary/15 blur-sm" />
              </span>
              <br className="hidden sm:block" />
              right at your fingertips.
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Discover trusted specialists, book instantly, and manage your entire family's care — all from one calm, beautifully designed place.
            </p>

            {/* Quick search */}
            <form
              className="flex w-full max-w-xl items-center gap-2 rounded-2xl border border-border bg-card/80 p-2 shadow-card backdrop-blur"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex flex-1 items-center gap-2 px-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by specialty, doctor, or condition…"
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
              </div>
              <Button asChild className="rounded-xl">
                <Link to="/doctors">Search</Link>
              </Button>
            </form>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button size="lg" asChild className="group rounded-xl shadow-hover">
                <Link to="/book">
                  Book appointment
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-xl">
                <Link to="/doctors">Browse doctors</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-6 sm:grid-cols-4">
              {[
                { v: "100+", l: "Specialists" },
                { v: "15k+", l: "Happy patients" },
                { v: "4.9★", l: "Average rating" },
                { v: "24/7", l: "Live support" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-bold text-foreground">{s.v}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative animate-fade-in">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-hero opacity-25 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-hover">
              <img
                src={heroImg}
                alt="Friendly doctor ready to help patients"
                className="aspect-[4/5] w-full object-cover sm:aspect-[5/6]"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-foreground/40 to-transparent" />
            </div>

            {/* Floating cards */}
            <div className="absolute -left-4 top-10 hidden items-center gap-3 rounded-2xl border border-border bg-card/95 p-3 shadow-hover backdrop-blur animate-scale-in sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/15 text-success">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Appointment confirmed</p>
                <p className="text-sm font-semibold">Dr. Reyes · Tue 10:30 AM</p>
              </div>
            </div>
            <div className="absolute -bottom-4 right-2 hidden items-center gap-3 rounded-2xl border border-border bg-card/95 p-3 shadow-hover backdrop-blur animate-scale-in sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
                <Star className="h-5 w-5 fill-current" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Patient rating</p>
                <p className="text-sm font-semibold">4.9 / 5.0 · 2.4k reviews</p>
              </div>
            </div>
            <div className="absolute right-4 top-6 hidden rounded-2xl border border-border bg-card/95 p-3 shadow-hover backdrop-blur md:block">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-7 w-7 rounded-full border-2 border-card bg-primary-soft text-[10px] font-bold leading-[1.6rem] text-primary text-center">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-xs font-medium">+12k booked today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="border-y border-border/60 bg-card/40 backdrop-blur">
          <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/80">
            <span className="text-foreground/60">As trusted by</span>
            {TRUST_LOGOS.map((l) => (
              <span key={l} className="opacity-70 hover:opacity-100 transition">{l}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── HOW IT WORKS ─────────── */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">How it works</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Care in three calm steps</h2>
          <p className="mt-3 text-muted-foreground">From discovery to consultation in minutes — no calls, no waiting rooms.</p>
        </div>
        <div className="relative grid gap-6 md:grid-cols-3">
          <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-12 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent md:block" />
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.n} className="group relative rounded-3xl border border-border bg-card p-7 shadow-card transition-smooth hover:-translate-y-1 hover:border-primary/30 hover:shadow-hover">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-card">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-4xl font-bold text-primary/10">{s.n}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────── SPECIALTIES ─────────── */}
      <section className="bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Specialties</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Care for every need</h2>
              <p className="mt-2 text-muted-foreground">Browse 30+ specialties handled by world-class clinicians.</p>
            </div>
            <Button variant="ghost" asChild className="text-primary">
              <Link to="/doctors">View all specialties <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {SPECIALTIES.map(({ name, icon: Icon, tint, color }) => (
              <Link
                key={name}
                to="/doctors"
                search={{ specialty: name }}
                className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card p-6 text-center transition-smooth hover:-translate-y-1 hover:border-primary/40 hover:shadow-hover"
              >
                <div className={`absolute inset-0 -z-10 bg-gradient-to-b ${tint} opacity-0 transition group-hover:opacity-100`} />
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-card ring-1 ring-border ${color} transition-smooth group-hover:scale-110`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── FEATURED DOCTORS ─────────── */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Top rated</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Meet our featured specialists</h2>
            <p className="mt-2 text-muted-foreground">Hand-picked, board-certified doctors with consistent 5-star reviews.</p>
          </div>
          <Button variant="outline" asChild className="rounded-xl">
            <Link to="/doctors">View all doctors</Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {doctors?.map((d) => <DoctorCard key={d.id} doctor={d} />)}
        </div>
      </section>

      {/* ─────────── FEATURE SPLIT ─────────── */}
      <section className="container mx-auto px-4 py-20">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-card">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="relative hidden lg:block">
              <img src={heroImg} alt="Doctor consulting patient" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-primary/10 to-transparent" />
            </div>
            <div className="p-8 md:p-12">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Why MediCare</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Built on trust. Designed for calm.</h2>
              <p className="mt-3 text-muted-foreground">Every detail — from the way you search to how you're reminded — is crafted to make healthcare feel less stressful.</p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {[
                  { icon: BadgeCheck, t: "Verified credentials", d: "Each doctor is rigorously vetted and continuously reviewed." },
                  { icon: ShieldCheck, t: "Bank-grade privacy", d: "End-to-end encryption keeps your records yours alone." },
                  { icon: PhoneCall, t: "24/7 concierge", d: "Real humans available any time you need help." },
                  { icon: Award, t: "Best-in-class care", d: "Award-winning network of specialists across 30+ fields." },
                ].map(({ icon: Icon, t, d }) => (
                  <div key={t} className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{t}</h4>
                      <p className="mt-0.5 text-sm text-muted-foreground">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── TESTIMONIALS ─────────── */}
      <section className="bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Loved worldwide</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Patients say it best</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="relative rounded-3xl border border-border bg-card p-7 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-hover">
                <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/15" />
                <div className="flex gap-0.5 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-4 text-base leading-relaxed text-foreground">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-hero text-sm font-semibold text-primary-foreground">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── CTA ─────────── */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-hero p-10 text-center shadow-hover md:p-16">
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
              backgroundSize: "60px 60px, 90px 90px",
            }}
          />
          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Start in less than a minute
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl">
              Your next appointment is just a tap away.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/85">
              Join thousands of patients who've made MediCare their trusted health companion. Book your first visit today.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" variant="secondary" asChild className="rounded-xl">
                <Link to="/book">Book appointment</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-xl border-white/40 bg-white/10 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground">
                <Link to="/doctors">Meet our doctors</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-primary-foreground/80">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> No credit card required</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Cancel anytime</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> HIPAA compliant</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
