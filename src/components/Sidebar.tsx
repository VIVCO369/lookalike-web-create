
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Add a slight delay for mounting animation
    setMounted(true);
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Calendar, label: "Schedule", path: "/schedule" },
    { icon: BookOpen, label: "Trade Rules", path: "/trading-rules" },
    { icon: BarChart3, label: "Trades", path: "/trades" },
    { icon: Users, label: "Users", path: "/users" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div
      className={cn(
        "bg-teal-900 text-white h-screen flex flex-col transition-all duration-300 ease-in-out fixed lg:relative z-20 shadow-lg",
        isOpen ? "w-64" : "w-20",
        mounted ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-teal-800 bg-teal-800">
        {isOpen ? (
          <h1 className="font-medium text-lg">Vivco Trade System</h1>
        ) : (
          <h1 className="font-medium text-lg">VTS</h1>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="text-white hover:bg-teal-700 transition-colors"
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>
      <nav className="flex-1 pt-6 overflow-y-auto scrollbar-none">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={cn(
              "flex items-center px-4 py-3 text-gray-100 hover:bg-teal-800 transition-all duration-200",
              currentPath === item.path && "bg-teal-700 border-l-4 border-white",
              !isOpen && "justify-center"
            )}
          >
            <item.icon className={cn("h-5 w-5", !isOpen && "h-6 w-6")} />
            {isOpen && <span className={cn("ml-4 transition-opacity", isOpen ? "opacity-100" : "opacity-0")}>{item.label}</span>}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-teal-800 text-center text-xs text-teal-300">
        {isOpen ? (
          <div>
            <p>10 / 10 Trades Used</p>
            <div className="mt-2">
              <Button variant="outline" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black text-xs py-1 px-2">Subscribe</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p>10/10</p>
            <Button variant="outline" className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-black text-xs w-10 h-10 p-0 flex items-center justify-center">S</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
