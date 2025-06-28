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
        canonical={`https://jealousfork.com/order-confirmation/${order.orderId}`}
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
              
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 text-gray-500" />
                <div className="text-sm">
                  <p className="font-medium">Jealous Fork</p>
                  <p className="text-gray-600">
                    14417 SW 42nd St<br />
                    Miami, FL 33175
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Total */}
          <Card>
            <CardHeader>
              <CardTitle>Order Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${order.total.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Payment confirmed
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button 
              onClick={() => setLocation('/full-menu')} 
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