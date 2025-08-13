import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import SquarePaymentNew from '@/components/SquarePaymentNew';
import { squareService, OrderRequest } from '@/services/squareService';
import { ArrowLeft, MapPin, Clock, Phone } from 'lucide-react';
import Navigation from '@/components/Navigation';
import SEOHead from '@/components/SEOHead';

export default function CheckoutPage() {
  const { state: cartState, clearCart, setDeliveryFee } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    city: 'Miami',
    state: 'FL',
    zipCode: '',
    phone: '',
    deliveryNotes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasRedirected = useRef(false);

  // Square credentials - get from environment or use production defaults
  const SQUARE_APPLICATION_ID = 'sq0idp-Tv7vHFlv14KExKQf_KAgJA';
  const SQUARE_LOCATION_ID = 'LWMD4B2R5DZ6J';
  


  useEffect(() => {
    // Set delivery fee based on order type
    if (orderType === 'delivery') {
      setDeliveryFee(4.99); // $4.99 delivery fee
    } else {
      setDeliveryFee(0);
    }
  }, [orderType]); // Remove setDeliveryFee from deps to prevent infinite loop

  useEffect(() => {
    // Allow time for cart to load, then check if empty
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (cartState.items.length === 0 && !hasRedirected.current) {
        hasRedirected.current = true;
        setLocation('/full-menu');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [cartState.items.length, setLocation]);

  const validateForm = () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all customer information fields.',
        variant: 'destructive',
      });
      return false;
    }

    if (orderType === 'delivery') {
      if (!deliveryInfo.address || !deliveryInfo.zipCode) {
        toast({
          title: 'Missing Delivery Information',
          description: 'Please provide delivery address and zip code.',
          variant: 'destructive',
        });
        return false;
      }
    }

    return true;
  };

  const handleContinueToPayment = () => {
    if (validateForm()) {
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = async (paymentToken: string) => {
    setIsSubmitting(true);
    
    try {
      const orderData: OrderRequest = {
        items: cartState.items,
        subtotal: cartState.subtotal,
        tax: cartState.tax,
        deliveryFee: cartState.deliveryFee,
        total: cartState.total,
        customerInfo,
        deliveryInfo: orderType === 'delivery' ? deliveryInfo : undefined,
        orderType,
        paymentToken,
      };

      const response = await squareService.createOrder(orderData);
      
      toast({
        title: 'Order Placed Successfully!',
        description: `Your order #${response.orderId} has been confirmed.`,
      });

      clearCart();
      setLocation(`/order-confirmation/${response.orderId}`);
    } catch (error) {
      console.error('Order submission failed:', error);
      toast({
        title: 'Order Failed',
        description: 'There was an issue processing your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: 'Payment Error',
      description: error,
      variant: 'destructive',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading checkout...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartState.items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Checkout - Jealous Fork"
        description="Complete your order for delivery or pickup from Jealous Fork"
        canonical="https://jealousfork.com/checkout"
      />
      
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/full-menu')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            {!showPayment ? (
              <>
                {/* Order Type Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={orderType} onValueChange={(value: 'pickup' | 'delivery') => setOrderType(value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <Label htmlFor="pickup" className="flex items-center gap-2 cursor-pointer">
                          <MapPin className="h-4 w-4" />
                          Pickup (Ready in 15-20 minutes)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <Label htmlFor="delivery" className="flex items-center gap-2 cursor-pointer">
                          <Clock className="h-4 w-4" />
                          Delivery (45-60 minutes) - $4.99 fee
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    {orderType === 'pickup' && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Pickup Location:</h4>
                        <p className="text-sm text-gray-600">
                          14417 SW 42nd St<br />
                          Miami, FL 33175<br />
                          (305) 699-1430
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(305) 555-0123"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Information */}
                {orderType === 'delivery' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Delivery Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="address">Street Address *</Label>
                        <Input
                          id="address"
                          value={deliveryInfo.address}
                          onChange={(e) => setDeliveryInfo(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="123 Main Street"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={deliveryInfo.city}
                            onChange={(e) => setDeliveryInfo(prev => ({ ...prev, city: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">Zip Code *</Label>
                          <Input
                            id="zipCode"
                            value={deliveryInfo.zipCode}
                            onChange={(e) => setDeliveryInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                            placeholder="33175"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="deliveryNotes">Delivery Notes (Optional)</Label>
                        <Textarea
                          id="deliveryNotes"
                          value={deliveryInfo.deliveryNotes}
                          onChange={(e) => setDeliveryInfo(prev => ({ ...prev, deliveryNotes: e.target.value }))}
                          placeholder="Building, apartment, or special instructions..."
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button onClick={handleContinueToPayment} className="w-full" size="lg">
                  Continue to Payment
                </Button>
              </>
            ) : (
              <SquarePaymentNew
                amount={cartState.total}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                applicationId={SQUARE_APPLICATION_ID}
                locationId={SQUARE_LOCATION_ID}
              />
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartState.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${cartState.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${cartState.tax.toFixed(2)}</span>
                  </div>
                  
                  {cartState.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>${cartState.deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${cartState.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}