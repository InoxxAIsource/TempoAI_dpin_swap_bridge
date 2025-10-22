import { useState, useEffect, lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Eager load only critical pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";

// Lazy load all other pages for faster initial load
const Chat = lazy(() => import("./pages/Chat"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Bridge = lazy(() => import("./pages/Bridge"));
const Swap = lazy(() => import("./pages/Swap"));
const Claim = lazy(() => import("./pages/Claim"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Profile = lazy(() => import("./pages/Profile"));
const DePIN = lazy(() => import("./pages/DePIN"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DocsLayout = lazy(() => import("./pages/DocsLayout"));
const AIGettingStarted = lazy(() => import("./pages/docs/AIGettingStarted"));
const AIFeatures = lazy(() => import("./pages/docs/AIFeatures"));
const AIChatGuide = lazy(() => import("./pages/docs/AIChatGuide"));
const AITechnical = lazy(() => import("./pages/docs/AITechnical"));
const AIUseCases = lazy(() => import("./pages/docs/AIUseCases"));
const AIAgentGettingStarted = lazy(() => import("./pages/docs/AIAgentGettingStarted"));
const AIAgentArchitecture = lazy(() => import("./pages/docs/AIAgentArchitecture"));
const AIAgentModels = lazy(() => import("./pages/docs/AIAgentModels"));
const AIAgentWormhole = lazy(() => import("./pages/docs/AIAgentWormhole"));
const APIOverview = lazy(() => import("./pages/docs/APIOverview"));
const APIAuthentication = lazy(() => import("./pages/docs/APIAuthentication"));
const APIUserManagement = lazy(() => import("./pages/docs/APIUserManagement"));
const APIDePIN = lazy(() => import("./pages/docs/APIDePIN"));
const APIBridgeSwap = lazy(() => import("./pages/docs/APIBridgeSwap"));
const APIRateLimits = lazy(() => import("./pages/docs/APIRateLimits"));
const APISDKReference = lazy(() => import("./pages/docs/APISDKReference"));
const DePINGettingStarted = lazy(() => import("./pages/docs/DePINGettingStarted"));
const DePINDeviceSetup = lazy(() => import("./pages/docs/DePINDeviceSetup"));
const DePINBenefits = lazy(() => import("./pages/docs/DePINBenefits"));
const DePINWormhole = lazy(() => import("./pages/docs/DePINWormhole"));
const DePINEconomics = lazy(() => import("./pages/docs/DePINEconomics"));
const DePINAdvanced = lazy(() => import("./pages/docs/DePINAdvanced"));
const DEPINFAQ = lazy(() => import("./pages/docs/DePINFAQ"));
const BridgeGettingStarted = lazy(() => import("./pages/docs/BridgeGettingStarted"));
const BridgeHowItWorks = lazy(() => import("./pages/docs/BridgeHowItWorks"));
const BridgeNetworks = lazy(() => import("./pages/docs/BridgeNetworks"));
const BridgeAdvanced = lazy(() => import("./pages/docs/BridgeAdvanced"));
const SwapGettingStarted = lazy(() => import("./pages/docs/SwapGettingStarted"));
const SwapHowItWorks = lazy(() => import("./pages/docs/SwapHowItWorks"));
const SwapBestPractices = lazy(() => import("./pages/docs/SwapBestPractices"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
      <p className="text-sm text-muted-foreground">Loading page...</p>
    </div>
  </div>
);

const App = () => {
  const [providersReady, setProvidersReady] = useState(false);

  useEffect(() => {
    // Give providers time to initialize
    const timer = setTimeout(() => setProvidersReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!providersReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-lg text-muted-foreground">Initializing Tempo...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
