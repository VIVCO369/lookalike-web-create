
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className={cn("border-1", borderColor)}>
      <CardContent className="p-4">
        {labelPosition === "above" && (
          <div className="flex flex-col">
            <p className="text-sm text-gray-500">{title}</p>
            <p className={cn("text-lg font-semibold", color)}>{value}</p>
          </div>
        )}
        {labelPosition === "below" && (
          <div className="flex flex-col">
            <p className={cn("text-lg font-semibold", color)}>{value}</p>
            <p className="text-sm text-gray-500">{title}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
