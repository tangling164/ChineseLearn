'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Star } from 'lucide-react';

export default function MembershipPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (type: 'subscription' | 'lifetime') => {
    setLoading(type);
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
    } finally {
      setLoading(null);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Pro Subscription */}
        <Card className="relative border-2 hover:border-blue-500 transition-colors">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">Pro Monthly</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">Perfect for regular learners</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">$10</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">per month</div>
            </div>

            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span>Access to all courses</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span>Progress tracking</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span>Audio pronunciations</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span>Advanced statistics</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span>Cancel anytime</span>
              </li>
            </ul>

            <Button 
              className="w-full" 
              onClick={() => handleSubscribe('subscription')}
              disabled={loading === 'subscription'}
            >
              {loading === 'subscription' ? 'Processing...' : 'Start Pro Subscription'}
            </Button>
          </CardContent>
        </Card>

        {/* Lifetime Membership */}
        <Card className="relative border-2 border-orange-500 hover:border-orange-600 transition-colors">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
              <Star className="h-3 w-3 mr-1" />
              BEST VALUE
            </Badge>
          </div>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400">Lifetime Access</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">One-time payment, lifetime access</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">$99</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">one-time payment</div>
              <div className="text-xs text-green-600 mt-1">Save $120+ vs monthly</div>
            </div>

            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span>All Pro features included</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span>Future courses included</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span>Exclusive features</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span>No recurring payments</span>
              </li>
            </ul>

            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600" 
              onClick={() => handleSubscribe('lifetime')}
              disabled={loading === 'lifetime'}
            >
              {loading === 'lifetime' ? 'Processing...' : 'Get Lifetime Access'}
            </Button>
          </CardContent>
        </Card>
      </div>

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
          <p>All plans include a 7-day money-back guarantee.</p>
          <p>Secure payment powered by Creem.</p>
        </div>
      </div>
    </div>
  );
} 