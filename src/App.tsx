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
// Removed AnalyticsPage import
import TradeGoalsPage from "./pages/TradeGoalsPage"; // This page will now be the main Trade Goals page
import TradeToolsPage from "./pages/TradeToolsPage";
import TradeSummaryPage from "./pages/TradeSummaryPage";
import TradeHistoryPage from "./pages/TradeHistoryPage";
import DailyTradesPage from "./pages/DailyTradesPage";
import ThirtyDayTradePage from "./pages/ThirtyDayTradePage";
import TradeManageGoalsPage from "./pages/TradeManageGoalsPage"; // This page will be renamed/repurposed for managing goals
import TradeManageTargetPage from "./pages/TradeManageTargetPage"; // This page will be renamed/repurposed for managing targets
import ThirtyDaysProfitsPage from "./pages/TradeGoals/ThirtyDaysProfitsPage"; // Import new page from correct directory
import ThirtyDaysTargetPage from "./pages/TradeGoals/ThirtyDaysTargetPage"; // Import new page from correct directory
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
            {/* Removed AnalyticsPage route */}
            {/* Updated Trade Goals routes */}
            <Route path="/trade-goals" element={<TradeGoalsPage />} /> {/* Main Trade Goals page */}
            <Route path="/trade-goals/30-days-profits" element={<ThirtyDaysProfitsPage />} /> {/* Moved route */}
            <Route path="/trade-goals/target" element={<ThirtyDaysTargetPage />} /> {/* Moved route and linked to ThirtyDaysTargetPage */}

            {/* Trade Manage routes */}
            <Route path="/trade-manage/goals" element={<TradeManageGoalsPage />} /> {/* Moved route */}
            <Route path="/trade-manage/target" element={<TradeManageTargetPage />} /> {/* Moved route */}


            <Route path="/trade-tools" element={<TradeToolsPage />} />
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
