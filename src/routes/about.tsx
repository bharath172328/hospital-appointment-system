import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Shield, Users, Award, Sparkles, Target, Stethoscope, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — MediCare" },
      { name: "description", content: "Learn about MediCare's mission to make quality healthcare accessible to everyone." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-soft">
        <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-card">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Our story
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Healthcare made <span className="bg-gradient-hero bg-clip-text text-transparent">human again</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              We believe booking quality care should be as effortless as ordering a coffee. MediCare exists to give every person fast, transparent access to specialists they can trust.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-10">
        <div className="mx-auto grid max-w-5xl gap-4 rounded-3xl border border-border bg-card p-8 shadow-card md:grid-cols-4">
          {[
            { value: "15k+", label: "Patients served" },
            { value: "100+", label: "Verified specialists" },
            { value: "4.9★", label: "Average rating" },
            { value: "24/7", label: "Support" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission + Values */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">What we stand for</h2>
          <p className="mt-3 text-muted-foreground">Four principles that guide every decision we make.</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Heart, title: "Patient first", desc: "Every decision starts with how it helps the patient.", tint: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/30" },
            { icon: Shield, title: "Verified experts", desc: "All doctors are credentialed and continuously reviewed.", tint: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-950/30" },
            { icon: Users, title: "100+ specialists", desc: "Care across cardiology, dermatology, pediatrics and more.", tint: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/30" },
            { icon: Award, title: "Trusted by 15k+", desc: "Patients have booked appointments through MediCare.", tint: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
          ].map(({ icon: Icon, title, desc, tint, bg }) => (
            <div key={title} className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-hover">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg} ${tint}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission split */}
      <section className="container mx-auto px-4 pb-20">
        <div className="mx-auto grid max-w-6xl gap-10 rounded-3xl border border-border bg-gradient-soft p-10 shadow-card md:grid-cols-2 md:p-14">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight">Our mission</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              MediCare was born out of a simple frustration: booking a doctor shouldn't take longer than the appointment itself. We're building a platform that respects your time, your data, and your trust.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Transparent pricing — no surprises",
                "Real human support, 24/7",
                "Privacy-first by design",
                "Quality care, anywhere you are",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-center rounded-2xl border border-border bg-card p-8 shadow-card">
            <Stethoscope className="h-10 w-10 text-primary" />
            <blockquote className="mt-4 text-xl font-medium leading-relaxed">
              “The simplest way I've ever booked a specialist. From search to confirmation in under two minutes.”
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft font-semibold text-primary">SP</div>
              <div>
                <div className="text-sm font-semibold">Sarah P.</div>
                <div className="text-xs text-muted-foreground">MediCare patient since 2024</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-hero p-10 text-center text-primary-foreground shadow-hover md:p-14">
          <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <h2 className="relative text-3xl font-bold tracking-tight md:text-4xl">Ready to meet your next doctor?</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-primary-foreground/90">Browse our specialists and book a time that works for you.</p>
          <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="secondary"><Link to="/doctors">Find a doctor</Link></Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-primary-foreground hover:bg-white/10"><Link to="/contact">Talk to us</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
