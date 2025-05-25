import { useState, useEffect } from "react";
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
import AnimatedContainer from "@/components/AnimatedContainer"; // Import AnimatedContainer
import { motion } from "framer-motion"; // Import motion


interface Rule {
  id: string;
  name: string;
  strategy?: string;
  completed?: boolean;
}

interface TradingRulesProps {
  hideAddButton?: boolean;
  showLastEntryOnly?: boolean; // This prop might become less relevant with strategy selection
  onProgressChange?: (progress: number) => void;
  dashboardView?: boolean; // New prop to indicate dashboard view
}

const TradingRules = ({ hideAddButton = false, showLastEntryOnly = false, onProgressChange, dashboardView = false }: TradingRulesProps) => {
  const [addingRule, setAddingRule] = useState(false);
  const [newRuleName, setNewRuleName] = useState("");
  const [newStrategyName, setNewStrategyName] = useState("");
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

  const itemsPerPage = 7;

  // State for selected strategy in dashboard view
  const [selectedStrategy, setSelectedStrategy] = useState<string | undefined>(undefined);

  // Determine which rules to display based on view and selection
  const rulesToDisplay = dashboardView
    ? rules.filter(rule => rule.strategy === selectedStrategy)
    : showLastEntryOnly // Keep showLastEntryOnly logic for non-dashboard use if needed
      ? rules.length > 0
        ? rules.filter(rule => rule.strategy === rules[rules.length - 1].strategy)
        : []
      : rules;

  const paginatedRules = dashboardView ? rulesToDisplay : rulesToDisplay.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = dashboardView ? 1 : Math.ceil(rulesToDisplay.length / itemsPerPage);


  // Calculate progress whenever rulesToDisplay change
  useEffect(() => {
    if (onProgressChange) {
      const completedRules = rulesToDisplay.filter(rule => rule.completed).length;
      const totalRules = rulesToDisplay.length;
      const progress = totalRules > 0 ? (completedRules / totalRules) * 100 : 0;
      onProgressChange(progress);
    }
  }, [rulesToDisplay, onProgressChange]);

  // Set initial selected strategy for dashboard view
  useEffect(() => {
    if (dashboardView && rules.length > 0 && !selectedStrategy) {
      // Set the last added strategy as the initial selected one
      setSelectedStrategy(rules[rules.length - 1].strategy);
    }
  }, [dashboardView, rules, selectedStrategy]);


  const handleAddRule = () => {
    if (newRuleName.trim() === "" || newStrategyName.trim() === "") return;

    const strategyPrefix = newStrategyName.trim().charAt(0).toUpperCase();
    const countForStrategy = rules.filter(r => r.strategy === newStrategyName.trim()).length;
    const id = `${strategyPrefix}${countForStrategy + 1}`;

    setRules([...rules, { id, name: newRuleName.trim(), strategy: newStrategyName.trim() }]);
    setNewRuleName("");
    setNewStrategyName("");
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

  const handleDeleteStrategy = (strategyName: string) => {
    setRules(rules.filter(rule => rule.strategy !== strategyName));
  };

  // Get unique strategy names for the select dropdown
  const uniqueStrategies = Array.from(new Set(rules.map(rule => rule.strategy))).filter(Boolean) as string[];


  const displayRulesByStrategy = () => {
    const grouped: { [key: string]: Rule[] } = {};

    // Group rulesToDisplay by strategy
    rulesToDisplay.forEach(rule => {
      const strategy = rule.strategy || "Uncategorized";
      if (!grouped[strategy]) {
        grouped[strategy] = [];
      }
      grouped[strategy].push(rule);
    });

    return Object.entries(grouped).map(([strategy, rules], index) => (
      <AnimatedContainer key={strategy} delay={0.2 + index * 0.1}>
        <div className="mb-6 border rounded p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-green-500 font-medium">{strategy}</h3>
            {/* Conditionally render Delete Strategy button */}
            {!dashboardView && !showLastEntryOnly && ( // Hide delete button in dashboard view and when showing only last entry
              <Button
                variant="outline"
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => handleDeleteStrategy(strategy)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete Strategy
              </Button>
            )}
          </div>
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
                  {/* Hide edit/delete rule buttons in dashboard view */}
                  {!dashboardView && (
                    <>
                      <button className="text-gray-400 p-1 rounded-full hover:bg-gray-100">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        className="text-gray-400 p-1 rounded-full hover:bg-gray-100"
                        onClick={() => handleRemoveRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedContainer>
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
          {!hideAddButton && !dashboardView && ( // Hide add button in dashboard view
            <Button className="bg-green-500 hover:bg-green-600" onClick={() => setAddingRule(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Strategy
            </Button>
          )}
        </div>

        {/* Strategy Select for Dashboard View */}
        {dashboardView && (
           <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">Select Strategy</p>
            <Select onValueChange={setSelectedStrategy} value={selectedStrategy}>
              <SelectTrigger>
                <SelectValue placeholder="Select a strategy" />
              </SelectTrigger>
              <SelectContent>
                {uniqueStrategies.map(strategy => (
                  <SelectItem key={strategy} value={strategy}>
                    {strategy}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}


        {/* Add Rule Form (Hidden in Dashboard View) */}
        {addingRule && !dashboardView && (
          <AnimatedContainer delay={0.1}>
            <div className="border rounded-md p-4 mb-6 bg-gray-50">
              <h4 className="font-medium mb-4">Add New Trading Rule</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Trading Rule Name</p>
                  <Input
                    placeholder="Enter rule name"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Trading Strategy Name</p>
                  <Input
                    placeholder="Enter strategy name"
                    value={newStrategyName}
                    onChange={(e) => setNewStrategyName(e.target.value)}
                  />
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
          </AnimatedContainer>
        )}

        {/* Display Rules (Filtered for Dashboard View) */}
        {displayRulesByStrategy()}

        {/* Pagination (Hidden in Dashboard View) */}
        {totalPages > 1 && !dashboardView && (
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, rulesToDisplay.length)} of {rulesToDisplay.length} strategies
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
                    className={totalPages === 0 || currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
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
