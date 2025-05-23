import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Plus, Pencil, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  type: string;
  color: string;
}

interface ScheduleListProps {
  hideAddButton?: boolean;
}

const colorOptions = [
  { label: "Yellow", value: "yellow", bgColor: "bg-yellow-100 border-l-4 border-yellow-400" },
  { label: "Blue", value: "blue", bgColor: "bg-blue-50 border-l-4 border-blue-400" },
  { label: "Green", value: "green", bgColor: "bg-green-50 border-l-4 border-green-400" },
  { label: "Purple", value: "purple", bgColor: "bg-purple-50 border-l-4 border-purple-400" },
  { label: "Red", value: "red", bgColor: "bg-red-50 border-l-4 border-red-400" }, // Added Red
  { label: "Indigo", value: "indigo", bgColor: "bg-indigo-50 border-l-4 border-indigo-400" }, // Added another color
  { label: "Pink", value: "pink", bgColor: "bg-pink-50 border-l-4 border-pink-400" }, // Added another color
];

const ScheduleList = ({ hideAddButton = false }: ScheduleListProps) => {
  const [addingSchedule, setAddingSchedule] = useState(false);
  const [newTime, setNewTime] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");

  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    {
      id: "1",
      time: "07:00 - 08:00",
      title: "Morning Routine",
      type: "Personal",
      color: "bg-yellow-100 border-l-4 border-yellow-400"
    },
    {
      id: "2",
      time: "08:30 - 12:00",
      title: "Deep Work Session",
      type: "Work",
      color: "bg-blue-50 border-l-4 border-blue-400"
    },
    {
      id: "3",
      time: "12:30 - 13:30",
      title: "Lunch & Quick Walk",
      type: "Fitness",
      color: "bg-green-50 border-l-4 border-green-400"
    },
    {
      id: "4",
      time: "14:00 - 16:30",
      title: "Team Meetings",
      type: "Work",
      color: "bg-blue-50 border-l-4 border-blue-400"
    },
    {
      id: "5",
      time: "17:00 - 19:00",
      title: "Family Dinner",
      type: "Family",
      color: "bg-purple-50 border-l-4 border-purple-400"
    },
  ]);

  const handleAddSchedule = () => {
    if (newTime.trim() === "" || newTitle.trim() === "") return;

    const selectedColorObj = colorOptions.find(c => c.value === selectedColor);
    const colorClass = selectedColorObj ? selectedColorObj.bgColor : colorOptions[0].bgColor;

    setScheduleItems([
      ...scheduleItems,
      {
        id: Date.now().toString(),
        time: newTime,
        title: newTitle,
        type: newLabel || selectedColorObj?.label || "Other",
        color: colorClass
      }
    ]);

    setNewTime("");
    setNewTitle("");
    setNewLabel("");
    setSelectedColor("yellow");
    setAddingSchedule(false);
  };

  const handleRemoveSchedule = (id: string) => {
    setScheduleItems(scheduleItems.filter(item => item.id !== id));
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-medium">Today's Schedule</h3>
          </div>
          {!hideAddButton && (
            <Button className="bg-green-500 hover:bg-green-600" onClick={() => setAddingSchedule(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Schedule
            </Button>
          )}
        </div>

        {addingSchedule && (
          <div className="border rounded-md p-4 mb-6 bg-gray-50">
            <h4 className="font-medium mb-4">Add New Schedule Entry</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Time (e.g., 07:00 - 08:00)</p>
                <Input
                  placeholder="e.g., 07:00 - 08:00"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Task</p>
                <Input
                  placeholder="Enter task name"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Label (Optional)</p>
                <Input
                  placeholder="Enter label"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Color</p>
                <Select onValueChange={setSelectedColor} value={selectedColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map(color => (
                      <SelectItem key={color.value} value={color.value}>
                        {color.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setAddingSchedule(false)}>
                Cancel
              </Button>
              <Button className="bg-green-500 hover:bg-green-600" onClick={handleAddSchedule}>
                Add Entry
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {scheduleItems.map((item) => (
            <div key={item.id} className={`p-3 rounded ${item.color}`}>
              <div className="flex items-center gap-1 text-gray-600 mb-1">
                <Clock className="h-3 w-3" />
                <span className="text-xs">{item.time}</span>
              </div>
              <p className="text-sm font-medium">{item.title}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">{item.type}</span>
                <div className="flex items-center gap-1">
                  <button className="text-gray-400 p-1 rounded-full hover:bg-gray-100">
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    className="text-gray-400 p-1 rounded-full hover:bg-gray-100"
                    onClick={() => handleRemoveSchedule(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleList;
