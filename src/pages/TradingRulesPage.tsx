
import { LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "../components/Sidebar";
import TradingRules from "../components/TradingRules";
import { useState } from "react";

const TradingRulesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-gray-500" />
            <h1 className="text-xl font-medium text-gray-700">Trading Rules</h1>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Wednesday, May 21, 2025</p>
            <p className="text-gray-500 text-xs">04:51:25 PM</p>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <TradingRules />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TradingRulesPage;
