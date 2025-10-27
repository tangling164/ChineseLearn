'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    const checkoutId = searchParams.get('checkout_id');
    
    if (!checkoutId) {
      setPaymentStatus('failed');
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/payment/status?checkout_id=${checkoutId}`);
        const data = await response.json();

        if (data.success && data.status === 'completed') {
          setPaymentStatus('success');
          setPaymentDetails(data);
        } else {
          setPaymentStatus('failed');
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
        setPaymentStatus('failed');
      }
    };

    // 验证支付状态，10秒超时
    const timeoutId = setTimeout(() => {
      setPaymentStatus('failed');
    }, 10000);

    verifyPayment().finally(() => {
      clearTimeout(timeoutId);
    });

  }, [searchParams]);

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  if (paymentStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin text-blue-600" />
              <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we confirm your payment...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Thank you for your purchase! Your payment has been processed successfully.
            </p>
            
            {paymentDetails?.metadata?.paymentType === 'single_course' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  You now have access to your purchased course. Start learning right away!
                </p>
              </div>
            )}
            
            {paymentDetails?.metadata?.paymentType === 'subscription' && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6">
                <p className="text-sm text-green-800 dark:text-green-200">
                  Your Pro subscription is now active! You have access to all courses.
                </p>
              </div>
            )}
            
            {paymentDetails?.metadata?.paymentType === 'lifetime' && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-6">
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Congratulations! You now have lifetime access to all courses.
                </p>
              </div>
            )}

            <Button 
              onClick={handleBackToDashboard}
              className="w-full"
              size="lg"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Failed state - redirect to failure page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <XCircle className="h-16 w-16 mx-auto mb-4 text-red-600" />
          <CardTitle className="text-2xl text-red-600">Payment Verification Failed</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't verify your payment status. Please check your email for confirmation or contact support.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={handleBackToDashboard}
              className="w-full"
              size="lg"
            >
              Go to Dashboard
            </Button>
            
            <Button 
              onClick={() => router.push('/payment/fail')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              View Payment Failed Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 