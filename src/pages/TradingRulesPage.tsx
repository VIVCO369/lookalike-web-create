import { LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "../components/Sidebar";
import TradingRules from "../components/TradingRules";
import { useState, useEffect } from "react"; // Import useEffect
import { cn } from "@/lib/utils"; // Import cn utility

const TradingRulesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date()); // Add state for current date/time

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Update the current date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Helper function to format the date
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Helper function to format the time
  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    return date.toLocaleTimeString('en-US', options);
  };


  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F5F0" }}> {/* Added inline style */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}> {/* Added dynamic padding */}
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-gray-500" />
            <h1 className="text-xl font-medium text-gray-700">Trading Rules</h1>
          </div>
          {/* Display current date and time */}
          <div>
            <p className="text-black text-sm font-bold">{formatDate(currentDateTime)}</p>
            <p className="text-green-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
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
