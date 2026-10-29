import { useState } from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { SUPPORT_EMAIL } from '@/data/site';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const mailto = () => {
    const body = `${form.message}\n\nFrom: ${form.name} (${form.email})`;
    return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <section className="relative overflow-hidden bg-nearblack py-24 noise-overlay">
        <div className="container-x relative">
          <p className="eyebrow mb-3 reveal">Contact</p>
          <h1 className="reveal display-xl text-6xl sm:text-7xl lg:text-8xl text-offwhite">Get in touch.</h1>
          <p className="reveal mt-5 max-w-xl text-base leading-relaxed text-silver">Questions about a product, a download, or a refund? Reach out and we will get back to you.</p>
        </div>
      </section>

      <section className="bg-charcoal py-20">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
            <div className="reveal space-y-5">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-nearblack text-electric"><Mail className="h-5 w-5" /></div>
                <div>
                  <h3 className="font-headline text-sm font-semibold uppercase tracking-wider2 text-offwhite">Email</h3>
                  <p className="text-sm text-silver">{SUPPORT_EMAIL || 'Support email coming soon'}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-nearblack text-electric"><MessageSquare className="h-5 w-5" /></div>
                <div>
                  <h3 className="font-headline text-sm font-semibold uppercase tracking-wider2 text-offwhite">Purchases and downloads</h3>
                  <p className="text-sm text-silver">Your download link and receipt come from Payhip by email. Check spam if you do not see it.</p>
                </div>
              </div>
            </div>

            <div className="reveal card-surface p-8">
              {SUPPORT_EMAIL ? (
                <form onSubmit={(e) => { e.preventDefault(); window.location.href = mailto(); }} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                    <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                  </div>
                  <Field label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} required />
                  <div>
                    <label className="mb-1.5 block font-headline text-xs font-semibold uppercase tracking-wider2 text-silver">Message</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-md border border-white/10 bg-nearblack px-4 py-3 text-sm text-offwhite placeholder-silver/40 outline-none transition-colors focus:border-electric" placeholder="How can we help?" />
                  </div>
                  <button type="submit" className="btn-primary w-full">Open in my email app <Send className="h-4 w-4" /></button>
                </form>
              ) : (
                <div className="py-10 text-center">
                  <p className="font-headline text-lg font-semibold uppercase tracking-tight text-offwhite">Contact form coming soon</p>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-silver">For help with a purchase, reply to the receipt email Payhip sent you.</p>
                </div>
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
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border border-white/10 bg-nearblack px-4 py-3 text-sm text-offwhite placeholder-silver/40 outline-none transition-colors focus:border-electric" />
    </div>
  );
}
