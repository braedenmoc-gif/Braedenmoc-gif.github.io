import { BrowserRouter, Routes, Route } from '@/router';
import { Layout } from '@/components/Layout';
import Home from '@/pages/Home';
import Program from '@/pages/Program';
import Resources from '@/pages/Resources';
import FilmRoom from '@/pages/FilmRoom';
import About from '@/pages/About';
import FAQ from '@/pages/FAQ';
import Contact from '@/pages/Contact';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import ProductDetail from '@/pages/ProductDetail';

export default function App() {
  return (
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/program" element={<Program />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/film-room" element={<FilmRoom />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </BrowserRouter>
  );
}
