export default function Terms() {
  return (
    <>
      <section className="relative overflow-hidden bg-nearblack py-24 noise-overlay">
        <div className="container-x relative">
          <p className="eyebrow mb-3 reveal">Legal</p>
          <h1 className="reveal display-xl text-6xl sm:text-7xl lg:text-8xl text-offwhite">Terms of Service</h1>
          <p className="reveal mt-5 max-w-xl text-sm text-silver">Last updated: October 2026. This is a template — replace with your finalized terms before launch.</p>
        </div>
      </section>

      <section className="bg-charcoal py-16">
        <div className="container-x">
          <div className="reveal mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-silver">
            <Block title="1. Use of Our Resources">
              <p>By purchasing and downloading our resources, you agree to use them for personal quarterback development only. You may print and reuse the Journal for your own training. You may not resell, redistribute, or share the downloaded files with others.</p>
            </Block>
            <Block title="2. Digital Downloads">
              <p>All products are downloadable PDFs delivered after verified payment. Download links are provided after purchase. You are responsible for saving your files; we recommend downloading immediately after purchase.</p>
            </Block>
            <Block title="3. Refund Policy">
              <p>If a product is not what you expected, contact us within 14 days of purchase and we will make it right. Because our products are digital downloads, refunds are reviewed on a case-by-case basis to prevent abuse.</p>
            </Block>
            <Block title="4. No Guarantee of Results">
              <p>Our resources provide structured training material. Your results depend on your effort, consistency, and individual circumstances. We make no guarantee of athletic performance, recruitment, or playing time.</p>
            </Block>
            <Block title="5. Not Medical Advice">
              <p>Our training resources include general safety considerations but are not medical advice. Consult a qualified coach or medical professional before starting any new training program, especially if you have an injury or health condition.</p>
            </Block>
            <Block title="6. Intellectual Property">
              <p>All content — text, design, drills, worksheets, and layout — is the property of QB Blueprint and protected by copyright law. Unauthorized redistribution is prohibited.</p>
            </Block>
            <Block title="7. Changes to These Terms">
              <p>We may update these terms from time to time. Continued use of our resources after changes constitutes acceptance of the updated terms.</p>
            </Block>
            <Block title="8. Contact">
              <p>Questions about these terms? Use the Contact page.</p>
            </Block>
          </div>
        </div>
      </section>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 font-headline text-lg font-semibold uppercase tracking-tight text-offwhite">{title}</h2>
      {children}
    </div>
  );
}
