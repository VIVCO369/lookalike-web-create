import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";

interface TimeSlot {
  time: string;
  status: "Yes" | "No";
}

interface Session {
  id: number;
  name: string;
  timeSlots: TimeSlot[];
  headerColor: string;
  backgroundColor: string;
}

const TradingSessions = () => {
  // Initialize sessions with default data and local storage
  const [sessions, setSessions] = useLocalStorage<Session[]>("tradingSessions", [
    {
      id: 1,
      name: "Session 1",
      timeSlots: [
        { time: "4:00-5:00", status: "Yes" },
        { time: "5:00-6:00", status: "No" },
        { time: "6:00-7:00", status: "Yes" },
        { time: "7:00-8:00", status: "Yes" }
      ],
      headerColor: "bg-amber-800",
      backgroundColor: "bg-amber-50 dark:bg-amber-900/20"
    },
    {
      id: 2,
      name: "Session 2",
      timeSlots: [
        { time: "9:00-10:00", status: "Yes" },
        { time: "10:00-11:00", status: "Yes" },
        { time: "11:00-12:00", status: "Yes" },
        { time: "12:00-13:00", status: "Yes" }
      ],
      headerColor: "bg-green-800",
      backgroundColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      id: 3,
      name: "Session 3",
      timeSlots: [
        { time: "13:00-14:00", status: "Yes" },
        { time: "14:00-15:00", status: "No" },
        { time: "15:00-16:00", status: "Yes" },
        { time: "16:00-17:00", status: "Yes" }
      ],
      headerColor: "bg-blue-800",
      backgroundColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      id: 4,
      name: "Session 4",
      timeSlots: [
        { time: "17:00-18:00", status: "No" },
        { time: "18:00-19:00", status: "Yes" },
        { time: "20:00-21:00", status: "No" },
        { time: "21:00-22:00", status: "No" }
      ],
      headerColor: "bg-yellow-700",
      backgroundColor: "bg-yellow-50 dark:bg-yellow-900/20"
    }
  ]);

  // Toggle status for a specific time slot
  const toggleTimeSlotStatus = (sessionId: number, timeSlotIndex: number) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === sessionId
          ? {
              ...session,
              timeSlots: session.timeSlots.map((slot, index) =>
                index === timeSlotIndex
                  ? { ...slot, status: slot.status === "Yes" ? "No" : "Yes" }
                  : slot
              )
            }
          : session
      )
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {sessions.map((session, sessionIndex) => (
        <motion.div
          key={session.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sessionIndex * 0.1 }}
        >
          <Card className={`${session.backgroundColor} border-gray-200 dark:border-gray-700 overflow-hidden`}>
            {/* Session Header */}
            <CardHeader className={`${session.headerColor} p-4`}>
              <CardTitle className="text-white text-center font-bold flex items-center justify-center gap-2">
                <Clock className="h-5 w-5" />
                {session.name}
              </CardTitle>
            </CardHeader>

            {/* Time Slots */}
            <CardContent className="p-4 space-y-3">
              {session.timeSlots.map((timeSlot, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Time Display */}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {timeSlot.time}
                    </span>
                  </div>

                  {/* Status Toggle Button */}
                  <Button
                    onClick={() => toggleTimeSlotStatus(session.id, index)}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-200 ${
                      timeSlot.status === "Yes"
                        ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25"
                        : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25"
                    }`}
                  >
                    {timeSlot.status}
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default TradingSessions;
