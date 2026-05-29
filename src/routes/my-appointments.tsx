import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Calendar, Clock, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/my-appointments")({
  head: () => ({ meta: [{ title: "My appointments — MediCare" }] }),
  component: MyAppointmentsPage,
});

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-warning/10 text-warning-foreground border border-warning/30",
  confirmed: "bg-primary-soft text-primary",
  cancelled: "bg-destructive/10 text-destructive",
  completed: "bg-success/10 text-success",
};

function MyAppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const qc = useQueryClient();

  useEffect(() => {
    if (!authLoading && !user) router.navigate({ to: "/login" });
  }, [user, authLoading, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["my-appointments", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*, doctors(name, specialization, image_url)")
        .order("appointment_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const cancel = async (id: string) => {
    const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Appointment cancelled");
    qc.invalidateQueries({ queryKey: ["my-appointments"] });
  };

  if (authLoading || !user) {
    return <div className="container mx-auto px-4 py-12"><div className="h-40 animate-pulse rounded-2xl bg-muted" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My appointments</h1>
          <p className="mt-2 text-muted-foreground">Manage your upcoming and past visits</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/doctors">Book new</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : data && data.length > 0 ? (
        <div className="space-y-3">
          {data.map((a) => (
            <div key={a.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-center">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-primary-soft">
                {a.doctors?.image_url ? (
                  <img src={a.doctors.image_url} alt={a.doctors.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xl font-bold text-primary">
                    {a.doctors?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{a.doctors?.name}</h3>
                <p className="text-sm text-muted-foreground">{a.doctors?.specialization}</p>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {a.appointment_date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {a.appointment_time?.slice(0, 5)}</span>
                </div>
              </div>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[a.status]}`}>
                {a.status}
              </span>
              {a.status !== "cancelled" && a.status !== "completed" && (
                <Button variant="ghost" size="sm" onClick={() => cancel(a.id)} className="text-destructive hover:text-destructive">
                  <X className="mr-1 h-4 w-4" /> Cancel
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">No appointments yet.</p>
          <Button asChild className="mt-4">
            <Link to="/doctors">Book your first appointment</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
