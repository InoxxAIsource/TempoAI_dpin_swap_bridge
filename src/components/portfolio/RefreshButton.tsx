import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface RefreshButtonProps {
  onRefresh: () => Promise<void>;
  lastRefreshed: Date | null;
}

export const RefreshButton = ({ onRefresh, lastRefreshed }: RefreshButtonProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      toast({
        title: "Portfolio Refreshed",
        description: "Successfully loaded latest data",
      });
    } catch (error) {
      console.error("Refresh failed:", error);
      toast({
        title: "Refresh Failed",
        description: "Could not load latest data",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleRefresh}
        disabled={isRefreshing}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        Refresh
      </Button>
      {lastRefreshed && (
        <span className="text-xs text-muted-foreground">
          Last: {lastRefreshed.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};
