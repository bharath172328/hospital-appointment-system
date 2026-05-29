import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  CalendarIcon,
  Clock,
  Stethoscope,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  User as UserIcon,
  Award,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/book")({
  validateSearch: (s: Record<string, unknown>) => ({
    doctor: typeof s.doctor === "string" ? s.doctor : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Book an appointment — MediCare" },
      {
        name: "description",
        content:
          "Book an appointment with a trusted doctor in three simple steps — choose specialist, date, and time.",
      },
    ],
  }),
  component: BookPage,
});

const TIMES = {
  Morning: ["09:00", "10:00", "11:00", "12:00"],
  Afternoon: ["14:00", "15:00", "16:00", "17:00"],
};

const STEPS = [
  { id: 1, label: "Doctor", icon: Stethoscope },
  { id: 2, label: "Schedule", icon: CalendarIcon },
  { id: 3, label: "Confirm", icon: CheckCircle2 },
];

function BookPage() {
  const { user } = useAuth();
  const router = useRouter();
  const search = Route.useSearch();

  const [step, setStep] = useState(1);
  const [specialization, setSpecialization] = useState<string>("all");
  const [doctorId, setDoctorId] = useState<string>(search.doctor ?? "");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["doctors-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("available", true)
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const specializations = useMemo(
    () => Array.from(new Set(doctors.map((d) => d.specialization))).sort(),
    [doctors],
  );

  const filteredDoctors = useMemo(
    () =>
      specialization === "all"
        ? doctors
        : doctors.filter((d) => d.specialization === specialization),
    [doctors, specialization],
  );

  const selectedDoctor = doctors.find((d) => d.id === doctorId);

  const canNext = step === 1 ? !!doctorId : step === 2 ? !!date && !!time : true;

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to book an appointment");
      router.navigate({ to: "/login" });
      return;
    }
    if (!doctorId || !date || !time) {
      toast.error("Please complete every step");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("appointments").insert({
      patient_id: user.id,
      doctor_id: doctorId,
      appointment_date: format(date, "yyyy-MM-dd"),
      appointment_time: time,
      notes: notes || null,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Appointment booked!");
    router.navigate({ to: "/my-appointments" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-soft/40 via-background to-background">
      {/* Hero */}
      <div className="border-b border-border/60 bg-card/50 backdrop-blur">
        <div className="container mx-auto max-w-5xl px-4 py-10 sm:py-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Easy 3-step booking
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Book your appointment
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Find the right specialist, choose a time that fits your schedule, and we'll
            confirm your visit instantly.
          </p>

          {/* Stepper */}
          <ol className="mt-8 flex items-center gap-2 sm:gap-4">
            {STEPS.map((s, i) => {
              const active = step === s.id;
              const done = step > s.id;
              const Icon = s.icon;
              return (
                <li key={s.id} className="flex flex-1 items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-smooth",
                        done && "border-success bg-success text-white",
                        active && "border-primary bg-primary text-primary-foreground shadow-card",
                        !done && !active && "border-border bg-card text-muted-foreground",
                      )}
                    >
                      {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span
                      className={cn(
                        "hidden text-sm font-medium sm:inline",
                        active ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="h-px flex-1 bg-border" />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Main grid */}
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Step panel */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">Choose your doctor</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Filter by specialization, then pick from our available specialists.
                  </p>
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-medium">Specialization</Label>
                  <Select
                    value={specialization}
                    onValueChange={(v) => {
                      setSpecialization(v);
                      setDoctorId("");
                    }}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="All specializations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All specializations</SelectItem>
                      {specializations.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    Available doctors{" "}
                    <span className="text-muted-foreground">({filteredDoctors.length})</span>
                  </Label>
                  {isLoading ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
                      ))}
                    </div>
                  ) : filteredDoctors.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
                      No doctors available in this specialization
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {filteredDoctors.map((d) => {
                        const selected = doctorId === d.id;
                        return (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setDoctorId(d.id)}
                            className={cn(
                              "group flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-smooth",
                              selected
                                ? "border-primary bg-primary-soft shadow-card"
                                : "border-border bg-background hover:border-primary/50 hover:bg-primary-soft/30",
                            )}
                          >
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-primary-soft">
                              {d.image_url ? (
                                <img
                                  src={d.image_url}
                                  alt={d.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center font-semibold text-primary">
                                  {d.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-semibold">{d.name}</div>
                              <div className="truncate text-xs text-muted-foreground">
                                {d.specialization}
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-xs">
                                <span className="inline-flex items-center gap-1 text-muted-foreground">
                                  <Award className="h-3 w-3" />
                                  {d.experience_years}y
                                </span>
                                <span className="font-semibold text-primary">${d.fee}</span>
                              </div>
                            </div>
                            {selected && (
                              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">Pick a date & time</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose a slot that works best for you.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label className="mb-2 block text-sm font-medium">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-11 w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                          className={cn("pointer-events-auto p-3")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm font-medium">Time</Label>
                    <div className="space-y-3">
                      {Object.entries(TIMES).map(([label, slots]) => (
                        <div key={label}>
                          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <Clock className="h-3 w-3" /> {label}
                          </div>
                          <div className="grid grid-cols-4 gap-1.5">
                            {slots.map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setTime(t)}
                                className={cn(
                                  "rounded-md border px-2 py-2 text-xs font-medium transition-smooth",
                                  time === t
                                    ? "border-primary bg-primary text-primary-foreground shadow-card"
                                    : "border-border bg-background hover:border-primary",
                                )}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="mb-2 block text-sm font-medium">
                    Notes for the doctor{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Briefly describe your symptoms or reason for visit..."
                    rows={4}
                    maxLength={500}
                  />
                  <div className="mt-1 text-right text-xs text-muted-foreground">
                    {notes.length}/500
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">Review & confirm</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Double-check the details below before confirming.
                  </p>
                </div>

                <dl className="divide-y divide-border rounded-xl border border-border bg-background">
                  <Row label="Doctor" value={selectedDoctor?.name ?? "—"} />
                  <Row
                    label="Specialization"
                    value={selectedDoctor?.specialization ?? "—"}
                  />
                  <Row
                    label="Date"
                    value={date ? format(date, "EEEE, MMMM d, yyyy") : "—"}
                  />
                  <Row label="Time" value={time || "—"} />
                  <Row
                    label="Consultation fee"
                    value={selectedDoctor ? `$${selectedDoctor.fee}` : "—"}
                    accent
                  />
                </dl>

                {notes && (
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <div className="mb-1 text-xs font-medium text-muted-foreground">
                      Your notes
                    </div>
                    <p className="text-sm">{notes}</p>
                  </div>
                )}

                {!user && (
                  <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm">
                    You'll need to{" "}
                    <Link to="/login" className="font-medium text-primary hover:underline">
                      sign in
                    </Link>{" "}
                    to confirm this appointment.
                  </div>
                )}
              </div>
            )}

            {/* Nav */}
            <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              {step < 3 ? (
                <Button
                  type="button"
                  size="lg"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canNext}
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Booking..." : "Confirm appointment"}
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar summary */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Booking summary
              </div>
              {selectedDoctor ? (
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-primary-soft">
                    {selectedDoctor.image_url ? (
                      <img
                        src={selectedDoctor.image_url}
                        alt={selectedDoctor.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-semibold text-primary">
                        {selectedDoctor.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{selectedDoctor.name}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {selectedDoctor.specialization}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <UserIcon className="h-4 w-4" /> No doctor selected
                </div>
              )}

              <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                <SummaryRow
                  label="Date"
                  value={date ? format(date, "MMM d, yyyy") : "—"}
                />
                <SummaryRow label="Time" value={time || "—"} />
                <SummaryRow
                  label="Fee"
                  value={selectedDoctor ? `$${selectedDoctor.fee}` : "—"}
                  bold
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-primary-soft/40 p-5">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div className="mt-2 text-sm font-semibold">Secure & flexible</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Free cancellation up to 24 hours before your appointment. Your information is
                always private.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "text-sm font-medium",
          accent && "text-base font-semibold text-primary",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn(bold && "font-semibold text-foreground")}>{value}</span>
    </div>
  );
}
