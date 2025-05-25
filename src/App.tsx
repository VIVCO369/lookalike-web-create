import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TradingRulesPage from "./pages/TradingRulesPage";
import SchedulePage from "./pages/SchedulePage";
import TradesPage from "./pages/TradesPage";
import SettingsPage from "./pages/SettingsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import TradeGoalsPage from "./pages/TradeGoalsPage";
import TradeToolsPage from "./pages/TradeToolsPage";
import TradeSummaryPage from "./pages/TradeSummaryPage";
import TradeHistoryPage from "./pages/TradeHistoryPage";
import DailyTradesPage from "./pages/DailyTradesPage";
import ThirtyDayTradePage from "./pages/ThirtyDayTradePage";
import TradeManageGoalsPage from "./pages/TradeManageGoalsPage";
import TradeManageTargetPage from "./pages/TradeManageTargetPage";
import NotFound from "./pages/NotFound";
import { TradeDataProvider } from "./contexts/TradeDataContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TradeDataProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/trading-rules" element={<TradingRulesPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/trades" element={<TradesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/trade-goals" element={<TradeGoalsPage />} />
            <Route path="/trade-tools" element={<TradeToolsPage />} />
            <Route path="/trade-manage/goals" element={<TradeManageGoalsPage />} />
            <Route path="/trade-manage/target" element={<TradeManageTargetPage />} />
            <Route path="/trade-challenge/daily-trades" element={<DailyTradesPage />} />
            <Route path="/trade-challenge/30-day-trade" element={<ThirtyDayTradePage />} />
            <Route path="/trade-analytics/summary" element={<TradeSummaryPage />} />
            <Route path="/trade-analytics/history" element={<TradeHistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TradeDataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
