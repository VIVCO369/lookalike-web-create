
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

const ScheduleList = () => {
  const scheduleItems = [
    { 
      time: "07:00 - 08:00", 
      title: "Morning Routine", 
      type: "Personal",
      color: "bg-yellow-100 border-l-4 border-yellow-400" 
    },
    { 
      time: "08:30 - 12:00", 
      title: "Deep Work Session", 
      type: "Work",
      color: "bg-blue-50 border-l-4 border-blue-400" 
    },
    { 
      time: "12:30 - 13:30", 
      title: "Lunch & Quick Walk", 
      type: "Fitness",
      color: "bg-green-50 border-l-4 border-green-400" 
    },
    { 
      time: "14:00 - 16:30", 
      title: "Team Meetings", 
      type: "Work",
      color: "bg-blue-50 border-l-4 border-blue-400" 
    },
    { 
      time: "17:00 - 19:00", 
      title: "Family Dinner", 
      type: "Family",
      color: "bg-purple-50 border-l-4 border-purple-400" 
    },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium">Today's Schedule</h3>
        </div>
        <div className="space-y-2">
          {scheduleItems.map((item, index) => (
            <div key={index} className={`p-3 rounded ${item.color}`}>
              <div className="flex items-center gap-1 text-gray-600 mb-1">
                <Clock className="h-3 w-3" />
                <span className="text-xs">{item.time}</span>
              </div>
              <p className="text-sm font-medium">{item.title}</p>
              <div className="flex justify-end">
                <span className="text-xs text-gray-500">{item.type}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleList;
