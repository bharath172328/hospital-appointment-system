import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  fee: number;
  image_url: string | null;
  experience_years: number;
  available: boolean;
}

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Link
      to="/doctors/$doctorId"
      params={{ doctorId: doctor.id }}
      className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-smooth hover:-translate-y-1 hover:shadow-hover"
    >
      <div className="aspect-[4/3] overflow-hidden bg-primary-soft">
        {doctor.image_url ? (
          <img
            src={doctor.image_url}
            alt={doctor.name}
            className="h-full w-full object-cover transition-smooth group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-bold text-primary">
            {doctor.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs">
          <span className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 ${
            doctor.available ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${doctor.available ? "bg-success" : "bg-muted-foreground"}`} />
            {doctor.available ? "Available" : "Unavailable"}
          </span>
        </div>
        <h3 className="mt-2 text-lg font-semibold leading-tight">{doctor.name}</h3>
        <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            {doctor.experience_years}+ yrs
          </div>
          <div className="text-sm font-semibold text-primary">${doctor.fee}</div>
        </div>
      </div>
    </Link>
  );
}
