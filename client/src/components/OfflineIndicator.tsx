import { useOfflineSync } from "@/hooks/useOfflineSync";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WifiOff, Wifi, RefreshCw, Database } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function OfflineIndicator() {
  const { isOnline, queueSize, isSyncing, syncQueue } = useOfflineSync();
  const { t } = useLanguage();

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
                {isOnline ? t({ en: "Online", pt: "Online", es: "En línea" }) : t({ en: "Offline Mode", pt: "Modo Offline", es: "Modo Sin Conexión" })}
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
                ? `${queueSize} ${t({ en: queueSize === 1 ? "change" : "changes", pt: queueSize === 1 ? "alteração" : "alterações", es: queueSize === 1 ? "cambio" : "cambios" })} ${t({ en: "pending sync", pt: "pendente de sincronização", es: "pendiente de sincronización" })}`
                : t({ en: "All changes synced", pt: "Todas as alterações sincronizadas", es: "Todos los cambios sincronizados" })
              : t({ en: "Changes saved locally", pt: "Alterações salvas localmente", es: "Cambios guardados localmente" })}
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
                  {t({ en: "Syncing...", pt: "Sincronizando...", es: "Sincronizando..." })}
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 mr-2" />
                  {t({ en: "Sync Now", pt: "Sincronizar Agora", es: "Sincronizar Ahora" })}
                </>
              )}
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
