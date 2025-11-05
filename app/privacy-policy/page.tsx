import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Type中文",
  description: "Privacy Policy for Type中文 - Chinese typing learning platform",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <Link href="/" className="text-orange-500 hover:text-orange-600 transition-colors mb-8 inline-block">
            ← Back to Home
          </Link>

          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">Last updated: November 4, 2025</p>

          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                use our services, or contact us for support.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Account information (email address, password)</li>
                <li>Profile information (name, learning preferences)</li>
                <li>Learning progress and typing data</li>
                <li>Communications with us</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide and maintain our services</li>
                <li>Track your learning progress</li>
                <li>Improve our platform and user experience</li>
                <li>Communicate with you about updates and support</li>
                <li>Process payments for premium subscriptions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Data Storage and Security</h2>
              <p className="mb-4">
                Your data is stored securely using Supabase, a cloud-based database service. 
                We implement appropriate security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Data Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or rent your personal information to third parties. 
                We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>With service providers who assist in our operations (under strict confidentiality agreements)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Payment Information</h2>
              <p className="mb-4">
                Payment processing is handled by Creem. We do not store your credit card or payment details. 
                All payment information is encrypted and processed securely by Creem&apos;s payment system.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Opt-out of communications</li>
                <li>Export your learning data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
              <p className="mb-4">
                We use cookies and similar technologies to enhance your experience, 
                analyze usage patterns, and improve our services. You can control 
                cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Children&apos;s Privacy</h2>
              <p className="mb-4">
                Our service is not intended for children under 13. We do not knowingly 
                collect personal information from children under 13. If you become aware 
                that a child has provided us with personal information, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. We will notify you 
                of any changes by posting the new Privacy Policy on this page and updating 
                the &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="mb-4">
                <a href="mailto:tl18774902382@gmail.com" className="text-orange-500 hover:text-orange-600">
                  tl18774902382@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
