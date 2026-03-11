import { Toaster } from "./Components/ui/toaster";
import { Toaster as Sonner } from "./Components/ui/sonner";
import { TooltipProvider } from "./Components/ui/tootip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {  Routes, Route, HashRouter } from "react-router-dom";
import Index from "./pages/index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
