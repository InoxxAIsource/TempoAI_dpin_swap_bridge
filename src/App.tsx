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
import Profile from "./pages/Profile";
import DePIN from "./pages/DePIN";
import NotFound from "./pages/NotFound";
import DocsLayout from "./pages/DocsLayout";
import AIGettingStarted from "./pages/docs/AIGettingStarted";
import AIFeatures from "./pages/docs/AIFeatures";
import AIChatGuide from "./pages/docs/AIChatGuide";
import AITechnical from "./pages/docs/AITechnical";
import AIUseCases from "./pages/docs/AIUseCases";
import AIAgentGettingStarted from "./pages/docs/AIAgentGettingStarted";
import AIAgentArchitecture from "./pages/docs/AIAgentArchitecture";
import AIAgentModels from "./pages/docs/AIAgentModels";
import AIAgentWormhole from "./pages/docs/AIAgentWormhole";
import APIOverview from "./pages/docs/APIOverview";
import APIAuthentication from "./pages/docs/APIAuthentication";
import APIUserManagement from "./pages/docs/APIUserManagement";
import APIDePIN from "./pages/docs/APIDePIN";
import APIBridgeSwap from "./pages/docs/APIBridgeSwap";
import APIRateLimits from "./pages/docs/APIRateLimits";
import APISDKReference from "./pages/docs/APISDKReference";
import DePINGettingStarted from "./pages/docs/DePINGettingStarted";
import DePINDeviceSetup from "./pages/docs/DePINDeviceSetup";
import DePINBenefits from "./pages/docs/DePINBenefits";
import DePINWormhole from "./pages/docs/DePINWormhole";
import DePINEconomics from "./pages/docs/DePINEconomics";
import DePINAdvanced from "./pages/docs/DePINAdvanced";
import DEPINFAQ from "./pages/docs/DePINFAQ";
import BridgeGettingStarted from "./pages/docs/BridgeGettingStarted";
import BridgeHowItWorks from "./pages/docs/BridgeHowItWorks";
import BridgeNetworks from "./pages/docs/BridgeNetworks";
import BridgeAdvanced from "./pages/docs/BridgeAdvanced";
import SwapGettingStarted from "./pages/docs/SwapGettingStarted";
import SwapHowItWorks from "./pages/docs/SwapHowItWorks";
import SwapBestPractices from "./pages/docs/SwapBestPractices";

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
            <Route path="/profile" element={<Profile />} />
            
            {/* Documentation with Sidebar */}
            <Route path="/docs" element={<DocsLayout />}>
              {/* Default redirect to AI Getting Started */}
              <Route index element={<Navigate to="/docs/ai/getting-started" replace />} />
              
              {/* AI Assistant Section */}
              <Route path="ai/getting-started" element={<AIGettingStarted />} />
              <Route path="ai/features" element={<AIFeatures />} />
              <Route path="ai/chat" element={<AIChatGuide />} />
              <Route path="ai/technical" element={<AITechnical />} />
              <Route path="ai/use-cases" element={<AIUseCases />} />
              
              {/* AI Agent Builder Section */}
              <Route path="ai-agent/getting-started" element={<AIAgentGettingStarted />} />
              <Route path="ai-agent/architecture" element={<AIAgentArchitecture />} />
              <Route path="ai-agent/ai-models" element={<AIAgentModels />} />
              <Route path="ai-agent/wormhole" element={<AIAgentWormhole />} />
              
              {/* DePIN Network Section */}
              <Route path="depin/getting-started" element={<DePINGettingStarted />} />
              <Route path="depin/device-setup" element={<DePINDeviceSetup />} />
              <Route path="depin/benefits" element={<DePINBenefits />} />
              <Route path="depin/wormhole" element={<DePINWormhole />} />
              <Route path="depin/economics" element={<DePINEconomics />} />
              <Route path="depin/advanced" element={<DePINAdvanced />} />
              <Route path="depin/faq" element={<DEPINFAQ />} />
              
              {/* Cross-Chain Tools: Bridge Section */}
              <Route path="bridge/getting-started" element={<BridgeGettingStarted />} />
              <Route path="bridge/how-it-works" element={<BridgeHowItWorks />} />
              <Route path="bridge/networks" element={<BridgeNetworks />} />
              <Route path="bridge/advanced" element={<BridgeAdvanced />} />
              
              {/* Cross-Chain Tools: Swap Section */}
              <Route path="swap/getting-started" element={<SwapGettingStarted />} />
              <Route path="swap/how-it-works" element={<SwapHowItWorks />} />
              <Route path="swap/best-practices" element={<SwapBestPractices />} />
              
              {/* API Documentation Section */}
              <Route path="api/overview" element={<APIOverview />} />
              <Route path="api/authentication" element={<APIAuthentication />} />
              <Route path="api/user-management" element={<APIUserManagement />} />
              <Route path="api/depin" element={<APIDePIN />} />
              <Route path="api/bridge-swap" element={<APIBridgeSwap />} />
              <Route path="api/rate-limits" element={<APIRateLimits />} />
              <Route path="api/sdk" element={<APISDKReference />} />
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
