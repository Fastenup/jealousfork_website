import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SquarePaymentNewProps {
  amount: number;
  onPaymentSuccess: (token: string) => void;
  onPaymentError: (error: string) => void;
  applicationId: string;
  locationId: string;
}

declare global {
  interface Window {
    Square: any;
  }
}

export default function SquarePaymentNew({
  amount,
  onPaymentSuccess,
  onPaymentError,
  applicationId,
  locationId,
}: SquarePaymentNewProps) {
  const [payments, setPayments] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeSquare = async () => {
      try {
        console.log('Starting Square initialization with:', {
          appId: applicationId?.substring(0, 15) + '...',
          locationId
        });

        // Load Square Web Payments SDK if not already loaded
        if (!window.Square) {
          console.log('Loading Square SDK...');
          const script = document.createElement('script');
          script.src = 'https://web.squarecdn.com/v1/square.js';
          script.async = false; // Load synchronously for better initialization
          
          await new Promise<void>((resolve, reject) => {
            script.onload = () => {
              console.log('Square SDK loaded successfully');
              resolve();
            };
            script.onerror = () => reject(new Error('Failed to load Square SDK'));
            document.head.appendChild(script);
          });
        }

        // Wait for DOM to be ready
        await new Promise(resolve => setTimeout(resolve, 100));

        // Initialize Square payments with proper error handling
        console.log('Initializing Square payments...');
        const paymentsInstance = window.Square.payments(applicationId, locationId);
        console.log('Payments instance created');
        
        setPayments(paymentsInstance);

        // Initialize card payment method
        console.log('Creating card instance...');
        const cardInstance = await paymentsInstance.card({
          style: {
            input: {
              fontSize: '14px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }
          }
        });
        console.log('Card instance created');
        
        setCard(cardInstance);

        // Wait for DOM container to be available
        let retries = 0;
        while (!cardContainerRef.current && retries < 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          retries++;
        }

        if (cardContainerRef.current) {
          console.log('Attaching card to DOM...');
          await cardInstance.attach(cardContainerRef.current);
          console.log('Card attached successfully');
        } else {
          throw new Error('Card container not found after retries');
        }

        setIsLoading(false);
        console.log('Square initialization complete');

      } catch (error) {
        console.error('Square initialization error:', error);
        onPaymentError(`Payment system initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };

    if (applicationId && locationId) {
      initializeSquare();
    } else {
      console.error('Missing Square credentials:', { applicationId: !!applicationId, locationId: !!locationId });
      onPaymentError('Square credentials not configured');
      setIsLoading(false);
    }
  }, [applicationId, locationId, onPaymentError]);

  const handlePayment = async () => {
    if (!card) {
      onPaymentError('Payment system not ready');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await card.tokenize();
      
      if (result.status === 'OK') {
        onPaymentSuccess(result.token);
      } else {
        let errorMessage = 'Payment failed';
        if (result.errors) {
          errorMessage = result.errors.map((error: any) => error.message).join(', ');
        }
        onPaymentError(errorMessage);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      onPaymentError('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-3">Loading payment form...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <p className="text-sm text-gray-600">
          Enter your card details below. Total: ${amount.toFixed(2)}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div 
          ref={cardContainerRef}
          id="card-container"
          className="p-3 border border-gray-300 rounded-md min-h-[56px] bg-white"
        />
        
        <Button 
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing Payment...
            </>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </Button>
        
        <div className="text-xs text-gray-500 text-center">
          🔒 Your payment information is secure and encrypted
        </div>
      </CardContent>
    </Card>
  );
}