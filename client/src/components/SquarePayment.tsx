import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface SquarePaymentProps {
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

export default function SquarePayment({
  amount,
  onPaymentSuccess,
  onPaymentError,
  applicationId,
  locationId,
}: SquarePaymentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [payments, setPayments] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeSquare = async () => {
      try {
        setIsLoading(true);
        console.log('Initializing Square with:', { applicationId, locationId });
        
        // Load Square Web Payments SDK
        if (!window.Square) {
          const script = document.createElement('script');
          script.src = 'https://sandbox-web.squarecdn.com/v1/square.js'; // Use production URL for live
          script.async = true;
          document.head.appendChild(script);
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
        }

        if (!window.Square) {
          throw new Error('Failed to load Square Web Payments SDK');
        }

        const paymentsInstance = window.Square.payments(applicationId, locationId);
        setPayments(paymentsInstance);

        const cardInstance = await paymentsInstance.card();
        await cardInstance.attach(cardRef.current);
        setCard(cardInstance);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing Square:', error);
        onPaymentError('Failed to initialize payment system');
        setIsLoading(false);
      }
    };

    if (applicationId && locationId && cardRef.current) {
      initializeSquare();
    }

    return () => {
      if (card) {
        card.destroy();
      }
    };
  }, [applicationId, locationId, onPaymentError]);

  const handlePayment = async () => {
    if (!card || !payments) {
      onPaymentError('Payment system not initialized');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await card.tokenize();

      if (result.status === 'OK') {
        onPaymentSuccess(result.token);
      } else {
        onPaymentError(result.errors?.[0]?.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading payment system...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-lg font-semibold">
          Total: ${amount.toFixed(2)}
        </div>
        
        <div 
          ref={cardRef}
          className="border rounded-lg p-4 min-h-[120px]"
          style={{ minHeight: '120px' }}
        />
        
        <Button 
          onClick={handlePayment}
          disabled={isProcessing || !card}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Payment...
            </>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </Button>
        
        <div className="text-xs text-gray-500 text-center">
          Powered by Square • Secure payment processing
        </div>
      </CardContent>
    </Card>
  );
}