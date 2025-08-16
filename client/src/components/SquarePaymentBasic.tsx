import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SquarePaymentBasicProps {
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

export default function SquarePaymentBasic({
  amount,
  onPaymentSuccess,
  onPaymentError,
  applicationId,
  locationId,
}: SquarePaymentBasicProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [squareLoaded, setSquareLoaded] = useState(false);

  useEffect(() => {
    const loadSquareSDK = async () => {
      try {
        // Check if Square is already loaded
        if (window.Square) {
          setSquareLoaded(true);
          setIsLoading(false);
          return;
        }

        // Load Square SDK
        const script = document.createElement('script');
        script.src = 'https://web.squarecdn.com/v1/square.js';
        script.async = true;
        
        script.onload = () => {
          console.log('Square SDK loaded');
          setSquareLoaded(true);
          setIsLoading(false);
        };
        
        script.onerror = () => {
          console.error('Failed to load Square SDK');
          onPaymentError('Failed to load payment system');
          setIsLoading(false);
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading Square SDK:', error);
        onPaymentError('Payment system initialization failed');
        setIsLoading(false);
      }
    };

    loadSquareSDK();
  }, [onPaymentError]);

  useEffect(() => {
    if (!squareLoaded) return;

    const initializeSquarePayments = async () => {
      try {
        console.log('Initializing Square payments');
        
        // Wait for DOM to be ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Initialize payments
        const payments = window.Square.payments(applicationId, locationId);
        
        // Create card payment method
        const card = await payments.card();
        
        // Attach to the card container
        await card.attach('#square-card-form');
        
        console.log('Square payment form initialized successfully');
        
        // Store card instance for payment processing
        (window as any).squareCard = card;
        
      } catch (error) {
        console.error('Square initialization error:', error);
        onPaymentError('Payment form initialization failed');
      }
    };

    initializeSquarePayments();
  }, [squareLoaded, applicationId, locationId, onPaymentError]);

  const handlePayment = async () => {
    if (!window.Square || !(window as any).squareCard) {
      onPaymentError('Payment system not ready');
      return;
    }

    setIsProcessing(true);

    try {
      const card = (window as any).squareCard;
      const result = await card.tokenize();
      
      if (result.status === 'OK') {
        console.log('Payment tokenized successfully');
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
            <span className="ml-3">Loading payment system...</span>
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
          id="square-card-form"
          className="min-h-[120px] p-4 border border-gray-300 rounded-md bg-white"
        />
        
        <Button 
          onClick={handlePayment}
          disabled={isProcessing || !squareLoaded}
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
      </CardContent>
    </Card>
  );
}