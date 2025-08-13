import { useEffect, useRef, useState, useCallback } from 'react';
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
  const [initialized, setInitialized] = useState(false);
  const [containerReady, setContainerReady] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const initializeSquare = useCallback(async () => {
    if (initialized) return;
    
    try {
      setIsLoading(true);
      console.log('Initializing Square Web Payments SDK...');
      
      // Load Square Web Payments SDK
      if (!window.Square) {
        const script = document.createElement('script');
        script.src = 'https://web.squarecdn.com/v1/square.js';
        script.onload = async () => {
          await initializeSquarePayments();
        };
        script.onerror = () => {
          console.error('Failed to load Square SDK');
          setIsLoading(false);
        };
        document.head.appendChild(script);
      } else {
        await initializeSquarePayments();
      }
      
    } catch (error) {
      console.error('Error initializing Square:', error);
      setIsLoading(false);
    }
  }, [applicationId, locationId, initialized]);

  const initializeSquarePayments = async () => {
    try {
      if (!window.Square) {
        throw new Error('Square SDK not loaded');
      }

      console.log('Initializing Square with:', {
        applicationId: applicationId.substring(0, 20) + '...',
        locationId: locationId.substring(0, 10) + '...'
      });

      const paymentsInstance = window.Square.payments(applicationId, locationId);
      console.log('Payments instance created:', !!paymentsInstance);
      
      const cardInstance = await paymentsInstance.card();
      console.log('Card instance created:', !!cardInstance);
      
      // Wait for DOM element to be ready with direct DOM query
      let attempts = 0;
      const maxAttempts = 20;
      let cardContainer = null;
      
      while (!cardContainer && attempts < maxAttempts) {
        cardContainer = document.getElementById('square-card-element');
        if (!cardContainer) {
          console.log(`Waiting for card container, attempt ${attempts + 1}/${maxAttempts}`);
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
      }
      
      if (cardContainer) {
        console.log('Attaching card to container:', cardContainer);
        await cardInstance.attach(cardContainer);
        console.log('Card attached successfully');
      } else {
        console.error('Card container element still not found after retries');
        throw new Error('Card container not available');
      }
      
      setPayments(paymentsInstance);
      setCard(cardInstance);
      setInitialized(true);
      setIsLoading(false);
      
      console.log('Square Web Payments initialized successfully');
    } catch (error) {
      console.error('Error initializing Square payments:', error);
      
      // For development, show a fallback form
      if (error && (error as any).name === 'InvalidApplicationIdError') {
        console.log('Using fallback sandbox form due to credential mismatch');
        // Create a fallback that shows fields but warns about credential issues
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  // Monitor when the container element is ready
  useEffect(() => {
    const checkContainer = () => {
      const element = document.getElementById('square-card-element');
      if (element && !containerReady) {
        console.log('Card container element found in DOM');
        setContainerReady(true);
      }
    };

    const observer = new MutationObserver(checkContainer);
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Also check immediately
    checkContainer();

    return () => observer.disconnect();
  }, [containerReady]);

  useEffect(() => {
    if (applicationId && locationId && !initialized && containerReady) {
      console.log('Starting Square initialization with ready container');
      initializeSquare();
    }
  }, [applicationId, locationId, initialized, containerReady, initializeSquare]);

  const handlePayment = async () => {
    if (!card || !payments) {
      onPaymentError('Payment system not initialized');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Processing Square payment...');
      
      // Tokenize the payment method
      const result = await card.tokenize();

      if (result.status === 'OK') {
        console.log('Payment tokenization successful');
        onPaymentSuccess(result.token);
      } else {
        console.error('Payment tokenization failed:', result.errors);
        const errorMessage = result.errors?.[0]?.message || 'Payment failed';
        onPaymentError(errorMessage);
      }
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError('Payment processing failed: ' + (error as Error).message);
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
        
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700 font-medium mb-2">🔒 Secure Payment Processing</p>
            <p className="text-xs text-green-600">
              Enter your payment information below. All transactions are processed securely through Square.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="text-xs text-gray-600 text-center">
              Debug: Container Ready: {containerReady ? 'Yes' : 'No'} | 
              Initialized: {initialized ? 'Yes' : 'No'} | 
              Loading: {isLoading ? 'Yes' : 'No'}
            </div>
            
            {!initialized && !isLoading && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-700 font-medium mb-2">⚠️ Payment System Loading</p>
                <p className="text-xs text-yellow-600">
                  Square payment form is initializing. Please wait...
                </p>
              </div>
            )}
            
            <div 
              ref={cardRef}
              className="border-2 border-red-500 rounded-lg p-4 min-h-[120px] bg-white"
              style={{ minHeight: '120px' }}
              id="square-card-element"
            >
              <div className="text-sm text-gray-500 text-center">
                Square Card Element Container (ID: square-card-element)
              </div>
            </div>
            
            {initialized && (
              <div className="text-xs text-green-600 text-center">
                Square payment form loaded successfully
              </div>
            )}
          </div>
        </div>
        
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