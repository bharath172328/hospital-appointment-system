import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Search, Sparkles, ShieldCheck, Users, Stethoscope } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DoctorCard } from "@/components/doctor-card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const searchSchema = z.object({
  specialty: z.string().optional(),
});

export const Route = createFileRoute("/doctors")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Find doctors — MediCare" },
      { name: "description", content: "Browse our network of verified specialists and book an appointment in minutes." },
    ],
  }),
  component: DoctorsPage,
});

const SPECIALTIES = ["All", "Cardiologist", "Dermatologist", "Pediatrician", "Neurologist", "Orthopedic Surgeon", "General Physician"];

function DoctorsPage() {
  const { specialty: initialSpecialty } = Route.useSearch();
  const [active, setActive] = useState(initialSpecialty ?? "All");
  const [search, setSearch] = useState("");

  const { data: doctors, isLoading } = useQuery({
    queryKey: ["doctors", active, search],
    queryFn: async () => {
      let q = supabase.from("doctors").select("*").order("name");
      if (active !== "All") q = q.eq("specialization", active);
      if (search) q = q.ilike("name", `%${search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-soft">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="container relative mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-card">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {doctors?.length ?? 0} verified specialists ready to help
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Find your <span className="bg-gradient-hero bg-clip-text text-transparent">trusted doctor</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Browse credentialed specialists across every major field. Filter by specialty, search by name, and book in under two minutes.
            </p>

            <div className="relative mx-auto mt-8 max-w-xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search doctors by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-14 rounded-full border-border bg-card pl-12 pr-4 text-base shadow-card focus-visible:ring-primary"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Specialty filter chips */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {SPECIALTIES.map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-smooth ${
                active === s
                  ? "border-primary bg-primary text-primary-foreground shadow-card"
                  : "border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : doctors && doctors.length > 0 ? (
          <div className="grid gap-6 animate-fade-in sm:grid-cols-2 lg:grid-cols-4">
            {doctors.map((d) => <DoctorCard key={d.id} doctor={d} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-card">
            <Stethoscope className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 font-medium">No doctors match your filters</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different specialty or clear your search.</p>
            <button onClick={() => { setActive("All"); setSearch(""); }} className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
              Clear filters
            </button>
          </div>
        )}

        {/* Trust strip */}
        <div className="mt-20 grid gap-6 rounded-3xl border border-border bg-gradient-soft p-8 shadow-card md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Verified credentials", desc: "Every doctor is licensed, vetted, and continuously reviewed." },
            { icon: Users, title: "15,000+ patients", desc: "Trusted by a growing community across the country." },
            { icon: Sparkles, title: "Instant booking", desc: "Confirm your appointment in under two minutes." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
