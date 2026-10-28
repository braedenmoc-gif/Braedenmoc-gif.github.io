import { useState } from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-nearblack py-24 noise-overlay">
        <div className="container-x relative">
          <p className="eyebrow mb-3 reveal">Contact</p>
          <h1 className="reveal display-xl text-6xl sm:text-7xl lg:text-8xl text-offwhite">Get in touch.</h1>
          <p className="reveal mt-5 max-w-xl text-base leading-relaxed text-silver">Questions about a product, a download, or your training? Send a message and you will hear back within 1–2 business days.</p>
        </div>
      </section>

      <section className="bg-charcoal py-20">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
            {/* Info */}
            <div className="reveal">
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-nearblack text-electric">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-headline text-sm font-semibold uppercase tracking-wider2 text-offwhite">Email</h3>
                    <p className="text-sm text-silver">support@nextsnapqb.com</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-nearblack text-electric">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-headline text-sm font-semibold uppercase tracking-wider2 text-offwhite">Response Time</h3>
                    <p className="text-sm text-silver">1–2 business days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="reveal card-surface p-8">
              {sent ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-electric/30 bg-electric/10 text-electric">
                    <Send className="h-6 w-6" />
                  </div>
                  <h3 className="font-headline text-lg font-semibold uppercase tracking-tight text-offwhite">Message sent</h3>
                  <p className="mt-2 text-sm text-silver">Thanks for reaching out. You will hear back within 1–2 business days.</p>
                  <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="btn-ghost mt-6">Send another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                    <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                  </div>
                  <Field label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} required />
                  <div>
                    <label className="mb-1.5 block font-headline text-xs font-semibold uppercase tracking-wider2 text-silver">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full rounded-md border border-white/10 bg-nearblack px-4 py-3 text-sm text-offwhite placeholder-silver/40 outline-none transition-colors focus:border-electric"
                      placeholder="How can we help?"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full">Send Message <Send className="h-4 w-4" /></button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, value, onChange, type = 'text', required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block font-headline text-xs font-semibold uppercase tracking-wider2 text-silver">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-white/10 bg-nearblack px-4 py-3 text-sm text-offwhite placeholder-silver/40 outline-none transition-colors focus:border-electric"
      />
    </div>
  );
}
