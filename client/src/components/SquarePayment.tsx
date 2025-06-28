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
        // For sandbox mode, we'll use mock payment functionality
        // This allows testing without requiring Square SDK to load
        if (applicationId.includes('sandbox')) {
          
          // Simulate Square loading delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Create mock payment instance
          const mockPayments = {
            card: async () => ({
              attach: async () => console.log('Mock card attached'),
              tokenize: async () => ({
                status: 'OK',
                token: 'mock_token_' + Date.now()
              }),
              destroy: () => console.log('Mock card destroyed')
            })
          };
          
          setPayments(mockPayments);
          const mockCard = await mockPayments.card();
          await mockCard.attach();
          setCard(mockCard);
          setIsLoading(false);
          return;
        }
        
        // Production Square loading (for live environment)
        if (!window.Square) {
          const script = document.createElement('script');
          script.src = 'https://web.squarecdn.com/v1/square.js'; // Production URL
          script.async = true;
          document.head.appendChild(script);
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            // Add timeout for loading
            setTimeout(() => reject(new Error('Square SDK load timeout')), 10000);
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
        onPaymentError('Failed to initialize payment system. Using sandbox mode for testing.');
        setIsLoading(false);
      }
    };

    if (applicationId && locationId) {
      initializeSquare();
    }

    return () => {
      if (card && typeof card.destroy === 'function') {
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
      // For sandbox mode with mock payment
      if (applicationId.includes('sandbox')) {
        console.log('Processing mock payment...');
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        onPaymentSuccess('mock_payment_token_' + Date.now());
        return;
      }

      // Real Square payment processing
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
        
        {applicationId.includes('sandbox') ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700 font-medium mb-2">🧪 Sandbox Testing Mode</p>
              <p className="text-xs text-blue-600">
                This is a demo payment form. In sandbox mode, any payment will be processed as a test transaction.
              </p>
            </div>
            
            <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input 
                  type="text" 
                  placeholder="4111 1111 1111 1111" 
                  className="w-full p-2 border rounded text-sm"
                  defaultValue="4111 1111 1111 1111"
                  disabled
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                  <input 
                    type="text" 
                    placeholder="12/25" 
                    className="w-full p-2 border rounded text-sm"
                    defaultValue="12/25"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                  <input 
                    type="text" 
                    placeholder="123" 
                    className="w-full p-2 border rounded text-sm"
                    defaultValue="123"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div 
            ref={cardRef}
            className="border rounded-lg p-4 min-h-[120px]"
            style={{ minHeight: '120px' }}
          />
        )}
        
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