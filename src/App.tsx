import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Portfolio from "./pages/Portfolio";
import Bridge from "./pages/Bridge";
import Swap from "./pages/Swap";
import Claim from "./pages/Claim";
import Transactions from "./pages/Transactions";
import Auth from "./pages/Auth";
import DePIN from "./pages/DePIN";
import NotFound from "./pages/NotFound";
import DocsLayout from "./pages/DocsLayout";
import AIGettingStarted from "./pages/docs/AIGettingStarted";
import AIFeatures from "./pages/docs/AIFeatures";
import AIChatGuide from "./pages/docs/AIChatGuide";
import DePINGettingStarted from "./pages/docs/DePINGettingStarted";
import DePINBenefits from "./pages/docs/DePINBenefits";
import DePINWormhole from "./pages/docs/DePINWormhole";
import DePINEconomics from "./pages/docs/DePINEconomics";
import DePINAdvanced from "./pages/docs/DePINAdvanced";
import DEPINFAQ from "./pages/docs/DePINFAQ";

const App = () => {
  return (
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
            <Route path="/depin" element={<DePIN />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Documentation with Sidebar */}
            <Route path="/docs" element={<DocsLayout />}>
              {/* Default redirect to AI Getting Started */}
              <Route index element={<Navigate to="/docs/ai/getting-started" replace />} />
              
              {/* AI Assistant Section */}
              <Route path="ai/getting-started" element={<AIGettingStarted />} />
              <Route path="ai/features" element={<AIFeatures />} />
              <Route path="ai/chat" element={<AIChatGuide />} />
              
              {/* DePIN Network Section */}
              <Route path="depin/getting-started" element={<DePINGettingStarted />} />
              <Route path="depin/benefits" element={<DePINBenefits />} />
              <Route path="depin/wormhole" element={<DePINWormhole />} />
              <Route path="depin/economics" element={<DePINEconomics />} />
              <Route path="depin/advanced" element={<DePINAdvanced />} />
              <Route path="depin/faq" element={<DEPINFAQ />} />
            </Route>
            
            {/* Redirect old DePIN docs route */}
            <Route path="/depin-docs" element={<Navigate to="/docs/depin/getting-started" replace />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
