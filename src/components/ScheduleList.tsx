import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Plus, Pencil, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedContainer from "@/components/AnimatedContainer";
import { motion } from "framer-motion";
import useLocalStorage from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils"; // Import cn utility

interface ScheduleItem {
  id: string;
  fromTime: string;
  toTime: string;
  time: string;
  title: string;
  type: string;
  color: string;
}

interface ScheduleListProps {
  hideAddButton?: boolean;
  hideActions?: boolean;
}

const colorOptions = [
  // Adjusted dark mode classes to better match the image
  { label: "Yellow", value: "yellow", bgColor: "bg-yellow-100 border-l-4 border-yellow-400 dark:bg-[#3a301a] dark:border-yellow-600" },
  { label: "Blue", value: "blue", bgColor: "bg-blue-50 border-l-4 border-blue-400 dark:bg-[#1a2b4d] dark:border-blue-600" },
  { label: "Green", value: "green", bgColor: "bg-green-50 border-l-4 border-green-400 dark:bg-[#1a3a2a] dark:border-green-600" },
  { label: "Purple", value: "purple", bgColor: "bg-purple-50 border-l-4 border-purple-400 dark:bg-[#3a1a4d] dark:border-purple-600" },
  { label: "Red", value: "red", bgColor: "bg-red-50 border-l-4 border-red-400 dark:bg-[#4d1a1a] dark:border-red-600" },
  { label: "Indigo", value: "indigo", bgColor: "bg-indigo-50 border-l-4 border-indigo-400 dark:bg-[#2a1a4d] dark:border-indigo-600" },
  { label: "Pink", value: "pink", bgColor: "bg-pink-50 border-l-4 border-pink-400 dark:bg-[#4d1a3a] dark:border-pink-600" },
];

const ScheduleList = ({ hideAddButton = false, hideActions = false }: ScheduleListProps) => {
  const [addingSchedule, setAddingSchedule] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [newFromTime, setNewFromTime] = useState("");
  const [newToTime, setNewToTime] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");

  const [scheduleItems, setScheduleItems] = useLocalStorage<ScheduleItem[]>('scheduleItems', [
    {
      id: "1",
      fromTime: "07:00",
      toTime: "08:00",
      time: "07:00 - 08:00",
      title: "Morning Routine",
      type: "Personal",
      color: "bg-yellow-100 border-l-4 border-yellow-400 dark:bg-[#3a301a] dark:border-yellow-600" // Updated dark mode classes
    },
    {
      id: "2",
      fromTime: "08:30",
      toTime: "12:00",
      time: "08:30 - 12:00",
      title: "Deep Work Session",
      type: "Work",
      color: "bg-blue-50 border-l-4 border-blue-400 dark:bg-[#1a2b4d] dark:border-blue-600" // Updated dark mode classes
    },
    {
      id: "3",
      fromTime: "12:30",
      toTime: "13:30",
      time: "12:30 - 13:30",
      title: "Lunch & Quick Walk",
      type: "Fitness",
      color: "bg-green-50 border-l-4 border-green-400 dark:bg-[#1a3a2a] dark:border-green-600" // Updated dark mode classes
    },
    {
      id: "4",
      fromTime: "14:00",
      toTime: "16:30",
      time: "14:00 - 16:30",
      title: "Team Meetings",
      type: "Work",
      color: "bg-blue-50 border-l-4 border-blue-400 dark:bg-[#1a2b4d] dark:border-blue-600" // Updated dark mode classes
    },
    {
      id: "5",
      fromTime: "17:00",
      toTime: "19:00",
      time: "17:00 - 19:00",
      title: "Family Dinner",
      type: "Family",
      color: "bg-purple-50 border-l-4 border-purple-400 dark:bg-[#3a1a4d] dark:border-purple-600" // Updated dark mode classes
    },
  ]);

  const displayedScheduleItems = scheduleItems;

  const handleAddSchedule = () => {
    if (newFromTime.trim() === "" || newToTime.trim() === "" || newTitle.trim() === "") return;

    const selectedColorObj = colorOptions.find(c => c.value === selectedColor);
    const colorClass = selectedColorObj ? selectedColorObj.bgColor : colorOptions[0].bgColor;

    const newItem = {
      id: Date.now().toString(),
      fromTime: newFromTime,
      toTime: newToTime,
      time: `${newFromTime} - ${newToTime}`,
      title: newTitle,
      type: selectedColorObj?.label || "Other",
      color: colorClass
    };

    setScheduleItems([...scheduleItems, newItem]);

    // Reset form fields
    setNewFromTime("");
    setNewToTime("");
    setNewTitle("");
    setSelectedColor("yellow");
    setAddingSchedule(false);
  };

  const handleEditSchedule = (item: ScheduleItem) => {
    setEditingScheduleId(item.id);
    setNewFromTime(item.fromTime);
    setNewToTime(item.toTime);
    setNewTitle(item.title);
    const currentColorValue = colorOptions.find(c => c.bgColor === item.color)?.value || "yellow";
    setSelectedColor(currentColorValue);
    setAddingSchedule(true);
  };

  const handleSaveEdit = () => {
    if (!editingScheduleId || newFromTime.trim() === "" || newToTime.trim() === "" || newTitle.trim() === "") return;

    const selectedColorObj = colorOptions.find(c => c.value === selectedColor);
    const colorClass = selectedColorObj ? selectedColorObj.bgColor : colorOptions[0].bgColor;

    const updatedItems = scheduleItems.map(item =>
      item.id === editingScheduleId
        ? {
            ...item,
            fromTime: newFromTime,
            toTime: newToTime,
            time: `${newFromTime} - ${newToTime}`,
            title: newTitle,
            type: selectedColorObj?.label || "Other",
            color: colorClass
          }
        : item
    );

    setScheduleItems(updatedItems);

    // Reset form fields and editing state
    setEditingScheduleId(null);
    setNewFromTime("");
    setNewToTime("");
    setNewTitle("");
    setSelectedColor("yellow");
    setAddingSchedule(false);
  };

  const handleCancelEdit = () => {
    setEditingScheduleId(null);
    setNewFromTime("");
    setNewToTime("");
    setNewTitle("");
    setSelectedColor("yellow");
    setAddingSchedule(false);
  };

  const handleRemoveSchedule = (id: string) => {
    const filteredItems = scheduleItems.filter(item => item.id !== id);
    setScheduleItems(filteredItems);
  };

  const getPreviewColor = () => {
    const selectedColorObj = colorOptions.find(c => c.value === selectedColor);
    return selectedColorObj ? selectedColorObj.bgColor : colorOptions[0].bgColor;
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" /> {/* Added dark mode text color */}
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Schedule</h3> {/* Added dark mode text color */}
          </div>
          {!hideAddButton && (
            <Button className="bg-green-500 hover:bg-green-600" onClick={() => {
              setAddingSchedule(true);
              setEditingScheduleId(null);
              setNewFromTime("");
              setNewToTime("");
              setNewTitle("");
              setSelectedColor("yellow");
            }}>
              <Plus className="h-4 w-4 mr-1" /> Add Schedule
            </Button>
          )}
        </div>

        {(addingSchedule || editingScheduleId) && (
          <AnimatedContainer delay={0.1}>
            <div className="border rounded-md p-4 mb-6 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"> {/* Added dark mode styles */}
              <h4 className="font-medium mb-4 text-gray-800 dark:text-gray-200">{editingScheduleId ? "Edit Schedule Entry" : "Add New Schedule Entry"}</h4> {/* Added dark mode text color */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">From Time</p> {/* Added dark mode text color */}
                  <Input
                    type="time"
                    value={newFromTime}
                    onChange={(e) => setNewFromTime(e.target.value)}
                    className="dark:bg-gray-600 dark:border-gray-500 dark:text-white" // Added dark mode styles
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">To Time</p> {/* Added dark mode text color */}
                  <Input
                    type="time"
                    value={newToTime}
                    onChange={(e) => setNewToTime(e.target.value)}
                    className="dark:bg-gray-600 dark:border-gray-500 dark:text-white" // Added dark mode styles
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Task</p> {/* Added dark mode text color */}
                  <Input
                    placeholder="Enter task name"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400" // Added dark mode styles
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Color</p> {/* Added dark mode text color */}
                  <Select onValueChange={setSelectedColor} value={selectedColor}>
                    <SelectTrigger className="dark:bg-gray-600 dark:border-gray-500 dark:text-white"> {/* Added dark mode styles */}
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"> {/* Added dark mode styles */}
                      {colorOptions.map(color => (
                        <SelectItem key={color.value} value={color.value}>
                          {color.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Preview */}
              {(newFromTime || newToTime || newTitle) && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Preview:</p> {/* Added dark mode text color */}
                  <div className={cn("p-3 rounded", getPreviewColor())}> {/* Use cn for dynamic class */}
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 mb-1"> {/* Added dark mode text color */}
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">
                        {newFromTime && newToTime ? `${newFromTime} - ${newToTime}` : "Time range"}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{newTitle || "Task name"}</p> {/* Added dark mode text color */}
                    {/* Removed the span for the color label */}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                {editingScheduleId ? (
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleSaveEdit}>
                    Save Changes
                  </Button>
                ) : (
                  <Button className="bg-green-500 hover:bg-green-600" onClick={handleAddSchedule}>
                    Add Entry
                  </Button>
                )}
              </div>
            </div>
          </AnimatedContainer>
        )}

        <div className="space-y-2">
          {displayedScheduleItems.map((item, index) => (
            <AnimatedContainer key={item.id} delay={0.2 + index * 0.05}>
              <div className={cn("p-3 rounded", item.color)}> {/* Use cn for dynamic class */}
                <div className="flex justify-between items-center"> {/* Use flex to align time/task and icons */}
                  <div> {/* Container for time and task */}
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 mb-1"> {/* Added dark mode text color */}
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">{item.time}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{item.title}</p> {/* Added dark mode text color */}
                  </div>
                  {!hideActions && (
                    <div className="flex items-center gap-1"> {/* Container for icons */}
                      <button
                        className="text-gray-400 dark:text-gray-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600" // Added dark mode styles
                        onClick={() => handleEditSchedule(item)}
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        className="text-gray-400 dark:text-gray-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600" // Added dark mode styles
                        onClick={() => handleRemoveSchedule(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedContainer>
          ))}
          {displayedScheduleItems.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4"> {/* Added dark mode text color */}
              No schedule entries found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleList;
