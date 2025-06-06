import { useState, useEffect, useMemo } from "react"; // Import useMemo
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, X, Plus, Check, Pencil, Trash2, ChevronDown } from "lucide-react"; // Removed Settings icon
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
import { cn } from "@/lib/utils"; // Import cn utility
import useLocalStorage from "@/hooks/useLocalStorage"; // Import useLocalStorage


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
  // Use useLocalStorage for persistent storage of rules
  const [rules, setRules] = useLocalStorage<Rule[]>('tradingRules', []);

  // Debug: Log rules whenever they change
  useEffect(() => {
    console.log('Rules updated:', rules);
    console.log('localStorage tradingRules:', localStorage.getItem('tradingRules'));
  }, [rules]);

  const itemsPerPage = 2; // Paginate by 2 strategies per page

  // State for selected strategy in dashboard view
  const [selectedStrategy, setSelectedStrategy] = useState<string | undefined>(undefined);

  // State for editing rules
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editRuleName, setEditRuleName] = useState("");
  const [editStrategyName, setEditStrategyName] = useState("");

  // Get unique strategy names for the select dropdown and pagination
  const uniqueStrategies = useMemo(() => {
    const strategies = Array.from(new Set(rules.map(rule => rule.strategy))).filter(Boolean) as string[];
    // Sort strategies alphabetically for consistent pagination order
    return strategies.sort();
  }, [rules]);


  // Determine which strategies to display based on view and selection
  const strategiesToDisplay = useMemo(() => {
    if (dashboardView) {
      return uniqueStrategies.filter(strategy => strategy === selectedStrategy);
    } else if (showLastEntryOnly && rules.length > 0) {
      // Find the strategy of the last added rule
      const lastStrategy = rules[rules.length - 1].strategy;
      return lastStrategy ? [lastStrategy] : [];
    } else {
      return uniqueStrategies;
    }
  }, [dashboardView, showLastEntryOnly, rules, selectedStrategy, uniqueStrategies]);


  // Calculate total pages based on strategiesToDisplay
  const totalPages = dashboardView ? 1 : Math.ceil(strategiesToDisplay.length / itemsPerPage);

  // Get paginated strategies for the current page
  const paginatedStrategies = useMemo(() => {
    if (dashboardView) {
      return strategiesToDisplay; // No pagination in dashboard view, show selected strategy
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    return strategiesToDisplay.slice(startIndex, startIndex + itemsPerPage);
  }, [strategiesToDisplay, currentPage, itemsPerPage, dashboardView]);


  // Calculate progress whenever rulesToDisplay change
  useEffect(() => {
    if (onProgressChange) {
      // Calculate progress based on the rules currently being displayed (within the paginated strategies)
      const rulesInView = rules.filter(rule => paginatedStrategies.includes(rule.strategy || "Uncategorized"));
      const completedRules = rulesInView.filter(rule => rule.completed).length;
      const totalRules = rulesInView.length;
      const progress = totalRules > 0 ? (completedRules / totalRules) * 100 : 0;
      onProgressChange(progress);
    }
  }, [paginatedStrategies, rules, onProgressChange]); // Depend on paginatedStrategies


  // Set initial selected strategy for dashboard view
  useEffect(() => {
    if (dashboardView && uniqueStrategies.length > 0 && !selectedStrategy) {
      // Set the first strategy as the initial selected one
      setSelectedStrategy(uniqueStrategies[0]);
    }
  }, [dashboardView, uniqueStrategies, selectedStrategy]);


  const handleAddRule = () => {
    console.log('handleAddRule called', { newRuleName, newStrategyName }); // Debug log

    if (newRuleName.trim() === "" || newStrategyName.trim() === "") {
      console.log('Validation failed - empty fields'); // Debug log
      return;
    }

    // Generate a unique ID for the new rule
    const id = Date.now().toString();
    const newRule = { id, name: newRuleName.trim(), strategy: newStrategyName.trim() };

    console.log('Adding new rule:', newRule); // Debug log
    console.log('Current rules before adding:', rules); // Debug log

    // Update rules using the setter from useLocalStorage
    setRules([...rules, newRule]);
    setNewRuleName("");
    setNewStrategyName("");
    setAddingRule(false);

    console.log('Rule added successfully'); // Debug log
  };

  const handleRemoveRule = (id: string) => {
    // Update rules using the setter from useLocalStorage
    setRules(rules.filter(rule => rule.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    // Update rules using the setter from useLocalStorage
    setRules(
      rules.map(rule =>
        rule.id === id ? { ...rule, completed: !rule.completed } : rule
      )
    );
  };

  const handleDeleteStrategy = (strategyName: string) => {
    // Update rules using the setter from useLocalStorage
    setRules(rules.filter(rule => rule.strategy !== strategyName));
    // If the deleted strategy was the selected one in dashboard view, reset selection
    if (dashboardView && selectedStrategy === strategyName) {
        setSelectedStrategy(uniqueStrategies.filter(s => s !== strategyName)[0] || undefined);
    }
  };

  // Handle editing a rule
  const handleEditRule = (rule: Rule) => {
    setEditingRuleId(rule.id);
    setEditRuleName(rule.name);
    setEditStrategyName(rule.strategy || "");
  };

  // Handle saving edited rule
  const handleSaveEditedRule = () => {
    if (editingRuleId && editRuleName.trim() && editStrategyName.trim()) {
      setRules(rules.map(rule =>
        rule.id === editingRuleId
          ? { ...rule, name: editRuleName.trim(), strategy: editStrategyName.trim() }
          : rule
      ));
      setEditingRuleId(null);
      setEditRuleName("");
      setEditStrategyName("");
    }
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingRuleId(null);
    setEditRuleName("");
    setEditStrategyName("");
  };


  const displayRulesByStrategy = () => {
    const grouped: { [key: string]: Rule[] } = {};

    // Group ALL rules by strategy first
    rules.forEach(rule => {
      const strategy = rule.strategy || "Uncategorized";
      if (!grouped[strategy]) {
        grouped[strategy] = [];
      }
      grouped[strategy].push(rule);
    });

    // Now, only display the groups for the paginated strategies
    return paginatedStrategies.map((strategy, index) => {
      const rulesForStrategy = grouped[strategy] || [];
      return (
        <AnimatedContainer key={strategy} delay={0.2 + index * 0.1}>
          <div className="mb-6 border rounded p-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"> {/* Added dark mode styles */}
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
              {rulesForStrategy.map(rule => (
                <div key={rule.id}>
                  {editingRuleId === rule.id ? (
                    // Edit form for the rule
                    <div className="border rounded p-3 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400">Rule Name</label>
                          <Input
                            value={editRuleName}
                            onChange={(e) => setEditRuleName(e.target.value)}
                            className="mt-1 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            placeholder="Enter rule name"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400">Strategy Name</label>
                          <Input
                            value={editStrategyName}
                            onChange={(e) => setEditStrategyName(e.target.value)}
                            className="mt-1 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            placeholder="Enter strategy name"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                          <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={handleSaveEditedRule}>
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Normal rule display
                    <div className="flex items-center justify-between border rounded p-3 bg-white dark:bg-gray-800 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 dark:text-gray-200">{rule.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {/* Improved Checkbox Button Styling */}
                        <button
                          className={cn(
                            "w-6 h-6 flex items-center justify-center rounded-full border-2 transition-colors",
                            rule.completed
                              ? "bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600"
                              : "bg-white border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                          )}
                          onClick={() => handleToggleComplete(rule.id)}
                        >
                          <Check className={cn("h-4 w-4", rule.completed ? "text-white" : "text-gray-400 dark:text-gray-500")} />
                        </button>
                        {/* Hide edit/delete rule buttons in dashboard view */}
                        {!dashboardView && (
                          <>
                            <button
                              className="text-gray-400 dark:text-gray-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                              onClick={() => handleEditRule(rule)}
                              title="Edit rule"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              className="text-gray-400 dark:text-gray-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                              onClick={() => handleRemoveRule(rule.id)}
                              title="Delete rule"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </AnimatedContainer>
      );
    });
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-gray-600 dark:text-gray-400" /> {/* Added dark mode text color */}
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Trading Rules</h3> {/* Added dark mode text color */}
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
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Select Strategy</p> {/* Added dark mode text color */}
            <Select onValueChange={setSelectedStrategy} value={selectedStrategy}>
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"> {/* Added dark mode styles */}
                <SelectValue placeholder="Select a strategy" />
                {/* Removed the SelectPrimitive.Icon component */}
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"> {/* Added dark mode styles */}
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
            <div className="border rounded-md p-4 mb-6 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"> {/* Added dark mode styles */}
              <h4 className="font-medium mb-4 text-gray-800 dark:text-gray-200">Add New Trading Rule</h4> {/* Added dark mode text color */}

              <form onSubmit={(e) => { e.preventDefault(); handleAddRule(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Trading Rule Name</p> {/* Added dark mode text color */}
                  <Input
                    placeholder="Enter rule name"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddRule()}
                    className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400" // Added dark mode styles
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Trading Strategy Name</p> {/* Added dark mode text color */}
                  <Input
                    placeholder="Enter strategy name"
                    value={newStrategyName}
                    onChange={(e) => setNewStrategyName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddRule()}
                    className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400" // Added dark mode styles
                  />
                </div>
              </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setAddingRule(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600"
                    disabled={!newRuleName.trim() || !newStrategyName.trim()}
                  >
                    Add Rule
                  </Button>
                </div>

                {/* Debug info */}
                <div className="mt-2 text-xs text-gray-500">
                  Debug: Rule name: "{newRuleName}" | Strategy: "{newStrategyName}" | Valid: {(newRuleName.trim() && newStrategyName.trim()) ? 'Yes' : 'No'}
                </div>
              </form>
            </div>
          </AnimatedContainer>
        )}

        {/* Display Rules (Filtered for Dashboard View) */}
        {displayRulesByStrategy()}

        {/* Pagination (Hidden in Dashboard View) */}
        {totalPages > 1 && !dashboardView && (
          <div className="mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2"> {/* Added dark mode text color */}
              Showing strategies {Math.min((currentPage - 1) * itemsPerPage + 1, strategiesToDisplay.length)} to {Math.min(currentPage * itemsPerPage, strategiesToDisplay.length)} of {strategiesToDisplay.length}
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {/* Render page numbers */}
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                   // Show current page and at most 2 pages before and after, plus first/last
                   if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNumber)}
                          isActive={pageNumber === currentPage}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  // Show ellipsis for skipped pages
                  else if (
                    (pageNumber === currentPage - 3 && currentPage > 3) ||
                    (pageNumber === currentPage + 3 && currentPage < totalPages - 2)
                  ) {
                    return <PaginationItem key={pageNumber}>...</PaginationItem>;
                  }
                  return null;
                })}
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
