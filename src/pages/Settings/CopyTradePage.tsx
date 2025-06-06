import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Sidebar from '../../components/Sidebar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Copy,
  Users,
  TrendingUp,
  TrendingDown,
  Star,
  DollarSign,
  BarChart3,
  Eye,
  EyeOff,
  UserPlus,
  Settings,
  Shield,
  AlertCircle,
  Plus,
  Trash2,
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';

interface MasterAccount {
  apiToken: string;
  isConnected: boolean;
  balance: number;
  isVisible: boolean;
}

interface FollowerAccount {
  id: string;
  name: string;
  apiToken: string;
  copyRatio: number;
  maxTradeAmount: number;
  status: 'Active' | 'Inactive';
  balance: number;
  lastActivity: string;
}

interface CopyTradeStats {
  masterStatus: 'Connected' | 'Disconnected';
  activeFollowers: number;
  totalTrades: number;
  totalProfit: number;
}

const CopyTradePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [newFollowerName, setNewFollowerName] = useState('');
  const [newFollowerToken, setNewFollowerToken] = useState('');
  const [newFollowerRatio, setNewFollowerRatio] = useState(1);
  const [newFollowerMaxAmount, setNewFollowerMaxAmount] = useState(100);

  const [masterAccount, setMasterAccount] = useLocalStorage<MasterAccount>('masterAccount', {
    apiToken: '••••••••••••',
    isConnected: false,
    balance: 0,
    isVisible: false
  });

  const [followerAccounts, setFollowerAccounts] = useLocalStorage<FollowerAccount[]>('followerAccounts', [
    {
      id: '1',
      name: 'Semo',
      apiToken: '••••••••••••',
      copyRatio: 1,
      maxTradeAmount: 100,
      status: 'Inactive',
      balance: 5009.43,
      lastActivity: '5:03:25 AM'
    },
    {
      id: '2',
      name: 'Demo',
      apiToken: '••••••••••••',
      copyRatio: 1,
      maxTradeAmount: 100,
      status: 'Inactive',
      balance: 5330.04,
      lastActivity: '5:03:25 AM'
    }
  ]);

  const [copyStats] = useLocalStorage<CopyTradeStats>('copyStats', {
    masterStatus: 'Disconnected',
    activeFollowers: 0,
    totalTrades: 0,
    totalProfit: 0.00
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    return date.toLocaleTimeString('en-US', options);
  };

  const toggleMasterTokenVisibility = () => {
    setMasterAccount(prev => ({ ...prev, isVisible: !prev.isVisible }));
  };

  const addFollower = () => {
    if (newFollowerName && newFollowerToken) {
      const newFollower: FollowerAccount = {
        id: Date.now().toString(),
        name: newFollowerName,
        apiToken: newFollowerToken,
        copyRatio: newFollowerRatio,
        maxTradeAmount: newFollowerMaxAmount,
        status: 'Inactive',
        balance: 0,
        lastActivity: 'Never'
      };
      setFollowerAccounts(prev => [...prev, newFollower]);
      setNewFollowerName('');
      setNewFollowerToken('');
      setNewFollowerRatio(1);
      setNewFollowerMaxAmount(100);
    }
  };

  const removeFollower = (id: string) => {
    setFollowerAccounts(prev => prev.filter(f => f.id !== id));
  };

  const toggleCopyTrading = () => {
    // Toggle copy trading functionality
  };

  const testRealTrade = () => {
    // Test real trade functionality
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f7f5f0' }}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        {/* Header */}
        <motion.header
          className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Copy className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Copy Trading Manager</h1>
              <p className="text-sm text-gray-600">Manage master account and follower connections</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-gray-900 text-sm font-bold">{formatDate(currentDateTime)}</p>
            <p className="text-orange-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
          </div>
        </motion.header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Copy Trading Manager Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Master Status</p>
                      <p className="text-lg font-bold text-red-600">{copyStats.masterStatus}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Active Followers</p>
                      <p className="text-lg font-bold text-green-600">{copyStats.activeFollowers}/0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Trades</p>
                      <p className="text-lg font-bold text-blue-600">{copyStats.totalTrades}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Profit</p>
                      <p className="text-lg font-bold text-green-600">+${copyStats.totalProfit.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Master Account Configuration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Settings className="h-5 w-5 text-orange-600" />
                    Master Account Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-700">Master API Token</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type={masterAccount.isVisible ? "text" : "password"}
                        value={masterAccount.isVisible ? "your-api-token-here" : masterAccount.apiToken}
                        className="bg-white border-gray-300 text-gray-900 flex-1"
                        readOnly
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMasterTokenVisibility}
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      >
                        {masterAccount.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={toggleCopyTrading}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Stop Copy Trading
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={testRealTrade}
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        Test Real Trade
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Add New Follower */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Plus className="h-5 w-5 text-green-600" />
                    Add New Follower
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-gray-700">Follower Name</Label>
                      <Input
                        placeholder="Enter follower name"
                        value={newFollowerName}
                        onChange={(e) => setNewFollowerName(e.target.value)}
                        className="bg-white border-gray-300 text-gray-900 mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700">API Token</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          placeholder="Enter API token"
                          value={newFollowerToken}
                          onChange={(e) => setNewFollowerToken(e.target.value)}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-700">Copy Ratio</Label>
                      <Input
                        type="number"
                        value={newFollowerRatio}
                        onChange={(e) => setNewFollowerRatio(parseFloat(e.target.value))}
                        className="bg-white border-gray-300 text-gray-900 mt-1"
                        min="0.1"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700">Max Trade Amount</Label>
                      <Input
                        type="number"
                        value={newFollowerMaxAmount}
                        onChange={(e) => setNewFollowerMaxAmount(parseFloat(e.target.value))}
                        className="bg-white border-gray-300 text-gray-900 mt-1"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={addFollower}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                      disabled={!newFollowerName || !newFollowerToken}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Follower
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Follower Accounts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Users className="h-5 w-5 text-orange-600" />
                    Follower Accounts ({followerAccounts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {followerAccounts.map((follower) => (
                      <motion.div
                        key={follower.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {follower.status === 'Active' ? (
                              <Wifi className="h-4 w-4 text-green-600" />
                            ) : (
                              <WifiOff className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-gray-900 font-medium">{follower.name}</span>
                          </div>
                          <Badge
                            variant={follower.status === 'Active' ? 'default' : 'secondary'}
                            className={follower.status === 'Active' ? 'bg-green-600 text-white' : 'bg-gray-500 text-white'}
                          >
                            {follower.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="text-gray-600">Ratio: 1x</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">Max: ${follower.maxTradeAmount}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">Balance: ${follower.balance.toFixed(2)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">{follower.lastActivity}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFollower(follower.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default CopyTradePage;
