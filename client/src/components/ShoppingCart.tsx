import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, ShoppingCart as CartIcon, Trash2, X } from 'lucide-react';

interface ShoppingCartProps {
  onCheckout?: () => void;
}

export default function ShoppingCart({ onCheckout }: ShoppingCartProps) {
  const { state, updateQuantity, removeItem, toggleCart, setCartOpen, itemCount } = useCart();

  return (
    <Sheet open={state.isOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <CartIcon className="h-4 w-4" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <CartIcon className="h-5 w-5" />
            Your Order ({itemCount} items)
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-[calc(100vh-120px)] mt-6">
          {state.items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <CartIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-2">Add some delicious items to get started!</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                {state.items.map((item) => {
                  // Calculate item total including modifier prices
                  const modifierTotal = (item.modifiers || []).reduce((sum, m) => sum + m.price, 0);
                  const itemUnitPrice = item.price + modifierTotal;
                  const cartLineKey = item.cartLineId || String(item.id);

                  return (
                    <Card key={cartLineKey} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          {/* Show selected modifiers */}
                          {item.modifiers && item.modifiers.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              {item.modifiers.map(m => (
                                <span key={m.id} className="block">
                                  + {m.name}{m.price > 0 ? ` ($${m.price.toFixed(2)})` : ''}
                                </span>
                              ))}
                            </div>
                          )}
                          {/* Show special instructions */}
                          {item.specialInstructions && (
                            <p className="text-xs text-gray-400 italic mt-1">
                              Note: {item.specialInstructions}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 mt-1">${itemUnitPrice.toFixed(2)} each</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(cartLineKey, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(cartLineKey, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(cartLineKey)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-3 border-t">
                        <span className="text-sm text-gray-600">Subtotal:</span>
                        <span className="font-medium">${(itemUnitPrice * item.quantity).toFixed(2)}</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
              
              <div className="flex-shrink-0 border-t pt-4 space-y-2 bg-white">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${state.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Tax (7.5%):</span>
                  <span>${state.tax.toFixed(2)}</span>
                </div>
                
                {state.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee:</span>
                    <span>${state.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  size="lg"
                  onClick={() => {
                    setCartOpen(false);
                    onCheckout?.();
                  }}
                  disabled={state.items.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}