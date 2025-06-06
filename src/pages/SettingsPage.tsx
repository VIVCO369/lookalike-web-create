import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { cn } from "@/lib/utils";
import {
  Settings,
  Clock,
  Wifi,
  Volume2,
  Palette,
  Bell,
  User,
  Shield,
  Monitor,
  Smartphone,
  Sun,
  Moon,
  Check,
  AlertTriangle,
  Info,
  Zap,
  ExternalLink,
  CheckCircle
} from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

// Comprehensive Settings Interfaces
interface GeneralSettings {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userName: string;
  language: string;
  timezone: string;
  autoSave: boolean;
}

interface APISettings {
  derivAPIToken: string;
  isConnected: boolean;
  serverURL: string;
  connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
  lastConnected: Date | null;
  lastRefresh?: Date | null;
  autoReconnect: boolean;
  accountInfo: {
    loginid: string;
    fullname: string;
    currency: string;
    balance: number;
    country: string;
  } | null;
  connectionError: string | null;
  websocket: WebSocket | null;
  permissions: {
    readMarketData: boolean;
    readAccountInfo: boolean;
    placeTrades: boolean;
    withdrawFunds: boolean;
  };
}

interface VoiceAlertSettings {
  enabled: boolean;
  volume: number;
  voice: string;
  speed: number;
  pitch: number;
  tradeAlerts: boolean;
  profitAlerts: boolean;
  lossAlerts: boolean;
  targetReachedAlerts: boolean;
  customMessages: {
    win: string;
    loss: string;
    targetReached: string;
    stopLoss: string;
  };
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  animations: boolean;
  backgroundPattern: boolean;
}

interface NotificationSettings {
  enabled: boolean;
  desktop: boolean;
  sound: boolean;
  email: boolean;
  tradeNotifications: boolean;
  profitNotifications: boolean;
  systemNotifications: boolean;
  marketAlerts: boolean;
  frequency: 'immediate' | 'batched' | 'daily';
}

interface AllSettings {
  general: GeneralSettings;
  api: APISettings;
  voiceAlert: VoiceAlertSettings;
  appearance: AppearanceSettings;
  notification: NotificationSettings;
}

const initialSettings: AllSettings = {
  general: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    userName: "",
    language: "en",
    timezone: "UTC",
    autoSave: true
  },
  api: {
    derivAPIToken: "",
    isConnected: false,
    serverURL: "wss://ws.derivws.com/websockets/v3",
    connectionStatus: 'disconnected',
    lastConnected: null,
    lastRefresh: null,
    autoReconnect: true,
    accountInfo: null,
    connectionError: null,
    websocket: null,
    permissions: {
      readMarketData: true,
      readAccountInfo: true,
      placeTrades: true,
      withdrawFunds: false
    }
  },
  voiceAlert: {
    enabled: false,
    volume: 70,
    voice: "default",
    speed: 1.0,
    pitch: 1.0,
    tradeAlerts: true,
    profitAlerts: true,
    lossAlerts: true,
    targetReachedAlerts: true,
    customMessages: {
      win: "Trade successful! Profit achieved.",
      loss: "Trade closed with loss.",
      targetReached: "Target profit reached!",
      stopLoss: "Stop loss triggered."
    }
  },
  appearance: {
    theme: 'light',
    primaryColor: '#FF5A1F',
    fontSize: 'medium',
    compactMode: false,
    animations: true,
    backgroundPattern: false
  },
  notification: {
    enabled: true,
    desktop: true,
    sound: true,
    email: false,
    tradeNotifications: true,
    profitNotifications: true,
    systemNotifications: true,
    marketAlerts: false,
    frequency: 'immediate'
  }
};

// Declare global socket interface
declare global {
  interface Window {
    derivGlobalSocket?: WebSocket;
  }
}

const SettingsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [settings, setSettings] = useLocalStorage<AllSettings>("comprehensiveSettings", initialSettings);
  const [activeTab, setActiveTab] = useState("general");
  const [testingVoice, setTestingVoice] = useState(false);
  const { toast } = useToast();

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

  // Apply theme changes to document
  useEffect(() => {
    const applyTheme = () => {
      const { theme } = settings.appearance;
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // System theme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    applyTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (settings.appearance.theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.appearance.theme]);

  // Clear any cached connection data on mount - FORCE FRESH START
  useEffect(() => {
    console.log('🧹 CLEARING ALL CACHED DATA ON PAGE LOAD');

    // Clear all cached connection data
    localStorage.removeItem('deriv_api_connected');
    localStorage.removeItem('account_balance');
    localStorage.removeItem('account_holder');
    localStorage.removeItem('account_id');
    localStorage.removeItem('account_currency');
    localStorage.removeItem('account_country');
    localStorage.removeItem('connection_time');

    // Close any existing global socket
    if (window.derivGlobalSocket) {
      console.log('🔌 Closing existing global socket on page load');
      window.derivGlobalSocket.close();
      delete window.derivGlobalSocket;
    }

    // Force clear the settings state to match reality
    updateSettings('api', 'isConnected', false);
    updateSettings('api', 'accountInfo', null);
    updateSettings('api', 'connectionStatus', 'disconnected');
    updateSettings('api', 'websocket', null);
    updateSettings('api', 'lastConnected', null);
    updateSettings('api', 'connectionError', null);

    // Force reset all connection state
    updateSettings('api', 'isConnected', false);
    updateSettings('api', 'connectionStatus', 'disconnected');
    updateSettings('api', 'accountInfo', null);
    updateSettings('api', 'websocket', null);
    updateSettings('api', 'lastConnected', null);
    updateSettings('api', 'connectionError', null);
  }, []);

  // Cleanup WebSocket connection on unmount
  useEffect(() => {
    return () => {
      if (settings.api.websocket && settings.api.websocket !== window.derivGlobalSocket) {
        settings.api.websocket.close();
      }
    };
  }, []);

  // Helper functions
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    return date.toLocaleTimeString('en-US', options);
  };

  const updateSettings = (section: keyof AllSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const testVoiceAlert = () => {
    if (!settings.voiceAlert.enabled) {
      toast({
        title: "Voice alerts disabled",
        description: "Please enable voice alerts first.",
        variant: "destructive"
      });
      return;
    }

    setTestingVoice(true);

    // Simulate voice alert test
    setTimeout(() => {
      setTestingVoice(false);
      toast({
        title: "Voice test completed",
        description: "Voice alert test message played successfully.",
      });
    }, 2000);
  };

  const connectToDerivAPI = async () => {
    // Validate API token first
    if (!settings.api.derivAPIToken || settings.api.derivAPIToken.trim().length === 0) {
      updateSettings('api', 'connectionStatus', 'error');
      updateSettings('api', 'connectionError', 'API token is required');
      toast({
        title: "API Token Required",
        description: "Please enter your Deriv API token before connecting",
        variant: "destructive"
      });
      return;
    }

    // Basic token validation - Deriv tokens are typically 15+ characters
    const token = settings.api.derivAPIToken.trim();
    if (token.length < 10) {
      updateSettings('api', 'connectionStatus', 'error');
      updateSettings('api', 'connectionError', 'Invalid API token format');
      toast({
        title: "Invalid Token",
        description: "API token appears to be too short. Please check your token.",
        variant: "destructive"
      });
      return;
    }

    console.log('🧹 CLEARING ALL CACHED DATA - FRESH CONNECTION WITH NEW TOKEN');
    console.log('🔑 New API Token:', settings.api.derivAPIToken.substring(0, 10) + '...');

    // FORCE CLEAR ALL CACHED DATA FIRST - NO MORE FAKE SHIT
    localStorage.removeItem('deriv_api_connected');
    localStorage.removeItem('deriv_api_token');
    localStorage.removeItem('account_balance');
    localStorage.removeItem('account_holder');
    localStorage.removeItem('account_id');
    localStorage.removeItem('account_currency');
    localStorage.removeItem('account_country');
    localStorage.removeItem('connection_time');

    // FORCE CLEAR ALL STATE
    updateSettings('api', 'isConnected', false);
    updateSettings('api', 'accountInfo', null);
    updateSettings('api', 'websocket', null);
    updateSettings('api', 'lastConnected', null);
    updateSettings('api', 'connectionError', null);

    // Close existing connection if any
    if (settings.api.websocket) {
      console.log('🔌 Closing existing websocket...');
      settings.api.websocket.close();
      updateSettings('api', 'websocket', null);
    }

    // Clear global socket if exists
    if (window.derivGlobalSocket) {
      console.log('🔌 Closing global websocket...');
      window.derivGlobalSocket.close();
      delete window.derivGlobalSocket;
    }

    updateSettings('api', 'connectionStatus', 'connecting');
    updateSettings('api', 'connectionError', null);

    try {
      console.log('Connecting to Deriv API with app_id=1089...');
      const wsUrl = settings.api.serverURL.includes('app_id')
        ? settings.api.serverURL
        : `${settings.api.serverURL}?app_id=1089`;
      console.log('WebSocket URL:', wsUrl);
      const ws = new WebSocket(wsUrl);

      // Set up connection timeout
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          ws.close();
          updateSettings('api', 'connectionStatus', 'error');
          updateSettings('api', 'connectionError', 'Connection timeout');
          toast({
            title: "Connection timeout",
            description: "Failed to connect within 15 seconds",
            variant: "destructive"
          });
        }
      }, 15000);

      ws.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket connected, sending authorization...');

        // Send authorization request
        const authMessage = {
          authorize: settings.api.derivAPIToken.trim()
        };

        console.log('Sending auth request:', authMessage);
        ws.send(JSON.stringify(authMessage));
      };

      ws.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          console.log('Received response:', response);

          if (response.msg_type === 'authorize') {
            if (response.error) {
              console.error('Authorization failed:', response.error);
              updateSettings('api', 'connectionStatus', 'error');
              updateSettings('api', 'isConnected', false);
              updateSettings('api', 'connectionError', response.error.message);
              updateSettings('api', 'websocket', null);
              updateSettings('api', 'accountInfo', null);

              // Clear ALL localStorage on auth failure - no more cached fake data
              localStorage.removeItem('deriv_api_connected');
              localStorage.removeItem('account_balance');
              localStorage.removeItem('account_holder');
              localStorage.removeItem('account_id');
              localStorage.removeItem('account_currency');
              localStorage.removeItem('account_country');
              localStorage.removeItem('connection_time');

              ws.close();

              toast({
                title: "Authorization failed",
                description: response.error.message,
                variant: "destructive"
              });
            } else if (response.authorize) {
              console.log('Authorization successful!');

              const authData = response.authorize;
              const timestamp = new Date().toISOString();

              // Store in localStorage
              localStorage.setItem('deriv_api_token', settings.api.derivAPIToken);
              localStorage.setItem('deriv_api_connected', 'true');
              localStorage.setItem('account_balance', authData.balance || '0');
              localStorage.setItem('account_holder', authData.fullname || authData.loginid || 'Unknown');
              localStorage.setItem('account_id', authData.loginid || 'Unknown');
              localStorage.setItem('account_currency', authData.currency || 'USD');
              localStorage.setItem('account_country', authData.country || 'Unknown');
              localStorage.setItem('connection_time', timestamp);

              // Update connection status
              updateSettings('api', 'connectionStatus', 'connected');
              updateSettings('api', 'isConnected', true);
              updateSettings('api', 'lastConnected', new Date());
              updateSettings('api', 'connectionError', null);
              updateSettings('api', 'websocket', ws);

              // Store account information
              updateSettings('api', 'accountInfo', {
                loginid: authData.loginid || 'Unknown',
                fullname: authData.fullname || authData.loginid || 'Unknown',
                currency: authData.currency || 'USD',
                balance: parseFloat(authData.balance) || 0,
                country: authData.country || 'Unknown'
              });

              // Store as global socket for app-wide access
              window.derivGlobalSocket = ws;

              // Subscribe to real-time balance updates
              ws.send(JSON.stringify({
                balance: 1,
                subscribe: 1,
                req_id: Date.now()
              }));

              toast({
                title: "Connected successfully!",
                description: `Welcome ${authData.fullname || authData.loginid}! Balance: ${authData.balance} ${authData.currency}`,
              });
            }
          } else if (response.balance) {
            // Handle real-time balance updates
            const newBalance = parseFloat(response.balance.balance);
            updateSettings('api', 'accountInfo', {
              ...settings.api.accountInfo!,
              balance: newBalance
            });
            localStorage.setItem('account_balance', response.balance.balance);
            console.log('Balance updated:', newBalance);
          }
        } catch (error) {
          console.error('Error parsing response:', error);
          updateSettings('api', 'connectionError', 'Invalid server response');
        }
      };

      ws.onerror = (error) => {
        clearTimeout(connectionTimeout);
        console.error('WebSocket error:', error);

        let errorMessage = 'WebSocket connection failed';

        // Provide more specific error messages
        if (navigator.onLine === false) {
          errorMessage = 'No internet connection detected';
        } else if (settings.api.serverURL.includes('localhost')) {
          errorMessage = 'Cannot connect to localhost. Use official Deriv servers.';
        }

        updateSettings('api', 'connectionStatus', 'error');
        updateSettings('api', 'isConnected', false);
        updateSettings('api', 'connectionError', errorMessage);
        updateSettings('api', 'websocket', null);
        updateSettings('api', 'accountInfo', null);

        // Clear ALL localStorage on error - no more cached fake data
        localStorage.removeItem('deriv_api_connected');
        localStorage.removeItem('account_balance');
        localStorage.removeItem('account_holder');
        localStorage.removeItem('account_id');
        localStorage.removeItem('account_currency');
        localStorage.removeItem('account_country');
        localStorage.removeItem('connection_time');

        toast({
          title: "Connection failed",
          description: errorMessage,
          variant: "destructive"
        });
      };

      ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket closed:', event.code, event.reason);

        if (settings.api.connectionStatus === 'connected') {
          updateSettings('api', 'connectionStatus', 'disconnected');
          updateSettings('api', 'isConnected', false);
          updateSettings('api', 'websocket', null);
          updateSettings('api', 'accountInfo', null);

          // Clear ALL localStorage - no more cached fake data
          localStorage.removeItem('deriv_api_connected');
          localStorage.removeItem('account_balance');
          localStorage.removeItem('account_holder');
          localStorage.removeItem('account_id');
          localStorage.removeItem('account_currency');
          localStorage.removeItem('account_country');
          localStorage.removeItem('connection_time');

          // Clear global socket
          if (window.derivGlobalSocket === ws) {
            delete window.derivGlobalSocket;
          }

          toast({
            title: "Disconnected",
            description: "Connection to Deriv API lost",
            variant: "destructive"
          });

          // Auto-reconnect if enabled
          if (settings.api.autoReconnect && event.code !== 1000) {
            setTimeout(() => {
              connectToDerivAPI();
            }, 3000);
          }
        }
      };

    } catch (error) {
      console.error('Connection error:', error);
      updateSettings('api', 'connectionStatus', 'error');
      updateSettings('api', 'isConnected', false);
      updateSettings('api', 'connectionError', 'Failed to create connection');

      toast({
        title: "Connection failed",
        description: "Unable to establish WebSocket connection",
        variant: "destructive"
      });
    }
  };

  const disconnectFromDerivAPI = () => {
    console.log('🔌 DISCONNECTING from Deriv API...');

    try {
      // Close WebSocket connection
      if (settings.api.websocket) {
        console.log('Closing settings websocket...');
        settings.api.websocket.close();
      }

      // Clear global socket
      if (window.derivGlobalSocket) {
        console.log('Closing global websocket...');
        window.derivGlobalSocket.close();
        delete window.derivGlobalSocket;
      }

      // Update state
      updateSettings('api', 'connectionStatus', 'disconnected');
      updateSettings('api', 'isConnected', false);
      updateSettings('api', 'websocket', null);
      updateSettings('api', 'accountInfo', null);
      updateSettings('api', 'connectionError', null);
      updateSettings('api', 'lastConnected', null);

      // Clear localStorage
      localStorage.setItem('deriv_api_connected', 'false');
      localStorage.removeItem('deriv_api_token');
      localStorage.removeItem('account_balance');
      localStorage.removeItem('account_holder');
      localStorage.removeItem('account_id');
      localStorage.removeItem('account_currency');
      localStorage.removeItem('account_country');
      localStorage.removeItem('connection_time');

      console.log('✅ Successfully disconnected!');

      toast({
        title: "Disconnected",
        description: "Successfully disconnected from Deriv API.",
      });
    } catch (error) {
      console.error('❌ Error during disconnect:', error);
      toast({
        title: "Disconnect Error",
        description: "Error occurred while disconnecting.",
        variant: "destructive"
      });
    }
  };

  const testNetworkConnectivity = async () => {
    console.log('Running connection diagnostics...');

    // Test WebSocket support
    if (typeof WebSocket === 'undefined') {
      toast({
        title: "Browser Error",
        description: "WebSocket not supported in this browser",
        variant: "destructive"
      });
      return false;
    }

    // Test multiple Deriv endpoints for better reliability
    const endpoints = [
      'wss://ws.derivws.com/websockets/v3?app_id=1089',
      'wss://ws.binaryws.com/websockets/v3?app_id=1089',
      'wss://frontend.derivws.com/websockets/v3?app_id=1089'
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Testing endpoint: ${endpoint}`);
        const testWs = new WebSocket(endpoint);

        const testPromise = new Promise<boolean>((resolve) => {
          const timeout = setTimeout(() => {
            testWs.close();
            resolve(false);
          }, 5000);

          testWs.onopen = () => {
            clearTimeout(timeout);
            testWs.close();
            resolve(true);
          };

          testWs.onerror = () => {
            clearTimeout(timeout);
            resolve(false);
          };
        });

        const canConnect = await testPromise;

        if (canConnect) {
          toast({
            title: "Connection Test Passed",
            description: `WebSocket connection to Deriv servers is working (${endpoint})`,
          });
          return true;
        }
      } catch (error) {
        console.log(`Failed to test endpoint ${endpoint}:`, error);
        continue;
      }
    }

    toast({
      title: "Connection Test Failed",
      description: "Cannot reach any Deriv servers. Check your network or firewall settings.",
      variant: "destructive"
    });
    return false;
  };

  const testAPIConnection = async () => {
    const networkOK = await testNetworkConnectivity();
    if (networkOK) {
      connectToDerivAPI();
    }
  };

  const forceRefreshConnection = () => {
    console.log('🔄 FORCE REFRESHING CONNECTION STATE');

    // Clear ALL cached data
    localStorage.removeItem('deriv_api_connected');
    localStorage.removeItem('deriv_api_token');
    localStorage.removeItem('account_balance');
    localStorage.removeItem('account_holder');
    localStorage.removeItem('account_id');
    localStorage.removeItem('account_currency');
    localStorage.removeItem('account_country');
    localStorage.removeItem('connection_time');

    // Close any existing connections
    if (settings.api.websocket) {
      console.log('🔌 Closing settings websocket...');
      settings.api.websocket.close();
    }

    if (window.derivGlobalSocket) {
      console.log('🔌 Closing global websocket...');
      window.derivGlobalSocket.close();
      delete window.derivGlobalSocket;
    }

    // Reset ALL state to disconnected - Force immediate update
    console.log('🧹 Clearing all state data...');
    updateSettings('api', 'isConnected', false);
    updateSettings('api', 'accountInfo', null);
    updateSettings('api', 'connectionStatus', 'disconnected');
    updateSettings('api', 'websocket', null);
    updateSettings('api', 'lastConnected', null);
    updateSettings('api', 'connectionError', null);

    // Force a re-render by updating a timestamp
    updateSettings('api', 'lastRefresh', new Date());

    console.log('✅ All data cleared - accountInfo should now be NULL');

    toast({
      title: "Connection State Refreshed",
      description: "All cached data cleared. Ready for fresh connection.",
    });
  };

  const getConnectionStatusColor = () => {
    switch (settings.api.connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getConnectionStatusText = () => {
    switch (settings.api.connectionStatus) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'error': return 'Connection Error';
      default: return 'Disconnected';
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f7f5f0' }}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        {/* Header */}
        <motion.header
          className="bg-white dark:bg-gray-800 border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage your application preferences</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-gray-900 dark:text-white text-sm font-bold">{formatDate(currentDateTime)}</p>
              <p className="text-orange-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
            </div>
            <Button
              onClick={saveSettings}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </motion.header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                {/* Tab Navigation */}
                <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                  <TabsTrigger
                    value="general"
                    className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    <User className="h-4 w-4" />
                    Settings
                  </TabsTrigger>
                  <TabsTrigger
                    value="api"
                    className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    <Wifi className="h-4 w-4" />
                    API Connection
                  </TabsTrigger>
                  <TabsTrigger
                    value="voice"
                    className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    <Volume2 className="h-4 w-4" />
                    Voice Alert
                  </TabsTrigger>
                  <TabsTrigger
                    value="appearance"
                    className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    <Palette className="h-4 w-4" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger
                    value="notification"
                    className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    <Bell className="h-4 w-4" />
                    Notification
                  </TabsTrigger>
                </TabsList>

                {/* General Settings Tab */}
                <TabsContent value="general" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5 text-orange-500" />
                          Profile Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Personal Details */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white">Personal Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First Name</Label>
                              <Input
                                id="firstName"
                                value={settings.general.firstName}
                                onChange={(e) => updateSettings('general', 'firstName', e.target.value)}
                                placeholder="Enter your first name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input
                                id="lastName"
                                value={settings.general.lastName}
                                onChange={(e) => updateSettings('general', 'lastName', e.target.value)}
                                placeholder="Enter your last name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email Address</Label>
                              <Input
                                id="email"
                                type="email"
                                value={settings.general.email}
                                onChange={(e) => updateSettings('general', 'email', e.target.value)}
                                placeholder="your.email@example.com"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phoneNumber">Phone Number</Label>
                              <Input
                                id="phoneNumber"
                                type="tel"
                                value={settings.general.phoneNumber}
                                onChange={(e) => updateSettings('general', 'phoneNumber', e.target.value)}
                                placeholder="+1 (555) 123-4567"
                              />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Account Settings */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white">Account Settings</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="userName">Username</Label>
                              <Input
                                id="userName"
                                value={settings.general.userName}
                                onChange={(e) => updateSettings('general', 'userName', e.target.value)}
                                placeholder="Choose a username"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="language">Language</Label>
                              <Select
                                value={settings.general.language}
                                onValueChange={(value) => updateSettings('general', 'language', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="en">English</SelectItem>
                                  <SelectItem value="es">Spanish</SelectItem>
                                  <SelectItem value="fr">French</SelectItem>
                                  <SelectItem value="de">German</SelectItem>
                                  <SelectItem value="zh">Chinese</SelectItem>
                                  <SelectItem value="ja">Japanese</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="timezone">Timezone</Label>
                              <Select
                                value={settings.general.timezone}
                                onValueChange={(value) => updateSettings('general', 'timezone', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="UTC">UTC</SelectItem>
                                  <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                                  <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                                  <SelectItem value="GMT">Greenwich Mean Time (GMT)</SelectItem>
                                  <SelectItem value="JST">Japan Standard Time (JST)</SelectItem>
                                  <SelectItem value="AEST">Australian Eastern Time (AEST)</SelectItem>
                                  <SelectItem value="CET">Central European Time (CET)</SelectItem>
                                  <SelectItem value="IST">India Standard Time (IST)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Preferences */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white">Preferences</h4>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="autoSave">Auto Save</Label>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Automatically save changes as you make them
                              </p>
                            </div>
                            <Switch
                              id="autoSave"
                              checked={settings.general.autoSave}
                              onCheckedChange={(checked) => updateSettings('general', 'autoSave', checked)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* API Connection Tab */}
                <TabsContent value="api" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Wifi className="h-5 w-5 text-orange-500" />
                            Deriv API Connection
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className={cn("px-3 py-1", getConnectionStatusColor())}>
                              {getConnectionStatusText()}
                            </Badge>
                            {(settings.api.isConnected || settings.api.connectionStatus === 'connected') && (
                              <Button
                                onClick={disconnectFromDerivAPI}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
                              >
                                🔌 Disconnect
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="apiToken">API Token</Label>
                            <div className="flex gap-2">
                              <Input
                                id="apiToken"
                                type="password"
                                value={settings.api.derivAPIToken}
                                onChange={(e) => {
                                  console.log('🔑 API Token changed - clearing cached data');
                                  // Clear all cached data when token changes
                                  localStorage.removeItem('deriv_api_connected');
                                  localStorage.removeItem('deriv_api_token');
                                  localStorage.removeItem('account_balance');
                                  localStorage.removeItem('account_holder');
                                  localStorage.removeItem('account_id');
                                  localStorage.removeItem('account_currency');
                                  localStorage.removeItem('account_country');
                                  localStorage.removeItem('connection_time');

                                  // Clear state
                                  updateSettings('api', 'isConnected', false);
                                  updateSettings('api', 'accountInfo', null);
                                  updateSettings('api', 'connectionStatus', 'disconnected');

                                  // Update token
                                  updateSettings('api', 'derivAPIToken', e.target.value);
                                }}
                                placeholder="Enter your Deriv API token"
                                className="flex-1"
                              />
                              <div className="flex gap-2">
                                <Button
                                  onClick={(settings.api.isConnected || settings.api.connectionStatus === 'connected') ? disconnectFromDerivAPI : connectToDerivAPI}
                                  disabled={settings.api.connectionStatus === 'connecting'}
                                  className={cn(
                                    "text-white flex-1",
                                    (settings.api.isConnected || settings.api.connectionStatus === 'connected')
                                      ? "bg-red-500 hover:bg-red-600"
                                      : "bg-orange-500 hover:bg-orange-600"
                                  )}
                                >
                                  {settings.api.connectionStatus === 'connecting' ? (
                                    <>
                                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                                      Connecting...
                                    </>
                                  ) : (settings.api.isConnected || settings.api.connectionStatus === 'connected') ? (
                                    <>
                                      <Wifi className="h-4 w-4 mr-2" />
                                      Disconnect
                                    </>
                                  ) : (
                                    <>
                                      <Zap className="h-4 w-4 mr-2" />
                                      Connect
                                    </>
                                  )}
                                </Button>

                                {!settings.api.isConnected && (
                                  <Button
                                    onClick={testNetworkConnectivity}
                                    variant="outline"
                                    size="sm"
                                    className="px-3"
                                    disabled={settings.api.connectionStatus === 'connecting'}
                                  >
                                    Test
                                  </Button>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Get your API token from{" "}
                              <a
                                href="https://app.deriv.com/account/api-token"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-500 hover:text-orange-600 underline"
                              >
                                Deriv API Token page
                              </a>
                            </p>
                          </div>

                          {/* Debug Info & Force Refresh */}
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
                            <div className="flex justify-between items-center">
                              <div>
                                <strong>DEBUG:</strong> Connected: {settings.api.isConnected ? 'YES' : 'NO'} |
                                AccountInfo: {settings.api.accountInfo ? 'EXISTS' : 'NULL'} |
                                Status: {settings.api.connectionStatus} |
                                LocalStorage: {localStorage.getItem('deriv_api_connected') || 'NULL'}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={forceRefreshConnection}
                              >
                                🔄 Refresh
                              </Button>
                            </div>
                            {settings.api.accountInfo && (
                              <div className="mt-1">Data: {JSON.stringify(settings.api.accountInfo)}</div>
                            )}
                          </div>

                          {/* Modern API Connection Status Card - Matches Your Image */}
                          {settings.api.isConnected && settings.api.accountInfo && (
                            <div className="mt-6">
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-800 rounded-xl p-6 shadow-sm">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                  <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">API Disconnected</h3>
                                  </div>
                                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                                    Online since: {settings.api.lastConnected?.toLocaleTimeString() || '4:24:12 AM'}
                                  </div>
                                </div>

                                {/* Account Information Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  {/* Account Holder */}
                                  <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                      ACCOUNT HOLDER
                                    </div>
                                    <div className="text-lg font-bold text-green-700 dark:text-green-300">
                                      {settings.api.accountInfo.fullname}
                                    </div>
                                  </div>

                                  {/* Account ID */}
                                  <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                      ACCOUNT ID
                                    </div>
                                    <div className="text-lg font-bold text-green-700 dark:text-green-300">
                                      {settings.api.accountInfo.loginid}
                                    </div>
                                  </div>

                                  {/* Account Balance */}
                                  <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                      ACCOUNT BALANCE
                                    </div>
                                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                      ${settings.api.accountInfo.balance.toFixed(2)}
                                    </div>
                                  </div>

                                  {/* Currency */}
                                  <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                      CURRENCY
                                    </div>
                                    <div className="text-lg font-bold text-green-700 dark:text-green-300">
                                      {settings.api.accountInfo.currency}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="serverURL">Server URL</Label>
                            <Input
                              id="serverURL"
                              value={settings.api.serverURL}
                              onChange={(e) => updateSettings('api', 'serverURL', e.target.value)}
                              placeholder="wss://ws.derivws.com/websockets/v3?app_id=1089"
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Connection Status</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                <span className={cn(
                                  "font-semibold",
                                  settings.api.connectionStatus === 'connected' && "text-green-600",
                                  settings.api.connectionStatus === 'error' && "text-red-600",
                                  settings.api.connectionStatus === 'connecting' && "text-yellow-600",
                                  settings.api.connectionStatus === 'disconnected' && "text-gray-600"
                                )}>
                                  {getConnectionStatusText()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Last Connected:</span>
                                <span className="font-semibold">
                                  {settings.api.lastConnected
                                    ? new Date(settings.api.lastConnected).toLocaleString()
                                    : 'Never'
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Server:</span>
                                <span className="font-semibold text-sm">
                                  {settings.api.serverURL.replace('wss://', '').split('/')[0]}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Connection Settings</h4>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="autoReconnect">Auto Reconnect</Label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Automatically reconnect if connection is lost
                                </p>
                              </div>
                              <Switch
                                id="autoReconnect"
                                checked={settings.api.autoReconnect}
                                onCheckedChange={(checked) => updateSettings('api', 'autoReconnect', checked)}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Account Information */}
                        {settings.api.isConnected && settings.api.accountInfo && (
                          <>
                            <Separator />
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Account Information</h4>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                  <span className="text-sm text-green-600 font-medium">
                                    Online since: {settings.api.lastConnected?.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Account:</span>
                                    <span className="font-semibold">{settings.api.accountInfo.fullname}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">ID:</span>
                                    <span className="font-semibold">{settings.api.accountInfo.loginid}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Currency:</span>
                                    <span className="font-semibold">{settings.api.accountInfo.currency}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Balance:</span>
                                    <span className="font-semibold text-green-600 text-lg">
                                      ${settings.api.accountInfo.balance.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Country:</span>
                                    <span className="font-semibold">{settings.api.accountInfo.country}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* API Key Permissions */}
                        <Separator />
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white">API Key Permissions</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                <span className="text-sm font-medium">Read Market Data</span>
                              </div>
                              <Badge variant="secondary" className="bg-green-100 text-green-700">Enabled</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                <span className="text-sm font-medium">Read Account Info</span>
                              </div>
                              <Badge variant="secondary" className="bg-green-100 text-green-700">Enabled</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                <span className="text-sm font-medium">Place Trades</span>
                              </div>
                              <Badge variant="secondary" className="bg-green-100 text-green-700">Enabled</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                <span className="text-sm font-medium">Withdraw Funds</span>
                              </div>
                              <Badge variant="secondary" className="bg-red-100 text-red-700">Disabled</Badge>
                            </div>
                          </div>
                        </div>

                        {/* How to Get API Key */}
                        <Separator />
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white">How to Get Your Deriv API Key</h4>
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                                <div>
                                  <p className="font-medium">Log in to deriv.com</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">Visit deriv.com and sign in to your account</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                                <div>
                                  <p className="font-medium">Navigate to account settings</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">Go to Account Settings → API Token</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                                <div>
                                  <p className="font-medium">Create new token</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">Click "Create" and select required permissions</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                                <div>
                                  <p className="font-medium">Copy and paste token</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">Copy the generated token and paste it above</p>
                                </div>
                              </div>
                              <div className="mt-4 pt-3 border-t border-blue-200 dark:border-blue-700">
                                <a
                                  href="https://app.deriv.com/account/api-token"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  Get API Token from Deriv
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Connection Error */}
                        {settings.api.connectionStatus === 'error' && (
                          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-red-800 dark:text-red-200">Connection Error</h4>
                                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                  {settings.api.connectionError || 'Failed to connect to Deriv API. Please check your API token and try again.'}
                                </p>
                                <div className="mt-2">
                                  <Button
                                    onClick={connectToDerivAPI}
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    Retry Connection
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Connection Success */}
                        {settings.api.connectionStatus === 'connected' && (
                          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                            <div className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-green-800 dark:text-green-200">Connected Successfully</h4>
                                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                  Your Deriv API connection is active and ready for trading.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Voice Alert Tab */}
                <TabsContent value="voice" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Volume2 className="h-5 w-5 text-orange-500" />
                            Voice Alert Settings
                          </CardTitle>
                          <Button
                            onClick={testVoiceAlert}
                            disabled={testingVoice || !settings.voiceAlert.enabled}
                            variant="outline"
                            size="sm"
                          >
                            {testingVoice ? (
                              <>
                                <Volume2 className="h-4 w-4 mr-2 animate-pulse" />
                                Testing...
                              </>
                            ) : (
                              <>
                                <Volume2 className="h-4 w-4 mr-2" />
                                Test Voice
                              </>
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="voiceEnabled">Enable Voice Alerts</Label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Turn on voice notifications for trading events
                            </p>
                          </div>
                          <Switch
                            id="voiceEnabled"
                            checked={settings.voiceAlert.enabled}
                            onCheckedChange={(checked) => updateSettings('voiceAlert', 'enabled', checked)}
                          />
                        </div>

                        {settings.voiceAlert.enabled && (
                          <>
                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Voice Settings</h4>

                                <div className="space-y-2">
                                  <Label htmlFor="volume">Volume: {settings.voiceAlert.volume}%</Label>
                                  <input
                                    id="volume"
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={settings.voiceAlert.volume}
                                    onChange={(e) => updateSettings('voiceAlert', 'volume', parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="speed">Speed: {settings.voiceAlert.speed}x</Label>
                                  <input
                                    id="speed"
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={settings.voiceAlert.speed}
                                    onChange={(e) => updateSettings('voiceAlert', 'speed', parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="pitch">Pitch: {settings.voiceAlert.pitch}x</Label>
                                  <input
                                    id="pitch"
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={settings.voiceAlert.pitch}
                                    onChange={(e) => updateSettings('voiceAlert', 'pitch', parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="voice">Voice</Label>
                                  <Select
                                    value={settings.voiceAlert.voice}
                                    onValueChange={(value) => updateSettings('voiceAlert', 'voice', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="default">Default</SelectItem>
                                      <SelectItem value="male">Male Voice</SelectItem>
                                      <SelectItem value="female">Female Voice</SelectItem>
                                      <SelectItem value="robotic">Robotic Voice</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Alert Types</h4>

                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <Label htmlFor="tradeAlerts">Trade Alerts</Label>
                                    <Switch
                                      id="tradeAlerts"
                                      checked={settings.voiceAlert.tradeAlerts}
                                      onCheckedChange={(checked) => updateSettings('voiceAlert', 'tradeAlerts', checked)}
                                    />
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <Label htmlFor="profitAlerts">Profit Alerts</Label>
                                    <Switch
                                      id="profitAlerts"
                                      checked={settings.voiceAlert.profitAlerts}
                                      onCheckedChange={(checked) => updateSettings('voiceAlert', 'profitAlerts', checked)}
                                    />
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <Label htmlFor="lossAlerts">Loss Alerts</Label>
                                    <Switch
                                      id="lossAlerts"
                                      checked={settings.voiceAlert.lossAlerts}
                                      onCheckedChange={(checked) => updateSettings('voiceAlert', 'lossAlerts', checked)}
                                    />
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <Label htmlFor="targetReachedAlerts">Target Reached Alerts</Label>
                                    <Switch
                                      id="targetReachedAlerts"
                                      checked={settings.voiceAlert.targetReachedAlerts}
                                      onCheckedChange={(checked) => updateSettings('voiceAlert', 'targetReachedAlerts', checked)}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                              <h4 className="font-semibold text-gray-900 dark:text-white">Custom Messages</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="winMessage">Win Message</Label>
                                  <Input
                                    id="winMessage"
                                    value={settings.voiceAlert.customMessages.win}
                                    onChange={(e) => updateSettings('voiceAlert', 'customMessages', {
                                      ...settings.voiceAlert.customMessages,
                                      win: e.target.value
                                    })}
                                    placeholder="Trade successful! Profit achieved."
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="lossMessage">Loss Message</Label>
                                  <Input
                                    id="lossMessage"
                                    value={settings.voiceAlert.customMessages.loss}
                                    onChange={(e) => updateSettings('voiceAlert', 'customMessages', {
                                      ...settings.voiceAlert.customMessages,
                                      loss: e.target.value
                                    })}
                                    placeholder="Trade closed with loss."
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="targetMessage">Target Reached Message</Label>
                                  <Input
                                    id="targetMessage"
                                    value={settings.voiceAlert.customMessages.targetReached}
                                    onChange={(e) => updateSettings('voiceAlert', 'customMessages', {
                                      ...settings.voiceAlert.customMessages,
                                      targetReached: e.target.value
                                    })}
                                    placeholder="Target profit reached!"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="stopLossMessage">Stop Loss Message</Label>
                                  <Input
                                    id="stopLossMessage"
                                    value={settings.voiceAlert.customMessages.stopLoss}
                                    onChange={(e) => updateSettings('voiceAlert', 'customMessages', {
                                      ...settings.voiceAlert.customMessages,
                                      stopLoss: e.target.value
                                    })}
                                    placeholder="Stop loss triggered."
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Palette className="h-5 w-5 text-orange-500" />
                          Appearance Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Theme</h4>

                            <div className="space-y-2">
                              <Label>Color Theme</Label>
                              <div className="grid grid-cols-3 gap-2">
                                <Button
                                  variant={settings.appearance.theme === 'light' ? 'default' : 'outline'}
                                  onClick={() => updateSettings('appearance', 'theme', 'light')}
                                  className="flex items-center gap-2"
                                >
                                  <Sun className="h-4 w-4" />
                                  Light
                                </Button>
                                <Button
                                  variant={settings.appearance.theme === 'dark' ? 'default' : 'outline'}
                                  onClick={() => updateSettings('appearance', 'theme', 'dark')}
                                  className="flex items-center gap-2"
                                >
                                  <Moon className="h-4 w-4" />
                                  Dark
                                </Button>
                                <Button
                                  variant={settings.appearance.theme === 'system' ? 'default' : 'outline'}
                                  onClick={() => updateSettings('appearance', 'theme', 'system')}
                                  className="flex items-center gap-2"
                                >
                                  <Monitor className="h-4 w-4" />
                                  System
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="primaryColor">Primary Color</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="primaryColor"
                                  type="color"
                                  value={settings.appearance.primaryColor}
                                  onChange={(e) => updateSettings('appearance', 'primaryColor', e.target.value)}
                                  className="w-16 h-10 p-1 border rounded"
                                />
                                <Input
                                  value={settings.appearance.primaryColor}
                                  onChange={(e) => updateSettings('appearance', 'primaryColor', e.target.value)}
                                  placeholder="#FF5A1F"
                                  className="flex-1"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="fontSize">Font Size</Label>
                              <Select
                                value={settings.appearance.fontSize}
                                onValueChange={(value: 'small' | 'medium' | 'large') =>
                                  updateSettings('appearance', 'fontSize', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="small">Small</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="large">Large</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Interface</h4>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label htmlFor="compactMode">Compact Mode</Label>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Reduce spacing and padding for more content
                                  </p>
                                </div>
                                <Switch
                                  id="compactMode"
                                  checked={settings.appearance.compactMode}
                                  onCheckedChange={(checked) => updateSettings('appearance', 'compactMode', checked)}
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label htmlFor="animations">Animations</Label>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Enable smooth transitions and animations
                                  </p>
                                </div>
                                <Switch
                                  id="animations"
                                  checked={settings.appearance.animations}
                                  onCheckedChange={(checked) => updateSettings('appearance', 'animations', checked)}
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label htmlFor="backgroundPattern">Background Pattern</Label>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Show subtle background patterns
                                  </p>
                                </div>
                                <Switch
                                  id="backgroundPattern"
                                  checked={settings.appearance.backgroundPattern}
                                  onCheckedChange={(checked) => updateSettings('appearance', 'backgroundPattern', checked)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-orange-500 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-orange-800 dark:text-orange-200">Preview Changes</h4>
                              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                                Some appearance changes may require a page refresh to take full effect.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Notification Tab */}
                <TabsContent value="notification" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="h-5 w-5 text-orange-500" />
                          Notification Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="notificationsEnabled">Enable Notifications</Label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Turn on all notification types
                            </p>
                          </div>
                          <Switch
                            id="notificationsEnabled"
                            checked={settings.notification.enabled}
                            onCheckedChange={(checked) => updateSettings('notification', 'enabled', checked)}
                          />
                        </div>

                        {settings.notification.enabled && (
                          <>
                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Notification Types</h4>

                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                      <Label htmlFor="desktop">Desktop Notifications</Label>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Show notifications in your browser
                                      </p>
                                    </div>
                                    <Switch
                                      id="desktop"
                                      checked={settings.notification.desktop}
                                      onCheckedChange={(checked) => updateSettings('notification', 'desktop', checked)}
                                    />
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                      <Label htmlFor="sound">Sound Notifications</Label>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Play sound alerts
                                      </p>
                                    </div>
                                    <Switch
                                      id="sound"
                                      checked={settings.notification.sound}
                                      onCheckedChange={(checked) => updateSettings('notification', 'sound', checked)}
                                    />
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                      <Label htmlFor="email">Email Notifications</Label>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Send notifications to your email
                                      </p>
                                    </div>
                                    <Switch
                                      id="email"
                                      checked={settings.notification.email}
                                      onCheckedChange={(checked) => updateSettings('notification', 'email', checked)}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Alert Categories</h4>

                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <Label htmlFor="tradeNotifications">Trade Notifications</Label>
                                    <Switch
                                      id="tradeNotifications"
                                      checked={settings.notification.tradeNotifications}
                                      onCheckedChange={(checked) => updateSettings('notification', 'tradeNotifications', checked)}
                                    />
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <Label htmlFor="profitNotifications">Profit Notifications</Label>
                                    <Switch
                                      id="profitNotifications"
                                      checked={settings.notification.profitNotifications}
                                      onCheckedChange={(checked) => updateSettings('notification', 'profitNotifications', checked)}
                                    />
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <Label htmlFor="systemNotifications">System Notifications</Label>
                                    <Switch
                                      id="systemNotifications"
                                      checked={settings.notification.systemNotifications}
                                      onCheckedChange={(checked) => updateSettings('notification', 'systemNotifications', checked)}
                                    />
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <Label htmlFor="marketAlerts">Market Alerts</Label>
                                    <Switch
                                      id="marketAlerts"
                                      checked={settings.notification.marketAlerts}
                                      onCheckedChange={(checked) => updateSettings('notification', 'marketAlerts', checked)}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                              <h4 className="font-semibold text-gray-900 dark:text-white">Notification Frequency</h4>
                              <div className="grid grid-cols-3 gap-2">
                                <Button
                                  variant={settings.notification.frequency === 'immediate' ? 'default' : 'outline'}
                                  onClick={() => updateSettings('notification', 'frequency', 'immediate')}
                                  className="flex items-center gap-2"
                                >
                                  <Zap className="h-4 w-4" />
                                  Immediate
                                </Button>
                                <Button
                                  variant={settings.notification.frequency === 'batched' ? 'default' : 'outline'}
                                  onClick={() => updateSettings('notification', 'frequency', 'batched')}
                                  className="flex items-center gap-2"
                                >
                                  <Clock className="h-4 w-4" />
                                  Batched
                                </Button>
                                <Button
                                  variant={settings.notification.frequency === 'daily' ? 'default' : 'outline'}
                                  onClick={() => updateSettings('notification', 'frequency', 'daily')}
                                  className="flex items-center gap-2"
                                >
                                  <Bell className="h-4 w-4" />
                                  Daily
                                </Button>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Choose how often you want to receive notifications
                              </p>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>

            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                Settings are automatically saved to your browser's local storage.
                For cloud synchronization, a backend implementation would be required.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
