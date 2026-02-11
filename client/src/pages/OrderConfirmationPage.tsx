import { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { squareService, OrderResponse } from '@/services/squareService';
import { CheckCircle, Clock, MapPin, Phone, ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';
import SEOHead from '@/components/SEOHead';
import { useToast } from '@/hooks/use-toast';

export default function OrderConfirmationPage() {
  const [match, params] = useRoute('/order-confirmation/:orderId');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (match && params?.orderId) {
      fetchOrder(params.orderId);
    } else {
      setLocation('/');
    }
  }, [match, params?.orderId, setLocation]);

  const fetchOrder = async (orderId: string) => {
    try {
      const orderData = await squareService.getOrder(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      toast({
        title: 'Order Not Found',
        description: 'Unable to load order details. Please contact us if you need assistance.',
        variant: 'destructive',
      });
      setLocation('/');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading order details...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={`Order Confirmation #${order.orderId} - Jealous Fork`}
        description="Your order has been confirmed. Thank you for choosing Jealous Fork!"
        canonical={`https://www.jealousfork.com/order-confirmation/${order.orderId}`}
      />
      
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          {/* Order Success */}
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
              <p className="text-gray-600 mb-4">
                Thank you for your order. We're preparing your delicious meal now.
              </p>
              <div className="text-3xl font-bold text-green-600">
                Order #{order.orderId}
              </div>
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Order Status
                <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                  {getStatusIcon(order.status)}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.estimatedReadyTime && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  Estimated ready time: {new Date(order.estimatedReadyTime).toLocaleTimeString()}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Details */}
          {order.items && order.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start border-b pb-2 last:border-b-0">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>${order.tax?.toFixed(2) || '0.00'}</span>
                  </div>
                  {order.deliveryFee && order.deliveryFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee:</span>
                      <span>${order.deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Type & Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {order.orderType === 'pickup' ? 'Pickup' : 'Delivery'} Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.orderType === 'pickup' ? (
                <div>
                  <p className="font-medium mb-2">Pickup Location:</p>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Jealous Fork</p>
                    <p>14417 SW 42nd St</p>
                    <p>Miami, FL 33175</p>
                    <a href="tel:(305)699-1430" className="text-blue-600 hover:text-blue-800">
                      (305) 699-1430
                    </a>
                  </div>
                </div>
              ) : (
                order.deliveryInfo && (
                  <div>
                    <p className="font-medium mb-2">Delivery Address:</p>
                    <div className="text-sm text-gray-600">
                      <p>{order.deliveryInfo.address}</p>
                      <p>{order.deliveryInfo.city}, {order.deliveryInfo.state} {order.deliveryInfo.zipCode}</p>
                      {order.deliveryInfo.phone && (
                        <p>Phone: {order.deliveryInfo.phone}</p>
                      )}
                      {order.deliveryInfo.notes && (
                        <p className="mt-2"><strong>Notes:</strong> {order.deliveryInfo.notes}</p>
                      )}
                    </div>
                  </div>
                )
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          {order.customerInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p><strong>Name:</strong> {order.customerInfo.name}</p>
                  <p><strong>Email:</strong> {order.customerInfo.email}</p>
                  <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  If you have any questions about your order, please call us:
                </p>
                <a 
                  href="tel:(305)699-1430" 
                  className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                >
                  (305) 699-1430
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button 
              onClick={() => setLocation('/menu')} 
              variant="outline" 
              className="flex-1"
            >
              Order Again
            </Button>
            <Button 
              onClick={() => setLocation('/')} 
              className="flex-1"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}