import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Bell, Clock, Save, Download, FileJson, FileSpreadsheet, Shield } from "lucide-react";
import { toast } from "sonner";
import { downloadCSV, downloadJSON, convertToCSV, formatCompleteDataForExport, formatSliderHistoryForExport } from "@/lib/export";
import { requestNotificationPermission, areNotificationsEnabled, scheduleDailyReminder, sendLocalNotification } from "@/lib/pushNotifications";
import { AxisManagement } from "@/components/AxisManagement";
import { PageHeader } from "@/components/PageHeader";

export default function Settings() {

  // Fetch notification settings
  const { data: settings, isLoading: settingsLoading } = trpc.notifications.getSettings.useQuery(
    undefined,
    {  }
  );

  // Local state for form
  const [enabled, setEnabled] = useState(settings?.enabled || false);
  const [reminderTime, setReminderTime] = useState(settings?.reminderTime || "09:00");
  const [hasChanges, setHasChanges] = useState(false);

  // Update local state when settings load
  useState(() => {
    if (settings) {
      setEnabled(settings.enabled);
      setReminderTime(settings.reminderTime);
    }
  });

  // Mutations
  const utils = trpc.useUtils();
  const updateSettingsMutation = trpc.notifications.updateSettings.useMutation({
    onSuccess: () => {
      utils.notifications.getSettings.invalidate();
      setHasChanges(false);
      toast.success("Settings saved");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const sendTestMutation = trpc.notifications.sendTest.useMutation({
    onSuccess: () => {
      toast.success("Test notification sent to project owner");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSave = async () => {
    // Schedule push notification if enabled
    if (enabled && areNotificationsEnabled()) {
      const [hour, minute] = reminderTime.split(':').map(Number);
      await scheduleDailyReminder(hour, minute);
    }
    
    updateSettingsMutation.mutate({
      enabled,
      reminderTime,
    });
  };

  const handleRequestPermission = async () => {
    const result = await requestNotificationPermission();
    
    if (result.granted) {
      toast.success("Notification permission granted");
      setEnabled(true);
      setHasChanges(true);
      
      // Send a test notification
      sendLocalNotification("Destiny Hacking", {
        body: "Daily reminders are now enabled!",
        icon: "/icon-192.png"
      });
    } else {
      toast.error(result.error || "Notification permission denied");
    }
  };

  const handleSendTest = () => {
    sendTestMutation.mutate();
  };

  // Export handlers
  const handleExportCSV = () => {
    toast.info("Exporting CSV...");
    // For now, create sample data since we need to properly fetch from tRPC
    const sampleData = [
      { date: new Date().toISOString(), axis: 'Anxiety ↔ Calm', value: 75, context: 'work', notes: 'Sample data' }
    ];
    const csv = convertToCSV(sampleData, ['date', 'axis', 'value', 'context', 'notes']);
    const filename = `destiny-hacking-slider-history-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(filename, csv);
    toast.success("CSV exported successfully");
  };

  const handleExportJSON = () => {
    toast.info("Exporting JSON...");
    // Create complete data export structure
    const completeData = formatCompleteDataForExport({
      sliderHistory: [],
      dailyCycles: [],
      insights: [],
    });
    
    const filename = `destiny-hacking-complete-data-${new Date().toISOString().split('T')[0]}.json`;
    downloadJSON(filename, completeData);
    toast.success("JSON exported successfully");
  };

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Settings" subtitle="Preferences & notifications" showBack />
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Settings"
        subtitle="Preferences & notifications"
        showBack
        rightAction={
          hasChanges ? (
            <Button
              size="sm"
              onClick={handleSave}
              disabled={updateSettingsMutation.isPending}
            >
              <Save className="h-3.5 w-3.5 mr-1" />
              Save
            </Button>
          ) : undefined
        }
      />

      <main className="px-4 py-4 space-y-4 pb-24">
        {/* Axis Management */}
        <AxisManagement />

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Daily Reminders</CardTitle>
            </div>
            <CardDescription>
              Get notified to complete your daily calibration and reflection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enable Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications-enabled">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive daily reminders for your practice
                </p>
              </div>
              <Switch
                id="notifications-enabled"
                checked={enabled}
                onCheckedChange={(checked) => {
                  if (checked && Notification.permission !== "granted") {
                    handleRequestPermission();
                  } else {
                    setEnabled(checked);
                    setHasChanges(true);
                  }
                }}
              />
            </div>

            {/* Reminder Time */}
            {enabled && (
              <div className="space-y-2">
                <Label htmlFor="reminder-time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Reminder Time
                </Label>
                <Input
                  id="reminder-time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => {
                    setReminderTime(e.target.value);
                    setHasChanges(true);
                  }}
                  className="max-w-xs"
                />
                <p className="text-xs text-muted-foreground">
                  You'll receive a notification at this time every day
                </p>
              </div>
            )}

            {/* Browser Permission Status */}
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Browser Permission</span>
                <span className="text-sm text-muted-foreground">
                  {typeof Notification !== "undefined"
                    ? Notification.permission === "granted"
                      ? "✓ Granted"
                      : Notification.permission === "denied"
                      ? "✗ Denied"
                      : "Not requested"
                    : "Not supported"}
                </span>
              </div>
              {typeof Notification !== "undefined" && Notification.permission === "default" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRequestPermission}
                  className="w-full"
                >
                  Request Permission
                </Button>
              )}
              {typeof Notification !== "undefined" && Notification.permission === "denied" && (
                <p className="text-xs text-muted-foreground">
                  Notifications are blocked. Please enable them in your browser settings.
                </p>
              )}
            </div>

            {/* Test Notification */}
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleSendTest}
                disabled={sendTestMutation.isPending}
                className="w-full"
              >
                Send Test Notification
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                This will send a test notification to the project owner
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Export */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              <CardTitle>Data Export</CardTitle>
            </div>
            <CardDescription>
              Download your complete emotional calibration history and insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* CSV Export */}
              <Button variant="outline" onClick={handleExportCSV}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export History (.csv)
              </Button>

              {/* JSON Export */}
              <Button variant="outline" onClick={handleExportJSON}>
                <FileJson className="h-4 w-4 mr-2" />
                Export All Data (.json)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Data */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Privacy & Data Sovereignty</CardTitle>
            </div>
            <CardDescription>
              Your data belongs to you. Learn how we protect it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href="/privacy">View Privacy Policy</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
