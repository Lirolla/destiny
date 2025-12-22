import { useOfflineSync } from "@/hooks/useOfflineSync";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WifiOff, Wifi, RefreshCw, Database } from "lucide-react";

export function OfflineIndicator() {
  const { isOnline, queueSize, isSyncing, syncQueue } = useOfflineSync();

  // Don't show anything if online and queue is empty
  if (isOnline && queueSize === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className={isOnline ? "border-primary" : "border-orange-500"}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-primary" />
              ) : (
                <WifiOff className="h-4 w-4 text-orange-500" />
              )}
              <CardTitle className="text-sm">
                {isOnline ? "Online" : "Offline Mode"}
              </CardTitle>
            </div>
            {queueSize > 0 && (
              <Badge variant={isOnline ? "default" : "secondary"}>
                <Database className="h-3 w-3 mr-1" />
                {queueSize}
              </Badge>
            )}
          </div>
          <CardDescription className="text-xs">
            {isOnline
              ? queueSize > 0
                ? `${queueSize} ${queueSize === 1 ? "change" : "changes"} pending sync`
                : "All changes synced"
              : "Changes saved locally"}
          </CardDescription>
        </CardHeader>
        {queueSize > 0 && isOnline && (
          <CardContent className="pt-0">
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={syncQueue}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Sync Now
                </>
              )}
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
