import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero">
                <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="text-lg font-bold">MediCare</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Trusted healthcare at your fingertips. Book qualified doctors with ease.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Patients</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/doctors" className="hover:text-primary">Find a doctor</Link></li>
              <li><Link to="/my-appointments" className="hover:text-primary">My appointments</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Contact</h4>
            <p className="text-sm text-muted-foreground">support@medicare.health</p>
            <p className="text-sm text-muted-foreground">+1 (555) 010-2030</p>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} MediCare. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
