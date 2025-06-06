import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Sidebar from '../../components/Sidebar';
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';



const AutoTradePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);


  
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f7f5f0' }}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Auto Trade</h1>
              <p className="text-sm text-gray-600">Vivco AI 8.0 Trading System</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-gray-900 text-sm font-bold">Auto Trade Page</p>
            <p className="text-orange-500 text-xs font-bold">Working!</p>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <Card className="p-8">
              <CardContent>
                <h2 className="text-2xl font-bold mb-4">Auto Trade Page</h2>
                <p className="text-gray-600">This is a simple test to verify the page loads correctly.</p>
                <div className="mt-4">
                  <Button>Test Button</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AutoTradePage;
