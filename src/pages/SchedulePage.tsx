import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "../components/Sidebar";
import ScheduleList from "../components/ScheduleList";
import { useState } from "react";
import { cn } from "@/lib/utils"; // Import cn utility

const SchedulePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}> {/* Added dynamic padding */}
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <h1 className="text-xl font-medium text-gray-700">Today's Schedule</h1>
          </div>
          <div>
            <p className="text-black text-sm">Wednesday, May 21, 2025</p>
            <p className="text-green-500 text-xs font-bold">04:51:25 PM</p>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <ScheduleList />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SchedulePage;
