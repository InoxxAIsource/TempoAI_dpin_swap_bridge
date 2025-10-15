import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Trash2, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface DebugPanelProps {
  userId: string | null;
  deviceCount: number;
  dataAge: number; // milliseconds since last fetch
  onClearCache: () => void;
}

export const DebugPanel = ({ userId, deviceCount, dataAge, onClearCache }: DebugPanelProps) => {
  const navigate = useNavigate();
  const isStale = dataAge > 5 * 60 * 1000; // 5 minutes
  const isDevelopment = import.meta.env.DEV;

  if (!isDevelopment) return null;

  const handleForceLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    toast({
      title: "Logged Out",
      description: "All data cleared. Please login again.",
    });
    navigate("/auth");
  };

  return (
    <Card className="border-dashed border-2 border-yellow-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          🔧 Debug Panel (Dev Only)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">User ID:</span>
            <Badge variant="outline" className="font-mono text-xs">
              {userId ? userId.substring(0, 8) : "Not logged in"}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Device Count:</span>
            <Badge variant={deviceCount > 0 ? "default" : "secondary"}>
              {deviceCount}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Data Age:</span>
            <Badge variant={isStale ? "destructive" : "default"}>
              {Math.floor(dataAge / 1000)}s ago
            </Badge>
          </div>
        </div>

        {isStale && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Data may be stale (over 5 minutes old)
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            onClick={onClearCache}
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
          >
            <Trash2 className="h-3 w-3" />
            Clear Cache
          </Button>
          <Button
            onClick={handleForceLogout}
            variant="destructive"
            size="sm"
            className="flex-1 gap-2"
          >
            <LogOut className="h-3 w-3" />
            Force Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
