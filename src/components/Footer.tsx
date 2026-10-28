import { Link } from '@/router';
import { Mail, Instagram, Twitter, Youtube } from 'lucide-react';

const cols = [
  {
    title: 'Train',
    links: [
      { label: 'The Program', to: '/program' },
      { label: 'Training Resources', to: '/resources' },
      { label: 'Film Room', to: '/film-room' },
      { label: 'Complete Bundle', to: '/products/complete-qb-development-bundle' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-nearblack pt-16 noise-overlay">
      <div className="container-x relative">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 border-b border-white/[0.06] pb-12 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-display text-4xl uppercase leading-none text-offwhite sm:text-5xl">Built for the next snap.</h2>
            <p className="mt-2 text-sm text-silver">Start your development today — one program, one download, one offseason.</p>
          </div>
          <Link to="/resources" className="btn-solid">Browse Resources</Link>
        </div>

        <div className="grid gap-10 pb-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-charcoal">
                <span className="font-display text-lg leading-none text-electric">Q</span>
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-headline text-sm font-semibold uppercase tracking-wider2 text-offwhite">QB Blueprint</span>
                <span className="font-headline text-[9px] uppercase tracking-[0.3em] text-silver/60">Quarterback</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-silver">Quarterback development resources for high school and college QBs. Train mechanics, footwork, film study, decision-making, and leadership.</p>
            <div className="mt-5 flex items-center gap-2">
              {[Instagram, Twitter, Youtube, Mail].map((Icon, i) => (
                <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-charcoal text-silver transition-colors hover:border-white/25 hover:text-offwhite" aria-label="Social link">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 font-headline text-xs font-semibold uppercase tracking-widest2 text-silver">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-silver transition-colors hover:text-offwhite">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] py-7 sm:flex-row">
          <p className="text-xs text-silver/60">© {new Date().getFullYear()} QB Blueprint QB. All rights reserved.</p>
          <p className="text-xs text-silver/60">Built for quarterbacks, by a quarterback.</p>
        </div>
      </div>
    </footer>
  );
}
