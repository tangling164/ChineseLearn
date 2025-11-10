import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Refund & Billing Policy | Chinese101",
  description: "Learn about our refund and billing policies",
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Refund & Billing Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Last updated: November 10, 2025
          </p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                1. Subscription Plans
              </h2>
              <p className="mb-4">
                Chinese101 offers monthly and annual subscription plans that provide unlimited access 
                to all learning content, features, and future updates. Your subscription will automatically 
                renew at the end of each billing period unless canceled.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                2. Billing
              </h2>
              <p className="mb-4">
                You will be charged at the beginning of each billing cycle. The charge will appear on 
                your credit card statement as processed by Creem, our payment processor. We will send 
                you an email notification before each renewal.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Monthly subscriptions renew every 30 days</li>
                <li>Annual subscriptions renew every 365 days</li>
                <li>All prices are displayed in USD unless otherwise specified</li>
                <li>Applicable taxes may be added based on your location</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                3. No Refunds Policy
              </h2>
              <p className="mb-4">
                <strong>All purchases on Chinese101.app are final.</strong> As a digital learning service, 
                access is granted immediately after payment. Therefore, we do not offer refunds once 
                access has been activated.
              </p>
              <p className="mb-4">
                This policy is in place because:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Digital content is immediately accessible upon purchase</li>
                <li>Users can start learning immediately after payment</li>
                <li>No physical products are involved</li>
                <li>Our service is consumed at the time of purchase</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                4. Exception: Technical Issues and Billing Errors
              </h2>
              <p className="mb-4">
                While we do not offer refunds under normal circumstances, we will assist with:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Technical issues that prevent you from accessing the service</li>
                <li>Duplicate or unauthorized charges</li>
                <li>Documented billing errors</li>
              </ul>
              <p className="mb-4">
                If you experience any of these issues, please contact us at{" "}
                <a 
                  href="mailto:tl18774902382@gmail.com" 
                  className="text-primary hover:text-primary/80 font-semibold"
                >
                  tl18774902382@gmail.com
                </a>
                {" "}with your account details and description of the issue.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                5. Cancellation
              </h2>
              <p className="mb-4">
                You can cancel your subscription at any time from your account settings. Upon cancellation:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>You will continue to have access until the end of your current billing period</li>
                <li>No further charges will be made to your payment method</li>
                <li>You will not receive a refund for the remaining days in your billing period</li>
                <li>Your account data will be retained for 30 days in case you decide to reactivate</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                6. Plan Changes
              </h2>
              <p className="mb-4">
                You can upgrade or downgrade your subscription plan at any time:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Upgrades:</strong> You will be charged a prorated amount for the remaining 
                  time in your current billing period, and the new plan takes effect immediately
                </li>
                <li>
                  <strong>Downgrades:</strong> The change will take effect at the start of your next 
                  billing cycle, and you will continue to have access to your current plan until then
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                7. Failed Payments
              </h2>
              <p className="mb-4">
                If a payment fails:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>We will attempt to charge your payment method up to 3 times</li>
                <li>You will receive email notifications about the failed payment</li>
                <li>Your access may be temporarily suspended until payment is successful</li>
                <li>After 3 failed attempts, your subscription will be automatically canceled</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                8. Price Changes
              </h2>
              <p className="mb-4">
                We reserve the right to change our pricing at any time. If we increase the price of 
                your subscription:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>We will notify you at least 30 days in advance</li>
                <li>The new price will take effect at your next renewal date</li>
                <li>You can cancel your subscription before the renewal to avoid the price increase</li>
                <li>Existing annual subscriptions will be honored at the original price until renewal</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                9. Contact Us
              </h2>
              <p className="mb-4">
                If you have any questions about our refund and billing policies, please contact us at:
              </p>
              <p className="mb-4">
                Email:{" "}
                <a 
                  href="mailto:tl18774902382@gmail.com" 
                  className="text-primary hover:text-primary/80 font-semibold"
                >
                  tl18774902382@gmail.com
                </a>
              </p>
              <p className="mb-4">
                We aim to respond to all inquiries within 24 hours during business days.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

