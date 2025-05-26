import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Plus, Pencil, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedContainer from "@/components/AnimatedContainer"; // Import AnimatedContainer
import { motion } from "framer-motion"; // Import motion
import useLocalStorage from "@/hooks/useLocalStorage"; // Import useLocalStorage

interface ScheduleItem {
  id: string;
  fromTime: string; // Changed from date to fromTime
  toTime: string; // Added toTime field
  time: string; // This will store the formatted time range (e.g., "07:00 - 08:00")
  title: string;
  type: string;
  color: string;
}

interface ScheduleListProps {
  hideAddButton?: boolean;
  hideActions?: boolean; // New prop to hide edit/delete actions
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

const ScheduleList = ({ hideAddButton = false, hideActions = false }: ScheduleListProps) => { // Default hideActions to false
  const [addingSchedule, setAddingSchedule] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null); // State to track which item is being edited
  const [newFromTime, setNewFromTime] = useState(""); // State for new from time input
  const [newToTime, setNewToTime] = useState(""); // State for new to time input
  const [newTitle, setNewTitle] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");

  // Use useLocalStorage for persistent storage of schedule items
  const [scheduleItems, setScheduleItems] = useLocalStorage<ScheduleItem[]>('scheduleItems', [
    // Initial dummy data - will be replaced by local storage data on load
    {
      id: "1",
      fromTime: "07:00",
      toTime: "08:00",
      time: "07:00 - 08:00", // Formatted time range
      title: "Morning Routine",
      type: "Personal",
      color: "bg-yellow-100 border-l-4 border-yellow-400"
    },
    {
      id: "2",
      fromTime: "08:30",
      toTime: "12:00",
      time: "08:30 - 12:00", // Formatted time range
      title: "Deep Work Session",
      type: "Work",
      color: "bg-blue-50 border-l-4 border-blue-400"
    },
    {
      id: "3",
      fromTime: "12:30",
      toTime: "13:30",
      time: "12:30 - 13:30", // Formatted time range
      title: "Lunch & Quick Walk",
      type: "Fitness",
      color: "bg-green-50 border-l-4 border-green-400"
    },
    {
      id: "4",
      fromTime: "14:00",
      toTime: "16:30",
      time: "14:00 - 16:30", // Formatted time range
      title: "Team Meetings",
      type: "Work",
      color: "bg-blue-50 border-l-4 border-blue-400"
    },
    {
      id: "5",
      fromTime: "17:00",
      toTime: "19:00",
      time: "17:00 - 19:00", // Formatted time range
      title: "Family Dinner",
      type: "Family",
      color: "bg-purple-50 border-l-4 border-purple-400"
    },
  ]);

  // Display all items, no date filtering needed anymore
  const displayedScheduleItems = scheduleItems;


  const handleAddSchedule = () => {
    if (newFromTime.trim() === "" || newToTime.trim() === "" || newTitle.trim() === "") return;

    const selectedColorObj = colorOptions.find(c => c.value === selectedColor);
    const colorClass = selectedColorObj ? selectedColorObj.bgColor : colorOptions[0].bgColor;

    setScheduleItems([
      ...scheduleItems,
      {
        id: Date.now().toString(), // Simple unique ID
        fromTime: newFromTime,
        toTime: newToTime,
        time: `${newFromTime} - ${newToTime}`, // Format the time range for display
        title: newTitle,
        type: newLabel || selectedColorObj?.label || "Other",
        color: colorClass
      }
    ]);

    // Reset form fields
    setNewFromTime("");
    setNewToTime("");
    setNewTitle("");
    setNewLabel("");
    setSelectedColor("yellow");
    setAddingSchedule(false);
  };

  const handleEditSchedule = (item: ScheduleItem) => {
    setEditingScheduleId(item.id);
    setNewFromTime(item.fromTime); // Populate fromTime
    setNewToTime(item.toTime); // Populate toTime
    setNewTitle(item.title);
    setNewLabel(item.type);
    const currentColorValue = colorOptions.find(c => c.bgColor === item.color)?.value || "yellow";
    setSelectedColor(currentColorValue);
    setAddingSchedule(true); // Show the form for editing
  };

  const handleSaveEdit = () => {
    if (!editingScheduleId || newFromTime.trim() === "" || newToTime.trim() === "" || newTitle.trim() === "") return;

    const selectedColorObj = colorOptions.find(c => c.value === selectedColor);
    const colorClass = selectedColorObj ? selectedColorObj.bgColor : colorOptions[0].bgColor;

    setScheduleItems(scheduleItems.map(item =>
      item.id === editingScheduleId
        ? {
            ...item,
            fromTime: newFromTime,
            toTime: newToTime,
            time: `${newFromTime} - ${newToTime}`, // Re-format the time range
            title: newTitle,
            type: newLabel || selectedColorObj?.label || "Other",
            color: colorClass
          }
        : item
    ));

    // Reset form fields and editing state
    setEditingScheduleId(null);
    setNewFromTime("");
    setNewToTime("");
    setNewTitle("");
    setNewLabel("");
    setSelectedColor("yellow");
    setAddingSchedule(false);
  };

  const handleCancelEdit = () => {
    setEditingScheduleId(null);
    setNewFromTime("");
    setNewToTime("");
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
            <h3 className="text-lg font-medium">Today's Schedule</h3> {/* Keep title as Today's Schedule for now */}
          </div>
          {!hideAddButton && (
            <Button className="bg-green-500 hover:bg-green-600" onClick={() => {
              setAddingSchedule(true);
              setEditingScheduleId(null); // Ensure we are adding, not editing
              setNewFromTime(""); // Clear form fields when adding
              setNewToTime("");
              setNewTitle("");
              setNewLabel("");
              setSelectedColor("yellow");
            }}>
              <Plus className="h-4 w-4 mr-1" /> Add Schedule
            </Button>
          )}
        </div>

        {(addingSchedule || editingScheduleId) && ( // Show form if adding or editing
          <AnimatedContainer delay={0.1}>
            <div className="border rounded-md p-4 mb-6 bg-gray-50">
              <h4 className="font-medium mb-4">{editingScheduleId ? "Edit Schedule Entry" : "Add New Schedule Entry"}</h4> {/* Dynamic title */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 {/* Removed Date input */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">From Time (HH:mm)</p> {/* Changed label */}
                  <Input
                    type="time" // Changed input type to time
                    placeholder="e.g., 07:00"
                    value={newFromTime}
                    onChange={(e) => setNewFromTime(e.target.value)}
                  />
                </div>
                 <div>
                  <p className="text-sm text-gray-500 mb-1">To Time (HH:mm)</p> {/* Added To Time input */}
                  <Input
                    type="time" // Changed input type to time
                    placeholder="e.g., 08:00"
                    value={newToTime}
                    onChange={(e) => setNewToTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Task</p>
                  <Input
                    placeholder="Enter task name"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Label (Optional)</p>
                  <Input
                    placeholder="Enter label"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                <Button variant="outline" onClick={handleCancelEdit}> {/* Use handleCancelEdit */}
                  Cancel
                </Button>
                {editingScheduleId ? (
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleSaveEdit}> {/* Save button for editing */}
                    Save Changes
                  </Button>
                ) : (
                  <Button className="bg-green-500 hover:bg-green-600" onClick={handleAddSchedule}> {/* Add button for adding */}
                    Add Entry
                  </Button>
                )}
              </div>
            </div>
          </AnimatedContainer>
        )}

        <div className="space-y-2">
          {displayedScheduleItems.map((item, index) => ( // Display all items
            <AnimatedContainer key={item.id} delay={0.2 + index * 0.05}>
              <div className={`p-3 rounded ${item.color}`}>
                <div className="flex items-center gap-1 text-gray-600 mb-1">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs">{item.time}</span> {/* Display formatted time range */}
                </div>
                <p className="text-sm font-medium">{item.title}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">{item.type}</span>
                  {/* Conditionally render action buttons based on hideActions prop */}
                  {!hideActions && (
                    <div className="flex items-center gap-1">
                      <button
                        className="text-gray-400 p-1 rounded-full hover:bg-gray-100"
                        onClick={() => handleEditSchedule(item)} // Add edit handler
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        className="text-gray-400 p-1 rounded-full hover:bg-gray-100"
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
            <div className="text-center text-gray-500 py-4">
              No schedule entries found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleList;
