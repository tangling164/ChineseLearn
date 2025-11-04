import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Type中文",
  description: "Terms of Service for Type中文 - Chinese typing learning platform",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <Link href="/" className="text-orange-500 hover:text-orange-600 transition-colors mb-8 inline-block">
            ← Back to Home
          </Link>

          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Terms of Service</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">Last updated: November 4, 2025</p>

          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using Type中文 ("the Service"), you accept and agree to be bound 
                by the terms and provision of this agreement. If you do not agree to abide 
                by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p className="mb-4">
                Type中文 is an interactive Chinese typing learning platform designed for English speakers. 
                We provide:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Interactive typing lessons and exercises</li>
                <li>Progress tracking and analytics</li>
                <li>Personalized learning paths</li>
                <li>Premium subscription features</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <p className="mb-4">To use certain features of our service, you must create an account by:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Providing accurate, current, and complete information</li>
                <li>Maintaining and updating your account information</li>
                <li>Maintaining the security of your password and account</li>
                <li>Accepting responsibility for all activities under your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Subscription and Payment</h2>
              <p className="mb-4">
                Certain features of our service require a paid subscription. By subscribing, you agree to:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Pay all applicable fees as described on the pricing page</li>
                <li>Provide valid payment information</li>
                <li>Comply with Creem's terms of service for payment processing</li>
                <li>Understand that subscriptions automatically renew unless cancelled</li>
                <li>Cancel your subscription at any time through your account settings</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use</h2>
              <p className="mb-4">You agree to use the service only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Use the service in any way that violates applicable laws or regulations</li>
                <li>Transmit or procure the sending of any advertising or promotional material without our prior written consent</li>
                <li>Impersonate or attempt to impersonate the company, employees, or other users</li>
                <li>Use any automated system to access the service</li>
                <li>Attempt to interfere with, compromise the system integrity or security of the service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
              <p className="mb-4">
                The service and its original content, features, and functionality are and will remain 
                the exclusive property of Type中文 and its licensors. The service is protected by 
                copyright, trademark, and other laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. User Content</h2>
              <p className="mb-4">
                You retain ownership of content you submit to the service. By submitting content, 
                you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, 
                and display such content in connection with operating and improving the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Privacy</h2>
              <p className="mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also 
                governs your use of the service, to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
              <p className="mb-4">
                We may terminate or suspend your account and access to the service immediately, 
                without prior notice or liability, for any reason whatsoever, including without 
                limitation if you breach the Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
              <p className="mb-4">
                In no event shall Type中文, nor its directors, employees, partners, agents, 
                suppliers, or affiliates, be liable for any indirect, incidental, special, 
                consequential, or punitive damages, including without limitation, loss of 
                profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Disclaimer</h2>
              <p className="mb-4">
                Your use of the service is at your sole risk. The service is provided on an "AS IS" 
                and "AS AVAILABLE" basis. We expressly disclaim all warranties of any kind, 
                whether express or implied.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
              <p className="mb-4">
                These Terms shall be interpreted and governed in accordance with the laws in effect at the time, 
                without regard to conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="mb-4">
                <a href="mailto:tl314841639@gmail.com" className="text-orange-500 hover:text-orange-600">
                  tl314841639@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
