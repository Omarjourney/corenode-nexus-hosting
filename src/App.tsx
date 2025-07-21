import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import HomePage from "./pages/HomePage";
import MinecraftPage from "./pages/MinecraftPage";
import GameServersPage from "./pages/GameServersPage";
import VoiceServersPage from "./pages/VoiceServersPage";
import WebHostingPage from "./pages/WebHostingPage";
import VpsDedicatedPage from "./pages/VpsDedicatedPage";
import BlogIndex from "./pages/BlogIndex";
import BlogPostPage from "./pages/BlogPostPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/minecraft" element={<MinecraftPage />} />
            <Route path="/game-servers" element={<GameServersPage />} />
            <Route path="/voice-servers" element={<VoiceServersPage />} />
            <Route path="/web-hosting" element={<WebHostingPage />} />
          <Route path="/vps-dedicated" element={<VpsDedicatedPage />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
