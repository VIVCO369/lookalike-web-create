import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { DollarSign } from "lucide-react";
import AnimatedContainer from "@/components/AnimatedContainer";

const ThirtyDaysProfitsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="p-6">
          <AnimatedContainer>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">30 Days Profits</h1>
              <p className="text-gray-600">Track your profit performance over the last 30 days.</p>
            </div>
          </AnimatedContainer>

          {/* Add your content for 30 Days Profits here */}
          <AnimatedContainer delay={0.2}>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <DollarSign className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-xl text-gray-700">Content for 30 Days Profits will go here.</p>
            </div>
          </AnimatedContainer>

        </div>
      </div>
    </div>
  );
};

export default ThirtyDaysProfitsPage;
