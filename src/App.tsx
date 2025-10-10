import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Portfolio from "./pages/Portfolio";
import Bridge from "./pages/Bridge";
import Swap from "./pages/Swap";
import Claim from "./pages/Claim";
import Transactions from "./pages/Transactions";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const App = () => (
  <ThemeProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/bridge" element={<Bridge />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/claim" element={<Claim />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/auth" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
