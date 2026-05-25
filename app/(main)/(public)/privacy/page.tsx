import Link from "next/link"

export const metadata = {
  title: "Privacy Policy — SwayFitness",
  description: "Learn how SwayFitness collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  const lastUpdated = "1 May 2025"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="text-orange-500 hover:text-orange-600 text-sm font-medium mb-6 inline-block">
            ← Back to SwayFitness
          </Link>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Introduction</h2>
            <p>
              SwayFitness ("we", "our", or "us") is committed to protecting your personal information. This Privacy
              Policy explains what data we collect, why we collect it, how we use it, and your rights regarding your
              data when you use our gym facilities, website, or membership platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect the following categories of personal information:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Identity data:</strong> Full name, date of birth, gender, and a unique member ID.
              </li>
              <li>
                <strong>Contact data:</strong> Email address, phone number, and physical address.
              </li>
              <li>
                <strong>Health data:</strong> Any medical conditions you voluntarily disclose at registration, used
                solely for your safety.
              </li>
              <li>
                <strong>Emergency contact:</strong> Name, phone number, and relationship of your nominated emergency
                contact.
              </li>
              <li>
                <strong>Payment data:</strong> Transaction references and billing history. We do not store your full
                card details — payment is handled by Paystack, who operate under their own privacy policy.
              </li>
              <li>
                <strong>Usage data:</strong> Login activity and interactions with the member dashboard, used for
                security and service improvement.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To create and manage your membership account.</li>
              <li>To process payments and send billing-related communications.</li>
              <li>To contact your emergency contact in the event of a medical emergency on our premises.</li>
              <li>To send you important service updates and administrative notices via email.</li>
              <li>To maintain safety and security in our facilities.</li>
              <li>To comply with applicable laws and regulatory obligations.</li>
              <li>To improve our services based on aggregated, anonymised usage data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">4. Legal Basis for Processing</h2>
            <p>We process your personal data on the following grounds:</p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>
                <strong>Contract performance:</strong> Processing necessary to deliver your membership.
              </li>
              <li>
                <strong>Legitimate interests:</strong> Operating and securing our business and facilities.
              </li>
              <li>
                <strong>Legal obligation:</strong> Where required by Nigerian law or regulation.
              </li>
              <li>
                <strong>Consent:</strong> For any optional communications such as promotional emails (you may
                withdraw consent at any time).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">5. Sharing Your Information</h2>
            <p className="mb-3">
              We do not sell your personal data. We share your information only with:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Paystack</strong> — our payment processor, to handle subscription billing and refunds.
              </li>
              <li>
                <strong>Brevo (Sendinblue)</strong> — our email service provider, to send transactional and
                administrative emails.
              </li>
              <li>
                <strong>Cloud infrastructure providers</strong> — for secure hosting and data storage.
              </li>
              <li>
                Competent authorities or courts, where required by law.
              </li>
            </ul>
            <p className="mt-3">
              All third-party processors are contractually bound to handle your data securely and in accordance with
              applicable data protection law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">6. Data Retention</h2>
            <p>
              We retain your personal data for as long as your membership is active and for a reasonable period
              thereafter to comply with legal obligations (typically up to 7 years for financial records). Health and
              emergency contact data is deleted within 90 days of membership termination unless otherwise required by
              law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">7. Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your personal data against
              unauthorised access, loss, or disclosure. Passwords are stored using industry-standard one-way hashing
              (bcrypt). All data in transit is encrypted using TLS. Access to member data is restricted to authorised
              staff only and logged via our admin audit system.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">8. Your Rights</h2>
            <p className="mb-3">Under applicable data protection law, you have the right to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate or incomplete data.</li>
              <li>Request deletion of your personal data (subject to legal obligations).</li>
              <li>Object to or restrict certain processing activities.</li>
              <li>Withdraw consent at any time, where processing is based on consent.</li>
              <li>Lodge a complaint with the relevant data protection authority.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:support@swayfitness.com" className="text-orange-500 hover:underline">
                support@swayfitness.com
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">9. Cookies</h2>
            <p>
              Our platform uses strictly necessary cookies to maintain your authenticated session. We do not use
              third-party tracking cookies or advertising cookies. You can clear cookies at any time via your browser
              settings, but doing so will log you out of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">10. Children's Privacy</h2>
            <p>
              Our services are not directed to children under the age of 16 without verifiable parental consent. If you
              believe a child has registered without consent, please contact us immediately and we will delete the
              account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we make material changes, we will notify you
              by email at least 14 days before the changes take effect. The updated policy will always be available at
              this URL with a revised "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">12. Contact Us</h2>
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or how we handle your data,
              please reach out to us at{" "}
              <a href="mailto:support@swayfitness.com" className="text-orange-500 hover:underline">
                support@swayfitness.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Also read our{" "}
          <Link href="/terms" className="text-orange-500 hover:underline">
            Terms and Conditions
          </Link>
          .
        </div>
      </div>
    </div>
  )
}
