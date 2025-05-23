import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";

const SettingsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-500" />
            <h1 className="text-xl font-medium text-gray-700">Settings</h1>
          </div>
          {/* You can add header elements specific to the settings page here */}
          <div>
            {/* Placeholder for date/time or other header info */}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Application Settings</h2>
            <p className="text-gray-600">
              This is a placeholder for the Settings page.
              Full functionality for settings will require backend implementation,
              database integration, and user authentication.
            </p>
            {/* Add your settings sections and forms here in the future */}
            <div className="mt-8 space-y-6">
              {/* Example Setting Section */}
              {/*
              <div>
                <h3 className="text-lg font-medium mb-2">General Preferences</h3>
                // Add setting controls (e.g., toggles, inputs) here
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Account Settings</h3>
                // Add account-related settings here
              </div>
              */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
