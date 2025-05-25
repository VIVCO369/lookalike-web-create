
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StatsCard from "@/components/StatsCard";
import AnimatedContainer from "@/components/AnimatedContainer";
import { Target, TrendingUp, Calendar, DollarSign, Plus, Edit2, Trash2 } from "lucide-react";

const TradeManageGoalsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [goals, setGoals] = useState([
    { id: 1, title: "Monthly Profit Target", target: "$5,000", current: "$3,200", progress: 64, deadline: "2024-01-31" },
    { id: 2, title: "Win Rate Goal", target: "75%", current: "68%", progress: 91, deadline: "2024-01-31" },
    { id: 3, title: "Risk Management", target: "2% max risk", current: "1.8%", progress: 90, deadline: "Ongoing" },
    { id: 4, title: "Trading Days", target: "20 days", current: "15 days", progress: 75, deadline: "2024-01-31" },
  ]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-yellow-500";
    return "bg-red-500";
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Trade Goals</h1>
              <p className="text-gray-600">Set and track your trading objectives</p>
            </div>
          </AnimatedContainer>

          {/* Stats Overview */}
          <AnimatedContainer delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Active Goals"
                value="4"
                color="text-blue-600"
                borderColor="border-blue-200"
              />
              <StatsCard
                title="Completed Goals"
                value="2"
                color="text-green-600"
                borderColor="border-green-200"
              />
              <StatsCard
                title="Average Progress"
                value="77.5%"
                color="text-purple-600"
                borderColor="border-purple-200"
              />
              <StatsCard
                title="Next Deadline"
                value="7 days"
                color="text-orange-600"
                borderColor="border-orange-200"
              />
            </div>
          </AnimatedContainer>

          {/* Add New Goal */}
          <AnimatedContainer delay={0.3}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="goalTitle">Goal Title</Label>
                    <Input id="goalTitle" placeholder="Enter goal title" />
                  </div>
                  <div>
                    <Label htmlFor="goalTarget">Target</Label>
                    <Input id="goalTarget" placeholder="Enter target value" />
                  </div>
                  <div>
                    <Label htmlFor="goalDeadline">Deadline</Label>
                    <Input id="goalDeadline" type="date" />
                  </div>
                </div>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </CardContent>
            </Card>
          </AnimatedContainer>

          {/* Goals List */}
          <AnimatedContainer delay={0.4}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Your Trading Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.map((goal, index) => (
                    <AnimatedContainer key={goal.id} delay={0.5 + index * 0.1}>
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-lg">{goal.title}</h3>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-500">Target</p>
                            <p className="font-medium">{goal.target}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Current</p>
                            <p className="font-medium">{goal.current}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Progress</p>
                            <p className="font-medium">{goal.progress}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Deadline</p>
                            <p className="font-medium">{goal.deadline}</p>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(goal.progress)}`}
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </AnimatedContainer>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
};

export default TradeManageGoalsPage;
