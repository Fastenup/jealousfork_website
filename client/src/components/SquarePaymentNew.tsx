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
        // Load Square Web Payments SDK
        if (!window.Square) {
          const script = document.createElement('script');
          script.src = 'https://web.squarecdn.com/v1/square.js';
          script.async = true;
          
          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Square SDK'));
            document.head.appendChild(script);
          });
        }

        // Initialize payments
        const paymentsInstance = window.Square.payments(applicationId, locationId);
        setPayments(paymentsInstance);

        // Initialize card
        const cardInstance = await paymentsInstance.card();
        setCard(cardInstance);

        // Attach card to DOM
        if (cardContainerRef.current) {
          await cardInstance.attach(cardContainerRef.current);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Square initialization error:', error);
        onPaymentError('Failed to initialize payment system');
        setIsLoading(false);
      }
    };

    if (applicationId && locationId) {
      initializeSquare();
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