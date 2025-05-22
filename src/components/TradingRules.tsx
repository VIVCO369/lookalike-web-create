import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, X, Plus, Check, Pencil, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

interface Rule {
  id: string;
  name: string;
  strategy?: string;
  completed?: boolean;
}

interface TradingRulesProps {
  hideAddButton?: boolean;
}

const TradingRules = ({ hideAddButton = false }: TradingRulesProps) => {
  const [addingRule, setAddingRule] = useState(false);
  const [newRuleName, setNewRuleName] = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rules, setRules] = useState<Rule[]>([
    { id: "G1", name: "Morning Meditation", strategy: "General Rules" },
    { id: "G2", name: "Drink 8 Glasses of Water", strategy: "General Rules" },
    { id: "G3", name: "Read for 20 Minutes", strategy: "General Rules" },
    { id: "G4", name: "Exercise", strategy: "General Rules", completed: true },
    { id: "A1", name: "Rule A1", strategy: "Strategy A" },
    { id: "A2", name: "Rule A2", strategy: "Strategy A" },
    { id: "A3", name: "Rule A3", strategy: "Strategy A", completed: true },
    { id: "B1", name: "Rule B1", strategy: "Strategy B" },
    { id: "B2", name: "Rule B2", strategy: "Strategy B" },
  ]);

  const strategies = ["General Rules", "Strategy A", "Strategy B", "Strategy C"];
  const itemsPerPage = 7;

  const handleAddRule = () => {
    if (newRuleName.trim() === "" || selectedStrategy === "") return;
    
    const id = `${selectedStrategy.charAt(0)}${rules.filter(r => r.strategy === selectedStrategy).length + 1}`;
    setRules([...rules, { id, name: newRuleName, strategy: selectedStrategy }]);
    setNewRuleName("");
    setAddingRule(false);
  };

  const handleRemoveRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setRules(
      rules.map(rule => 
        rule.id === id ? { ...rule, completed: !rule.completed } : rule
      )
    );
  };

  const paginatedRules = rules.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(rules.length / itemsPerPage);

  const displayRulesByStrategy = () => {
    const grouped: { [key: string]: Rule[] } = {};
    
    paginatedRules.forEach(rule => {
      const strategy = rule.strategy || "Uncategorized";
      if (!grouped[strategy]) {
        grouped[strategy] = [];
      }
      grouped[strategy].push(rule);
    });

    return Object.entries(grouped).map(([strategy, rules]) => (
      <div key={strategy} className="mb-6">
        <h3 className="text-green-500 font-medium mb-2">{strategy}</h3>
        <div className="space-y-2">
          {rules.map(rule => (
            <div key={rule.id} className="flex items-center justify-between border rounded p-3 bg-white">
              <div className="flex items-center gap-2">
                <span className="text-gray-700">{rule.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  className={`text-gray-400 p-1 rounded-full hover:bg-gray-100 ${rule.completed ? 'bg-green-100' : ''}`}
                  onClick={() => handleToggleComplete(rule.id)}
                >
                  {rule.completed ? <Check className="h-4 w-4 text-green-500" /> : <Check className="h-4 w-4" />}
                </button>
                <button className="text-gray-400 p-1 rounded-full hover:bg-gray-100">
                  <Pencil className="h-4 w-4" />
                </button>
                <button 
                  className="text-gray-400 p-1 rounded-full hover:bg-gray-100"
                  onClick={() => handleRemoveRule(rule.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-medium">Trading Rules</h3>
          </div>
          {!hideAddButton && (
            <Button className="bg-green-500 hover:bg-green-600" onClick={() => setAddingRule(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Strategy
            </Button>
          )}
        </div>

        {addingRule && (
          <div className="border rounded-md p-4 mb-6 bg-gray-50">
            <h4 className="font-medium mb-4">Add New Trading Rule</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Trading Rules</p>
                <Input
                  placeholder="Enter rule name"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Trading Strategy</p>
                <Select onValueChange={setSelectedStrategy} value={selectedStrategy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    {strategies.map(strategy => (
                      <SelectItem key={strategy} value={strategy}>
                        {strategy}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setAddingRule(false)}>
                Cancel
              </Button>
              <Button className="bg-green-500 hover:bg-green-600" onClick={handleAddRule}>
                Add Rule
              </Button>
            </div>
          </div>
        )}

        {displayRulesByStrategy()}

        {totalPages > 1 && (
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, rules.length)} of {rules.length} strategies
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive={true}>
                    Page {currentPage} of {totalPages}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingRules;
