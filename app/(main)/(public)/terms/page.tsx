import Link from "next/link"

export const metadata = {
  title: "Terms and Conditions — SwayFitness",
  description: "Read the terms and conditions governing your SwayFitness membership.",
}

export default function TermsPage() {
  const lastUpdated = "1 May 2025"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="text-orange-500 hover:text-orange-600 text-sm font-medium mb-6 inline-block">
            ← Back to SwayFitness
          </Link>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Terms and Conditions</h1>
          <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Acceptance of Terms</h2>
            <p>
              By registering for a membership at SwayFitness, you agree to be bound by these Terms and Conditions. If
              you do not agree with any part of these terms, you may not proceed with your registration or use our
              facilities and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">2. Membership</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Membership is personal and non-transferable.</li>
              <li>
                You must be at least 16 years of age to hold a membership. Members under 18 require written parental or
                guardian consent.
              </li>
              <li>
                Providing false information during registration may result in immediate termination of your membership
                without refund.
              </li>
              <li>
                SwayFitness reserves the right to refuse or revoke membership at its sole discretion if a member's
                conduct is deemed inappropriate, harmful, or in violation of these terms.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">3. Fees and Payments</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                A one-time, non-refundable registration fee is charged at the time of sign-up in addition to your first
                membership period payment.
              </li>
              <li>Recurring membership fees are billed automatically on your chosen billing cycle (monthly or yearly).</li>
              <li>
                All payments are processed securely via Paystack. SwayFitness does not store your card details.
              </li>
              <li>
                Failure to maintain a valid payment method may result in suspension of access to facilities and services.
              </li>
              <li>Prices are subject to change with at least 30 days' written notice via email.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">4. Cancellation and Refunds</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>You may cancel your membership at any time by contacting our support team.</li>
              <li>
                Cancellation takes effect at the end of the current billing period — you retain access until that date.
              </li>
              <li>Registration fees are non-refundable under any circumstances.</li>
              <li>
                Partial-month or partial-year refunds are not issued except at the sole discretion of SwayFitness
                management.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">5. Health and Safety</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                You confirm that you are in good health and have no medical condition that would prevent you from safely
                using our facilities and services. If in doubt, consult a qualified medical professional before
                exercising.
              </li>
              <li>SwayFitness is not liable for any injury, illness, or death arising from use of its facilities.</li>
              <li>
                You agree to follow all posted rules, instructions from staff, and applicable health and safety
                regulations at all times on the premises.
              </li>
              <li>Any medical conditions disclosed are kept confidential and used only for your safety.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">6. Conduct</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Members must treat staff and other members with respect at all times.</li>
              <li>Harassment, bullying, or discrimination of any kind will result in immediate membership termination.</li>
              <li>Members are responsible for any damage caused to equipment or property through negligence or misuse.</li>
              <li>Recording other members without their explicit consent is strictly prohibited.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">7. Intellectual Property</h2>
            <p>
              All content on the SwayFitness platform — including but not limited to workout plans, training materials,
              logos, and written content — is the property of SwayFitness and may not be reproduced, distributed, or
              used without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, SwayFitness shall not be liable for any indirect,
              incidental, special, or consequential damages arising from your use of our facilities, services, or
              platform, even if SwayFitness has been advised of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">9. Changes to These Terms</h2>
            <p>
              SwayFitness reserves the right to update these Terms and Conditions at any time. Material changes will be
              communicated via email at least 14 days before they take effect. Continued use of your membership after
              the effective date constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">10. Governing Law</h2>
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws of the Federal
              Republic of Nigeria. Any disputes arising under these terms shall be subject to the exclusive jurisdiction
              of the courts of Nigeria.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">11. Contact Us</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us at{" "}
              <a href="mailto:support@swayfitness.com" className="text-orange-500 hover:underline">
                support@swayfitness.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Also read our{" "}
          <Link href="/privacy" className="text-orange-500 hover:underline">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  )
}
