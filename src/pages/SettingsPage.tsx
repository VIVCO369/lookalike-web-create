
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Interface for settings data
interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
  userName: string;
  email: string;
}

const initialSettings: AppSettings = {
  darkMode: false,
  notifications: true,
  userName: "",
  email: ""
};

const SettingsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settings, setSettings] = useLocalStorage<AppSettings>("appSettings", initialSettings);
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleInputChange = (field: keyof AppSettings, value: string | boolean) => {
    setSettings({ ...settings, [field]: value });
  };

  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
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
          <div>
            <Button onClick={saveSettings} className="bg-green-500 hover:bg-green-600 text-white">
              Save Changes
            </Button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Application Settings</h2>

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="userName">Username</Label>
                    <Input 
                      id="userName"
                      value={settings.userName} 
                      onChange={(e) => handleInputChange("userName", e.target.value)}
                      placeholder="Your username" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      type="email" 
                      value={settings.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your.email@example.com" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable dark theme</p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => handleInputChange("darkMode", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications about new trades</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) => handleInputChange("notifications", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <p className="text-gray-600 text-sm">
              Settings are automatically saved to your browser's local storage. 
              For a full account system with cloud storage, a backend implementation would be required.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
