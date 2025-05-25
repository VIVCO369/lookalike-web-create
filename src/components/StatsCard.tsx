
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string;
  color?: string;
  labelPosition?: "above" | "below";
  borderColor?: string;
}

const StatsCard = ({ 
  title, 
  value, 
  color = "text-gray-900", 
  labelPosition = "above",
  borderColor = "border-gray-200"
}: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <Card className={cn(
        "border-1 shadow-lg hover:shadow-xl transition-shadow duration-300",
        borderColor
      )}>
        <CardContent className="p-4">
          {labelPosition === "above" && (
            <motion.div 
              className="flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <p className="text-sm text-gray-500">{title}</p>
              <p className={cn("text-lg font-semibold", color)}>{value}</p>
            </motion.div>
          )}
          {labelPosition === "below" && (
            <motion.div 
              className="flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <p className={cn("text-lg font-semibold", color)}>{value}</p>
              <p className="text-sm text-gray-500">{title}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
