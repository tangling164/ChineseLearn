"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown } from 'lucide-react';
import Link from 'next/link';

export type PricingPlan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
  paymentType?: 'subscription' | 'lifetime' | null;
};

interface PricingSectionProps {
  context?: 'landing' | 'dashboard';
  showFreePlan?: boolean;
  currentPlan?: string;
  onSubscribe?: (type: 'subscription' | 'lifetime') => void;
}

export function PricingSection({ 
  context = 'landing', 
  showFreePlan = true,
  currentPlan = 'free',
  onSubscribe 
}: PricingSectionProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: PricingPlan) => {
    if (context === 'dashboard' && onSubscribe && plan.paymentType) {
      setLoading(plan.paymentType);
      try {
        await onSubscribe(plan.paymentType);
      } finally {
        setLoading(null);
      }
    }
  };

  const plans: PricingPlan[] = [
    ...(showFreePlan ? [{
      name: "Free Trial",
      price: "$0",
      period: "Always Free",
      description: "Perfect for HSK beginners",
      features: [
        "3 HSK Level 1 lessons",
        "Basic Chinese typing practice",
        "Progress tracking",
        "Community access"
      ],
      cta: context === 'landing' ? "Start Free" : "Current Plan",
      popular: false,
      icon: Zap,
      current: currentPlan === 'free',
      paymentType: null
    }] : []),
    {
      name: "Monthly Pro",
      price: "$10",
      period: "per month",
      description: "Complete Chinese learning course",
      features: [
        "All HSK levels (1-6)",
        "Advanced typing exercises",
        "Detailed performance analytics",
        "Priority support",
        "HSK completion certificates",
        "Custom practice for China travel"
      ],
      cta: context === 'landing' ? "Start Pro" : "Upgrade to Pro",
      popular: true,
      icon: Crown,
      current: currentPlan === 'pro',
      paymentType: 'subscription'
    },
    {
      name: "Lifetime Access",
      price: "$99",
      period: "one-time payment",
      description: "Best for international students & professionals",
      features: [
        "Everything in Pro",
        "Lifetime access to all courses",
        "Future HSK updates included",
        "1-on-1 coaching sessions",
        "Business Chinese modules",
        "China travel conversation practice"
      ],
      cta: context === 'landing' ? "Get Lifetime" : "Get Lifetime Access",
      popular: false,
      icon: Crown,
      current: currentPlan === 'lifetime',
      paymentType: 'lifetime'
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {context === 'landing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Learning Chinese Today -{" "}
              <span className="text-orange-500">Free Trial Available</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Affordable Chinese typing courses for international students. 
              No hidden fees, cancel anytime. All purchases are final.
            </p>
          </motion.div>
        )}

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isCurrentPlan = plan.current;
            const isPopular = plan.popular && !isCurrentPlan;
            
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative ${
                  context === 'dashboard' ? 'h-full' : ''
                }`}
              >
                <Card className={`h-full ${
                  isPopular ? 'ring-2 ring-orange-500 scale-105' : ''
                } ${
                  plan.name === 'Free Trial'
                    ? 'bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-800'
                    : isCurrentPlan
                    ? 'bg-gray-50 dark:bg-gray-800'
                    : ''
                }`}>
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-orange-500 text-white">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-4 right-4">
                      <Badge className="bg-green-500 text-white">
                        Current
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                      isPopular ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        isPopular ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'
                      }`} />
                    </div>
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="mb-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">/{plan.period}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{plan.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {context === 'landing' ? (
                      <Button
                        asChild
                        size="lg"
                        className={`w-full ${
                          isPopular
                            ? 'bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white'
                            : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                        }`}
                      >
                        <Link href={isCurrentPlan ? '/dashboard' : '/auth/sign-up'}>
                          {plan.cta}
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        className={`w-full ${
                          isCurrentPlan
                            ? 'bg-gray-400 cursor-not-allowed'
                            : isPopular
                            ? 'bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white'
                            : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                        }`}
                        disabled={isCurrentPlan || loading === plan.paymentType}
                        onClick={() => handleSubscribe(plan)}
                      >
                        {loading === plan.paymentType ? 'Processing...' : plan.cta}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {context === 'landing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              All purchases are final. No refunds after access is activated.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <span>✓ No setup fees</span>
              <span>✓ Cancel anytime</span>
              <span>✓ Secure payments</span>
              <span>✓ 24/7 support</span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
