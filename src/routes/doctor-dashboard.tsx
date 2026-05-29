import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, CheckCircle2, XCircle, Clock, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/doctor-dashboard")({
  head: () => ({
    meta: [
      { title: "Doctor Dashboard — MediCare" },
      { name: "description", content: "Manage your appointments and patient schedule." },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login" });
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    if (!roles?.some((r) => r.role === "doctor" || r.role === "admin")) {
      throw redirect({ to: "/" });
    }
  },
  component: DoctorDashboard,
});

type Appt = {
  id: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  appointment_date: string;
  appointment_time: string;
  notes: string | null;
  doctor_id: string;
  patient_id: string;
  doctors: { name: string; specialization: string } | null;
};

const statusColor: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  confirmed: "default",
  completed: "secondary",
  cancelled: "destructive",
};

function DoctorDashboard() {
  const [appts, setAppts] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("appointments")
      .select("*, doctors(name, specialization)")
      .order("appointment_date", { ascending: true });
    if (error) toast.error(error.message);
    setAppts((data as Appt[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: Appt["status"]) => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Marked as ${status}`);
      load();
    }
  };

  const stats = [
    { label: "Total", value: appts.length, icon: ClipboardList, color: "text-blue-600" },
    {
      label: "Pending",
      value: appts.filter((a) => a.status === "pending").length,
      icon: Clock,
      color: "text-amber-600",
    },
    {
      label: "Confirmed",
      value: appts.filter((a) => a.status === "confirmed").length,
      icon: CheckCircle2,
      color: "text-emerald-600",
    },
    {
      label: "Completed",
      value: appts.filter((a) => a.status === "completed").length,
      icon: Calendar,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage incoming appointments</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`rounded-lg bg-secondary p-3 ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Appointments</h2>
        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : appts.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              No appointments yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {appts.map((a) => (
              <Card key={a.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">
                        {a.doctors?.name ?? "Doctor"}{" "}
                        <span className="font-normal text-muted-foreground">
                          · {a.doctors?.specialization}
                        </span>
                      </p>
                      <Badge variant={statusColor[a.status]}>{a.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(a.appointment_date).toLocaleDateString()} at {a.appointment_time}
                    </p>
                    {a.notes && <p className="mt-2 text-sm">📝 {a.notes}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {a.status === "pending" && (
                      <Button size="sm" onClick={() => updateStatus(a.id, "confirmed")}>
                        <CheckCircle2 className="h-4 w-4" /> Confirm
                      </Button>
                    )}
                    {a.status === "confirmed" && (
                      <Button size="sm" onClick={() => updateStatus(a.id, "completed")}>
                        <CheckCircle2 className="h-4 w-4" /> Complete
                      </Button>
                    )}
                    {a.status !== "cancelled" && a.status !== "completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(a.id, "cancelled")}
                      >
                        <XCircle className="h-4 w-4" /> Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
