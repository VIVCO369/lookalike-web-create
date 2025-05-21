
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, X } from "lucide-react";

const TradingRules = () => {
  const rules = [
    { id: "R1", name: "Rule #1" },
    { id: "R2", name: "Rule #2" },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium">Trading Rules</h3>
        </div>
        <p className="text-green-500 text-sm mb-2">Strategy B</p>
        <div className="space-y-2">
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between border rounded p-3">
              <span className="text-gray-700">{rule.name}</span>
              <button className="text-gray-400">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingRules;
