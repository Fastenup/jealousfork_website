import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import StructuredData from "@/components/StructuredData";
import { CartProvider } from "@/contexts/CartContext";
import Home from "@/pages/Home";
import MenuPage from "@/pages/MenuPage";
import FullMenuPage from "@/pages/FullMenuPage";
import LocalPage from "@/pages/LocalPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import ProfessionalAdminPage from "@/pages/ProfessionalAdminPage";
import BurgersPage from "@/pages/BurgersPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/burgers" component={BurgersPage} />
      <Route path="/menu/:slug?" component={FullMenuPage} />
      <Route path="/full-menu" component={FullMenuPage} />
      <Route path="/near/:area" component={LocalPage} />
      <Route path="/gallery" component={Home} />
      <Route path="/about" component={Home} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/order-confirmation/:orderId" component={OrderConfirmationPage} />
      <Route path="/admin" component={ProfessionalAdminPage} />
      <Route component={Home} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <StructuredData />
          <Toaster />
          <Router />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
