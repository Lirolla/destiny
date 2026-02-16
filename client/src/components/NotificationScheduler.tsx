import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, BellOff, Clock } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const STORAGE_KEY = "dh_notification_prefs";

interface NotificationPrefs {
  enabled: boolean;
  morningTime: string; // "HH:MM"
  middayTime: string;
  eveningTime: string;
  morningEnabled: boolean;
  middayEnabled: boolean;
  eveningEnabled: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = {
  enabled: false,
  morningTime: "07:00",
  middayTime: "13:00",
  eveningTime: "21:00",
  morningEnabled: true,
  middayEnabled: true,
  eveningEnabled: true,
};

function loadPrefs(): NotificationPrefs {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_PREFS, ...JSON.parse(stored) };
  } catch {}
  return DEFAULT_PREFS;
}

function savePrefs(prefs: NotificationPrefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

/**
 * Schedules browser notifications for daily cycle reminders.
 * Uses setTimeout-based scheduling that recalculates on each page load.
 * Falls back gracefully if Notification API is not available.
 */
export function NotificationScheduler() {
  const { t } = useLanguage();
  const [prefs, setPrefs] = useState<NotificationPrefs>(loadPrefs);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  );

  // Save prefs whenever they change
  useEffect(() => {
    savePrefs(prefs);
  }, [prefs]);

  // Schedule notifications
  useEffect(() => {
    if (!prefs.enabled || permission !== "granted") return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const now = new Date();

    const scheduleNotification = (timeStr: string, title: string, body: string) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      const target = new Date(now);
      target.setHours(hours, minutes, 0, 0);

      // If time has passed today, schedule for tomorrow
      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }

      const delay = target.getTime() - now.getTime();
      const timer = setTimeout(() => {
        new Notification(title, {
          body,
          icon: "/favicon.ico",
          tag: `dh-${timeStr}`,
        });
      }, delay);
      timers.push(timer);
    };

    if (prefs.morningEnabled) {
      scheduleNotification(
        prefs.morningTime,
        "Morning Calibration",
        "Time to calibrate your axes and set your intention for the day."
      );
    }
    if (prefs.middayEnabled) {
      scheduleNotification(
        prefs.middayTime,
        "Midday Check-In",
        "How are your lowest axes doing? Time for a midday recalibration."
      );
    }
    if (prefs.eveningEnabled) {
      scheduleNotification(
        prefs.eveningTime,
        "Evening Reflection",
        "Complete your daily cycle. What did you plant today?"
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [prefs, permission]);

  const requestPermission = useCallback(async () => {
    if (typeof Notification === "undefined") {
      toast.error(t({ en: "Notifications are not supported in this browser.", pt: "Notificações não são suportadas neste navegador.", es: "Las notificaciones no son compatibles con este navegador." }));
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      setPrefs(p => ({ ...p, enabled: true }));
      toast.success(t({ en: "Notifications enabled!", pt: "Notificações ativadas!", es: "¡Notificaciones activadas!" }));
    } else {
      toast.error(t({ en: "Notification permission denied. Enable it in browser settings.", pt: "Permissão de notificação negada. Ative nas configurações do navegador.", es: "Permiso de notificación denegado. Habilítalo en la configuración del navegador." }));
    }
  }, [t]);

  const updatePref = <K extends keyof NotificationPrefs>(key: K, value: NotificationPrefs[K]) => {
    setPrefs(p => ({ ...p, [key]: value }));
  };

  const notificationsSupported = typeof Notification !== "undefined";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {prefs.enabled ? (
            <Bell className="w-4 h-4 text-[#01D98D]" />
          ) : (
            <BellOff className="w-4 h-4 text-muted-foreground" />
          )}
          {t({ en: "Cycle Reminders", pt: "Lembretes de Ciclo", es: "Recordatorios de Ciclo" })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!notificationsSupported ? (
          <p className="text-sm text-muted-foreground">
            {t({ en: "Browser notifications are not supported. Try using a modern browser.", pt: "Notificações do navegador não são suportadas. Tente usar um navegador moderno.", es: "Las notificaciones del navegador no son compatibles. Intenta usar un navegador moderno." })}
          </p>
        ) : permission !== "granted" ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {t({ en: "Enable browser notifications to receive daily cycle reminders.", pt: "Ative as notificações do navegador para receber lembretes de ciclo diário.", es: "Habilita las notificaciones del navegador para recibir recordatorios del ciclo diario." })}
            </p>
            <Button onClick={requestPermission} size="sm" variant="outline">
              <Bell className="w-3.5 h-3.5 mr-1.5" />
              {t({ en: "Enable Notifications", pt: "Ativar Notificações", es: "Activar Notificaciones" })}
            </Button>
          </div>
        ) : (
          <>
            {/* Master toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-enabled" className="text-sm">
                {t({ en: "Enable Reminders", pt: "Ativar Lembretes", es: "Activar Recordatorios" })}
              </Label>
              <Switch
                id="notif-enabled"
                checked={prefs.enabled}
                onCheckedChange={(v) => updatePref("enabled", v)}
              />
            </div>

            {prefs.enabled && (
              <div className="space-y-3 pt-2 border-t">
                {/* Morning */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={prefs.morningEnabled}
                      onCheckedChange={(v) => updatePref("morningEnabled", v)}
                    />
                    <span className="text-sm">☀️ {t({ en: "Morning", pt: "Manhã", es: "Mañana" })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <input
                      type="time"
                      value={prefs.morningTime}
                      onChange={(e) => updatePref("morningTime", e.target.value)}
                      className="text-sm bg-muted/50 rounded px-2 py-0.5 border-0 focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Midday */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={prefs.middayEnabled}
                      onCheckedChange={(v) => updatePref("middayEnabled", v)}
                    />
                    <span className="text-sm">🎯 {t({ en: "Midday", pt: "Meio-dia", es: "Mediodía" })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <input
                      type="time"
                      value={prefs.middayTime}
                      onChange={(e) => updatePref("middayTime", e.target.value)}
                      className="text-sm bg-muted/50 rounded px-2 py-0.5 border-0 focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Evening */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={prefs.eveningEnabled}
                      onCheckedChange={(v) => updatePref("eveningEnabled", v)}
                    />
                    <span className="text-sm">🌙 {t({ en: "Evening", pt: "Noite", es: "Noche" })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <input
                      type="time"
                      value={prefs.eveningTime}
                      onChange={(e) => updatePref("eveningTime", e.target.value)}
                      className="text-sm bg-muted/50 rounded px-2 py-0.5 border-0 focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground pt-1">
                  {t({ en: "Reminders are scheduled in your browser. Keep the app open for them to fire.", pt: "Lembretes são agendados no seu navegador. Mantenha o app aberto para que funcionem.", es: "Los recordatorios se programan en tu navegador. Mantén la aplicación abierta para que se activen." })}
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
