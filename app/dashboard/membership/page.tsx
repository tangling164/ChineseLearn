'use client';

import { PricingSection } from '@/components/membership/pricing-section';

export default function MembershipPage() {
  const handleSubscribe = async (type: 'subscription' | 'lifetime') => {
    try {
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      const data = await response.json();
      if (data.success) {
        window.location.href = data.checkout_url;
      }
    } catch (error) {
      console.error('Subscription failed:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Unlock unlimited access to all Chinese typing courses
        </p>
      </div>

      <PricingSection
        context="dashboard"
        showFreePlan={false}
        onSubscribe={handleSubscribe}
      />

      <div className="text-center space-y-4">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-3">Why Choose Our Platform?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="font-medium mb-1">Targeted Learning</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Courses designed specifically for Chinese typing skills
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">📈</span>
              </div>
              <h4 className="font-medium mb-1">Track Progress</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Detailed analytics to monitor your improvement
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🔊</span>
              </div>
              <h4 className="font-medium mb-1">Audio Support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Native pronunciation for every word and phrase
              </p>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>All plans include a 30-day money-back guarantee.</p>
          <p>Secure payment powered by Creem.</p>
        </div>
      </div>
    </div>
  );
} 