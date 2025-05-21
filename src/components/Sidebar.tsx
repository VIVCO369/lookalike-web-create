
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Calendar, label: "Schedule", active: false },
    { icon: BookOpen, label: "Trade Rules", active: false },
    { icon: Users, label: "Users", active: false },
    { icon: BarChart3, label: "Analytics", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  return (
    <div
      className={cn(
        "bg-teal-900 text-white h-screen flex flex-col transition-all duration-300 fixed lg:static z-20",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-teal-800">
        {isOpen && <h1 className="font-medium">Vivco Trade System</h1>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="text-white hover:bg-teal-800"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <nav className="flex-1 pt-6">
        {navItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className={cn(
              "flex items-center px-4 py-3 text-gray-200 hover:bg-teal-800 transition-colors",
              item.active && "bg-teal-800"
            )}
          >
            <item.icon className="h-5 w-5" />
            {isOpen && <span className="ml-4">{item.label}</span>}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
