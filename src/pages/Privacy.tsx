export default function Privacy() {
  return (
    <>
      <section className="relative overflow-hidden bg-nearblack py-24 noise-overlay">
        <div className="container-x relative">
          <p className="eyebrow mb-3 reveal">Legal</p>
          <h1 className="reveal display-xl text-6xl sm:text-7xl lg:text-8xl text-offwhite">Privacy Policy</h1>
          <p className="reveal mt-5 max-w-xl text-sm text-silver">Last updated: October 2026. This is a template — replace with your finalized policy before launch.</p>
        </div>
      </section>

      <section className="bg-charcoal py-16">
        <div className="container-x">
          <div className="reveal mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-silver">
            <Block title="1. Information We Collect">
              <p>We collect information you provide when you purchase a product, contact us, or create an account — including your name, email address, and payment information. Payment is processed by Payhip and its payment providers (PayPal or card processing); we do not see or store your full card details.</p>
            </Block>
            <Block title="2. How We Use Your Information">
              <p>We use your information to process orders, deliver digital downloads, send purchase receipts, respond to inquiries, and improve our resources. We do not sell or rent your personal information to third parties.</p>
            </Block>
            <Block title="3. Cookies and Tracking">
              <p>We use minimal cookies and local storage to keep the site working. We do not use invasive tracking or sell behavioral data to advertisers.</p>
            </Block>
            <Block title="4. Data Security">
              <p>Checkout, payment processing, and file delivery are handled by Payhip. Your payment details never touch our servers.</p>
            </Block>
            <Block title="5. Your Rights">
              <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at support@nextsnapqb.com.</p>
            </Block>
            <Block title="6. Children's Privacy">
              <p>Our resources are designed for high school and college athletes. We do not knowingly collect personal information from children under 13.</p>
            </Block>
            <Block title="7. Contact">
              <p>Questions about this policy? Email support@nextsnapqb.com.</p>
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
