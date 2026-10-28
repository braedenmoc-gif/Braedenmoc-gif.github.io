import { type ReactNode } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { useReveal } from '@/hooks/useReveal';
import { ScrollToTop } from '@/components/ScrollToTop';

export function Layout({ children }: { children: ReactNode }) {
  useReveal();
  return (
    <div className="flex min-h-screen flex-col bg-nearblack">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
