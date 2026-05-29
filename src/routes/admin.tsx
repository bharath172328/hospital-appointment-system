import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, CalendarCheck, Stethoscope, Activity, Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — MediCare" },
      { name: "description", content: "Manage doctors, appointments, and platform analytics." },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login" });
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    if (!roles?.some((r) => r.role === "admin")) {
      throw redirect({ to: "/" });
    }
  },
  component: AdminDashboard,
});

type Doctor = {
  id: string;
  name: string;
  specialization: string;
  bio: string | null;
  image_url: string | null;
  experience_years: number;
  fee: number;
  available: boolean;
};

type AppointmentRow = {
  id: string;
  status: string;
  appointment_date: string;
  appointment_time: string;
  doctor_id: string;
  patient_id: string;
};

function AdminDashboard() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [patientCount, setPatientCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: d }, { data: a }, { count }] = await Promise.all([
      supabase.from("doctors").select("*").order("created_at", { ascending: false }),
      supabase.from("appointments").select("*"),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
    ]);
    setDoctors((d as Doctor[]) ?? []);
    setAppointments((a as AppointmentRow[]) ?? []);
    setPatientCount(count ?? 0);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this doctor?")) return;
    const { error } = await supabase.from("doctors").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Doctor removed");
      load();
    }
  };

  const stats = [
    { label: "Total Doctors", value: doctors.length, icon: Stethoscope, color: "text-blue-600" },
    { label: "Total Patients", value: patientCount, icon: Users, color: "text-emerald-600" },
    { label: "Appointments", value: appointments.length, icon: CalendarCheck, color: "text-purple-600" },
    {
      label: "Pending",
      value: appointments.filter((a) => a.status === "pending").length,
      icon: Activity,
      color: "text-amber-600",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage doctors and monitor activity</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/doctor-dashboard">Doctor view</Link>
        </Button>
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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Doctors</h2>
          <Dialog
            open={dialogOpen}
            onOpenChange={(o) => {
              setDialogOpen(o);
              if (!o) setEditing(null);
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setEditing(null)}>
                <Plus className="h-4 w-4" /> Add doctor
              </Button>
            </DialogTrigger>
            <DoctorForm
              editing={editing}
              onSaved={() => {
                setDialogOpen(false);
                setEditing(null);
                load();
              }}
            />
          </Dialog>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : doctors.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              No doctors yet. Add your first doctor.
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr className="text-left">
                  <th className="p-3">Name</th>
                  <th className="p-3">Specialization</th>
                  <th className="p-3">Experience</th>
                  <th className="p-3">Fee</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((d) => (
                  <tr key={d.id} className="border-t">
                    <td className="p-3 font-medium">{d.name}</td>
                    <td className="p-3 text-muted-foreground">{d.specialization}</td>
                    <td className="p-3">{d.experience_years} yrs</td>
                    <td className="p-3">${Number(d.fee).toFixed(2)}</td>
                    <td className="p-3">
                      <Badge variant={d.available ? "default" : "secondary"}>
                        {d.available ? "Available" : "Unavailable"}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditing(d);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(d.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function DoctorForm({ editing, onSaved }: { editing: Doctor | null; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: editing?.name ?? "",
    specialization: editing?.specialization ?? "",
    bio: editing?.bio ?? "",
    image_url: editing?.image_url ?? "",
    experience_years: editing?.experience_years ?? 0,
    fee: editing?.fee ?? 0,
    available: editing?.available ?? true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: editing?.name ?? "",
      specialization: editing?.specialization ?? "",
      bio: editing?.bio ?? "",
      image_url: editing?.image_url ?? "",
      experience_years: editing?.experience_years ?? 0,
      fee: editing?.fee ?? 0,
      available: editing?.available ?? true,
    });
  }, [editing]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, fee: Number(form.fee), experience_years: Number(form.experience_years) };
    const { error } = editing
      ? await supabase.from("doctors").update(payload).eq("id", editing.id)
      : await supabase.from("doctors").insert(payload);
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success(editing ? "Doctor updated" : "Doctor added");
      onSaved();
    }
  };

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>{editing ? "Edit doctor" : "Add doctor"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-2">
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="grid gap-2">
          <Label>Specialization</Label>
          <Input
            value={form.specialization}
            onChange={(e) => setForm({ ...form, specialization: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label>Experience (yrs)</Label>
            <Input
              type="number"
              min={0}
              value={form.experience_years}
              onChange={(e) => setForm({ ...form, experience_years: Number(e.target.value) })}
            />
          </div>
          <div className="grid gap-2">
            <Label>Fee ($)</Label>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={form.fee}
              onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label>Image URL</Label>
          <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <Label>Bio</Label>
          <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} />
        </div>
        <div className="flex items-center justify-between rounded-md border p-3">
          <Label htmlFor="avail" className="cursor-pointer">Available for bookings</Label>
          <Switch
            id="avail"
            checked={form.available}
            onCheckedChange={(v) => setForm({ ...form, available: v })}
          />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : editing ? "Save changes" : "Add doctor"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
