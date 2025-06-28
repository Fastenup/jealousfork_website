import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import StructuredData from "@/components/StructuredData";
import Home from "@/pages/Home";
import MenuPage from "@/pages/MenuPage";
import FullMenuPage from "@/pages/FullMenuPage";
import LocalPage from "@/pages/LocalPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/menu/:slug?" component={MenuPage} />
      <Route path="/full-menu" component={FullMenuPage} />
      <Route path="/near/:area" component={LocalPage} />
      <Route path="/gallery" component={Home} />
      <Route path="/about" component={Home} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route component={Home} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <StructuredData />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
