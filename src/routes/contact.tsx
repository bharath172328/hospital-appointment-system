import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Phone, Sparkles, Clock, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact us — MediCare" },
      { name: "description", content: "Get in touch with the MediCare team. We're here to help, 24/7." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().min(2, "Subject is required").max(150),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Thanks! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setSubmitting(false);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-soft">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="container relative mx-auto px-4 py-20 md:py-24">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-card">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              We reply within 24 hours
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Let's <span className="bg-gradient-hero bg-clip-text text-transparent">talk</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Questions, feedback, or partnership ideas — our team is here for you.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-5">
          {/* Contact info */}
          <div className="space-y-4 lg:col-span-2">
            {[
              { icon: Mail, label: "Email us", value: "support@medicare.health", desc: "We respond within 24 hours", tint: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-950/30" },
              { icon: Phone, label: "Call us", value: "+1 (555) 010-2030", desc: "Mon–Fri, 8am–8pm EST", tint: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
              { icon: MapPin, label: "Visit us", value: "1 Health Plaza", desc: "Boston, MA 02115", tint: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/30" },
              { icon: Clock, label: "Support hours", value: "24/7 chat", desc: "Always-on help inside the app", tint: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/30" },
            ].map(({ icon: Icon, label, value, desc, tint, bg }) => (
              <div key={label} className="group flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:shadow-hover">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg} ${tint}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                  <p className="mt-1 font-semibold">{value}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-8 shadow-card lg:col-span-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Send us a message</h2>
                <p className="text-sm text-muted-foreground">Fill in the form and we'll be in touch shortly.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" placeholder="Jane Doe" required maxLength={100} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" placeholder="jane@example.com" required maxLength={255} />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="mt-1.5" placeholder="How can we help?" required maxLength={150} />
            </div>
            <div className="mt-4">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1.5" placeholder="Tell us a bit more..." required maxLength={1000} />
              <p className="mt-1.5 text-right text-xs text-muted-foreground">{form.message.length}/1000</p>
            </div>
            <Button type="submit" size="lg" className="mt-4 w-full" disabled={submitting}>
              {submitting ? "Sending..." : (<><Send className="mr-2 h-4 w-4" /> Send message</>)}
            </Button>
          </form>
        </div>

        {/* FAQ teaser */}
        <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-3">
          {[
            { q: "How do I book?", a: "Browse doctors, pick a time, and confirm — it takes under two minutes." },
            { q: "Is my data private?", a: "Yes. We're HIPAA-aligned and encrypt every record end-to-end." },
            { q: "Can I cancel?", a: "Cancel or reschedule any appointment up to 4 hours before your slot." },
          ].map((f) => (
            <div key={f.q} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
