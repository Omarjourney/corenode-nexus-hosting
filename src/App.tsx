import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import HomePage from "./pages/HomePage";
import MinecraftPage from "./pages/MinecraftPage";
import GameServersPage from "./pages/GameServersPage";
import ServerOrderPage from "./pages/ServerOrderPage";
import VoiceServersPage from "./pages/VoiceServersPage";
import WebHostingPage from "./pages/WebHostingPage";
import VpsPage from "./pages/VpsPage";
import DedicatedPage from "./pages/DedicatedPage";
import CheckoutPage from "./pages/CheckoutPage";
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
          <Route path="/web-hosting/checkout" element={<CheckoutPage title="Web Hosting" />} />
          <Route path="/vps" element={<VpsPage />} />
          <Route path="/vps/checkout" element={<CheckoutPage title="VPS" />} />
          <Route path="/dedicated" element={<DedicatedPage />} />
          <Route path="/dedicated/checkout" element={<CheckoutPage title="Dedicated" />} />
          <Route path="/vps-dedicated" element={<VpsDedicatedPage />} />
          <Route path="/order" element={<ServerOrderPage />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
