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
        console.log('Initializing Square payments with ID:', applicationId, 'Location:', locationId);
        
        // Wait for DOM to be ready
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Clear any existing Square card instance
        if ((window as any).squareCard) {
          try {
            await (window as any).squareCard.destroy();
          } catch (e) {
            console.log('No existing card to destroy');
          }
        }
        
        // Check if container exists
        const container = document.getElementById('square-card-form');
        if (!container) {
          console.error('Square container not found in DOM');
          throw new Error('Square container not found');
        }
        
        console.log('Container found, initializing Square payments...');
        
        // Initialize payments
        const payments = window.Square.payments(applicationId, locationId);
        console.log('Square payments object created');
        
        // Create card payment method
        const card = await payments.card({
          style: {
            '.input-container': {
              borderColor: '#d1d5db',
              borderRadius: '6px',
            },
            '.input-container.is-focus': {
              borderColor: '#3b82f6',
            },
            '.input-container.is-error': {
              borderColor: '#ef4444',
            },
            '.message-text': {
              color: '#ef4444',
            },
            '.message-icon': {
              color: '#ef4444',
            },
            '.message-text.is-success': {
              color: '#10b981',
            },
            '.message-icon.is-success': {
              color: '#10b981',
            },
          }
        });
        console.log('Square card object created');
        
        // Clear container first
        container.innerHTML = '';
        
        // Attach to the card container
        await card.attach('#square-card-form');
        console.log('Square payment form attached successfully');
        
        // Store card instance for payment processing
        (window as any).squareCard = card;
        
      } catch (error) {
        console.error('Square initialization error:', error);
        onPaymentError(`Payment form initialization failed: ${error.message}`);
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
      
      // Required verification details for production tokenization
      const verificationDetails = {
        intent: 'CHARGE',
        amount: Math.round(amount * 100).toString(), // Amount in smallest currency unit (cents)
        currencyCode: 'USD', // Required currency code
        customerInitiated: true, // Required boolean field
        sellerKeyedIn: false, // Required boolean field
        billingContact: {
          givenName: 'Customer', // Required for production
          familyName: 'Customer',
          email: 'customer@jealousfork.com',
          phone: '3051234567',
          addressLines: ['123 Main St'],
          city: 'Miami',
          state: 'FL',
          countryCode: 'US',
          postalCode: '33101',
        },
      };
      
      const result = await card.tokenize(verificationDetails);
      
      if (result.status === 'OK') {
        console.log('Payment tokenized successfully with token:', result.token.substring(0, 20) + '...');
        onPaymentSuccess(result.token);
      } else {
        let errorMessage = 'Payment failed';
        if (result.errors) {
          errorMessage = result.errors.map((error: any) => error.message || error.detail).join(', ');
        }
        console.error('Tokenization failed:', result.errors);
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
          className="min-h-[150px] p-4 border border-gray-300 rounded-md bg-white"
          style={{ position: 'relative', zIndex: 1 }}
        >
          {!squareLoaded && (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              <span className="ml-2 text-gray-600">Loading payment form...</span>
            </div>
          )}
        </div>
        
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