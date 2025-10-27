"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Star } from "lucide-react";

export function MembershipPlans() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "Always Free",
      description: "Perfect for getting started",
      features: [
        "3 Basic lessons",
        "Basic typing practice",
        "Progress tracking",
        "Community access"
      ],
      cta: "Current Plan",
      current: true,
      popular: false,
      icon: Zap
    },
    {
      name: "Monthly Pro",
      price: "$10",
      period: "per month",
      description: "Full access to all features",
      features: [
        "All lessons unlocked",
        "Advanced practice modes",
        "Detailed analytics",
        "Priority support",
        "Download certificates",
        "Custom practice sets"
      ],
      cta: "Upgrade to Pro",
      current: false,
      popular: true,
      icon: Crown
    },
    {
      name: "Lifetime Access",
      price: "$99",
      period: "one-time payment",
      description: "Best value for serious learners",
      features: [
        "Everything in Pro",
        "Lifetime access",
        "Future course updates",
        "Premium support",
        "Early access to new features",
        "Exclusive community"
      ],
      cta: "Get Lifetime",
      current: false,
      popular: false,
      icon: Crown
    }
  ];

  return (
    <div className="space-y-8">
      {/* Current Status */}
      <Card className="bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 border-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Current Plan: Free</h3>
              <p className="text-gray-600 dark:text-gray-400">
                You have access to 3 basic lessons. Upgrade to unlock all content!
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">3/20</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Lessons Unlocked</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <Card className={`h-full ${
                plan.popular ? 'ring-2 ring-orange-500 scale-105' : ''
              } ${plan.current ? 'bg-gray-50 dark:bg-gray-800' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-orange-500 text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}

                {plan.current && (
                  <div className="absolute -top-4 right-4">
                    <Badge className="bg-green-500 text-white">
                      Current
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                    plan.popular ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <Icon className={`w-8 h-8 ${
                      plan.popular ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'
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
                      <li key={feature} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    size="lg"
                    className={`w-full ${
                      plan.current
                        ? 'bg-gray-400 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white'
                        : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                    }`}
                    disabled={plan.current}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Features Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Why Upgrade?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-yellow-500 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Unlock All Lessons</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Access our complete library of 20+ structured lessons covering all skill levels.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-yellow-500 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Advanced Analytics</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track your detailed progress, typing speed, and accuracy improvements over time.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-yellow-500 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Priority Support</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get faster responses to your questions and priority access to new features.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Money Back Guarantee */}
      <div className="text-center text-gray-600 dark:text-gray-400">
        <p className="mb-4">All plans include 30-day money-back guarantee</p>
        <div className="flex flex-wrap justify-center gap-8 text-sm">
          <span>✓ No setup fees</span>
          <span>✓ Cancel anytime</span>
          <span>✓ Secure payments</span>
          <span>✓ 24/7 support</span>
        </div>
      </div>
    </div>
  );
} 