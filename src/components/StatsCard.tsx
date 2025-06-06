import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  color?: string;
  labelPosition?: "above" | "below";
  borderColor?: string;
  leftBorderColor?: string;
  icon?: LucideIcon;
}

const StatsCard = ({
  title,
  value,
  color = "text-gray-900 dark:text-gray-100",
  labelPosition = "above",
  borderColor = "border-gray-200 dark:border-gray-700",
  leftBorderColor = "border-l-gray-300",
  icon: Icon
}: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{
        y: -2,
        transition: { duration: 0.2 }
      }}
    >
      <Card className={cn(
        "border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden",
        leftBorderColor
      )}>
        {/* Left colored border */}
        <div className={cn("absolute left-0 top-0 bottom-0 w-1", leftBorderColor.replace('border-l-', 'bg-'))} />

        <CardContent className="p-4 pl-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {labelPosition === "above" && (
                <motion.div
                  className="space-y-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</p>
                  <p className={cn("text-2xl font-bold", color)}>{value}</p>
                </motion.div>
              )}
              {labelPosition === "below" && (
                <motion.div
                  className="space-y-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <p className={cn("text-2xl font-bold", color)}>{value}</p>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</p>
                </motion.div>
              )}
            </div>

            {/* Icon on the right */}
            {Icon && (
              <div className="ml-3 opacity-40">
                <Icon className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
