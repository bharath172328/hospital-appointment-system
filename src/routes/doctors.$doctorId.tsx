import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Calendar, Clock, DollarSign, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/doctors/$doctorId")({
  component: DoctorDetailPage,
});

const TIMES = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

function DoctorDetailPage() {
  const { doctorId } = Route.useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: doctor, isLoading } = useQuery({
    queryKey: ["doctor", doctorId],
    queryFn: async () => {
      const { data, error } = await supabase.from("doctors").select("*").eq("id", doctorId).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to book an appointment");
      router.navigate({ to: "/login" });
      return;
    }
    if (!date || !time) {
      toast.error("Please pick a date and time");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("appointments").insert({
      patient_id: user.id,
      doctor_id: doctorId,
      appointment_date: date,
      appointment_time: time,
      notes: notes || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Appointment booked!");
    router.navigate({ to: "/my-appointments" });
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12"><div className="h-96 animate-pulse rounded-2xl bg-muted" /></div>;
  }

  if (!doctor) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Doctor not found</p>
        <Link to="/doctors" className="mt-3 inline-block text-primary hover:underline">Back to doctors</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/doctors" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All doctors
      </Link>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Doctor info */}
        <div className="md:col-span-1">
          <div className="overflow-hidden rounded-2xl bg-card shadow-card">
            <div className="aspect-square bg-primary-soft">
              {doctor.image_url ? (
                <img src={doctor.image_url} alt={doctor.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl font-bold text-primary">
                  {doctor.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div>
            <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
              {doctor.specialization}
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">{doctor.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-warning text-warning" />
                {doctor.experience_years}+ years experience
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4" />
                ${doctor.fee} consultation
              </div>
              <div className={`flex items-center gap-1.5 ${doctor.available ? "text-success" : "text-muted-foreground"}`}>
                <span className={`h-2 w-2 rounded-full ${doctor.available ? "bg-success" : "bg-muted-foreground"}`} />
                {doctor.available ? "Available" : "Unavailable"}
              </div>
            </div>
          </div>

          {doctor.bio && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">About</h2>
              <p className="mt-2 text-foreground leading-relaxed">{doctor.bio}</p>
            </div>
          )}

          {/* Booking form */}
          <form onSubmit={handleBook} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-lg font-semibold">Book an appointment</h2>
            <p className="mt-1 text-sm text-muted-foreground">Pick a date and time that work for you</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="date" className="mb-1.5 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="mb-1.5 flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Time
                </Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {TIMES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTime(t)}
                      className={`rounded-md border px-2 py-1.5 text-xs font-medium transition-smooth ${
                        time === t
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:border-primary"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="notes" className="mb-1.5">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Briefly describe your concern..."
                rows={3}
                maxLength={500}
              />
            </div>

            <Button type="submit" size="lg" className="mt-6 w-full" disabled={submitting || !doctor.available}>
              {submitting ? "Booking..." : `Confirm appointment · $${doctor.fee}`}
            </Button>
            {!user && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                You'll be asked to sign in to confirm.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
