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
  Wrench,
  TrendingUp,
  FileText,
  History,
  ChevronDown,
  Trophy,
  Target,
  Briefcase,
  Goal,
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
  const [analyticsExpanded, setAnalyticsExpanded] = useState(false);
  const [tradeChallengeExpanded, setTradeChallengeExpanded] = useState(false);
  const [tradeManageExpanded, setTradeManageExpanded] = useState(false);

  useEffect(() => {
    // Add a slight delay for mounting animation
    setMounted(true);
  }, []);

  // Check if current path is under analytics and expand if so
  useEffect(() => {
    if (currentPath.includes('/trade-analytics')) {
      setAnalyticsExpanded(true);
    }
    if (currentPath.includes('/trade-challenge')) {
      setTradeChallengeExpanded(true);
    }
    if (currentPath.includes('/trade-manage')) {
      setTradeManageExpanded(true);
    }
  }, [currentPath]);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Calendar, label: "Schedule", path: "/schedule" },
    { icon: BookOpen, label: "Trade Rules", path: "/trading-rules" },
    { icon: BarChart3, label: "Trade Demo", path: "/trades" },
    { icon: Target, label: "Trade Goals", path: "/trade-goals" },
    // Removed Analytics link
    { icon: Wrench, label: "Trade Tools", path: "/trade-tools" },
  ];

  const analyticsSubItems = [
    { icon: FileText, label: "Trade Summary", path: "/trade-analytics/summary" },
    { icon: History, label: "Trade History", path: "/trade-analytics/history" },
  ];

  const tradeManageSubItems = [
    { icon: Target, label: "Trade Goals", path: "/trade-manage/goals" },
    { icon: Goal, label: "Trade Target", path: "/trade-manage/target" },
  ];

  const tradeChallengeSubItems = [
    { icon: Calendar, label: "Daily Trades", path: "/trade-challenge/daily-trades" },
    { icon: Trophy, label: "30 Day Trade", path: "/trade-challenge/30-day-trade" },
  ];

  const toggleAnalytics = () => {
    setAnalyticsExpanded(!analyticsExpanded);
  };

  const toggleTradeChallenge = () => {
    setTradeChallengeExpanded(!tradeChallengeExpanded);
  };

  const toggleTradeManage = () => {
    setTradeManageExpanded(!tradeManageExpanded);
  };

  return (
    <div
      className={cn(
        "bg-teal-900 text-white h-full flex flex-col transition-all duration-300 ease-in-out fixed z-20 shadow-lg",
        isOpen ? "w-64" : "w-20",
        mounted ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
      style={{ minHeight: "100vh" }}
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

        {/* Trade Manage Menu Item */}
        <div>
          <div
            onClick={isOpen ? toggleTradeManage : undefined}
            className={cn(
              "flex items-center px-4 py-3 text-gray-100 hover:bg-teal-800 transition-all duration-200 cursor-pointer",
              (currentPath.includes('/trade-manage')) && "bg-teal-700 border-l-4 border-white",
              !isOpen && "justify-center"
            )}
          >
            <Briefcase className={cn("h-5 w-5", !isOpen && "h-6 w-6")} />
            {isOpen && (
              <>
                <span className="ml-4 flex-1">Trade Manage</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    tradeManageExpanded && "rotate-180"
                  )}
                />
              </>
            )}
          </div>

          {/* Trade Manage Sub Items */}
          {isOpen && tradeManageExpanded && (
            <div className="bg-teal-800">
              {tradeManageSubItems.map((subItem, subIndex) => (
                <Link
                  key={subIndex}
                  to={subItem.path}
                  className={cn(
                    "flex items-center px-8 py-2 text-gray-200 hover:bg-teal-700 transition-all duration-200 text-sm",
                    currentPath === subItem.path && "bg-teal-600 text-white"
                  )}
                >
                  <subItem.icon className="h-4 w-4" />
                  <span className="ml-3">{subItem.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Trade Challenge Menu Item */}
        <div>
          <div
            onClick={isOpen ? toggleTradeChallenge : undefined}
            className={cn(
              "flex items-center px-4 py-3 text-gray-100 hover:bg-teal-800 transition-all duration-200 cursor-pointer",
              (currentPath.includes('/trade-challenge')) && "bg-teal-700 border-l-4 border-white",
              !isOpen && "justify-center"
            )}
          >
            <Trophy className={cn("h-5 w-5", !isOpen && "h-6 w-6")} />
            {isOpen && (
              <>
                <span className="ml-4 flex-1">Trade Challenge</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    tradeChallengeExpanded && "rotate-180"
                  )}
                />
              </>
            )}
          </div>

          {/* Trade Challenge Sub Items */}
          {isOpen && tradeChallengeExpanded && (
            <div className="bg-teal-800">
              {tradeChallengeSubItems.map((subItem, subIndex) => (
                <Link
                  key={subIndex}
                  to={subItem.path}
                  className={cn(
                    "flex items-center px-8 py-2 text-gray-200 hover:bg-teal-700 transition-all duration-200 text-sm",
                    currentPath === subItem.path && "bg-teal-600 text-white"
                  )}
                >
                  <subItem.icon className="h-4 w-4" />
                  <span className="ml-3">{subItem.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Trade Analytics Menu Item */}
        <div>
          <div
            onClick={isOpen ? toggleAnalytics : undefined}
            className={cn(
              "flex items-center px-4 py-3 text-gray-100 hover:bg-teal-800 transition-all duration-200 cursor-pointer",
              (currentPath.includes('/trade-analytics')) && "bg-teal-700 border-l-4 border-white",
              !isOpen && "justify-center"
            )}
          >
            <TrendingUp className={cn("h-5 w-5", !isOpen && "h-6 w-6")} />
            {isOpen && (
              <>
                <span className="ml-4 flex-1">Trade Analytics</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    analyticsExpanded && "rotate-180"
                  )}
                />
              </>
            )}
          </div>

          {/* Analytics Sub Items */}
          {isOpen && analyticsExpanded && (
            <div className="bg-teal-800">
              {analyticsSubItems.map((subItem, subIndex) => (
                <Link
                  key={subIndex}
                  to={subItem.path}
                  className={cn(
                    "flex items-center px-8 py-2 text-gray-200 hover:bg-teal-700 transition-all duration-200 text-sm",
                    currentPath === subItem.path && "bg-teal-600 text-white"
                  )}
                >
                  <subItem.icon className="h-4 w-4" />
                  <span className="ml-3">{subItem.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          to="/settings"
          className={cn(
            "flex items-center px-4 py-3 text-gray-100 hover:bg-teal-800 transition-all duration-200",
            currentPath === "/settings" && "bg-teal-700 border-l-4 border-white",
            !isOpen && "justify-center"
          )}
        >
          <Settings className={cn("h-5 w-5", !isOpen && "h-6 w-6")} />
          {isOpen && <span className={cn("ml-4 transition-opacity", isOpen ? "opacity-100" : "opacity-0")}>Settings</span>}
        </Link>
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
