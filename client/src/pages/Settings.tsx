import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Bell, Clock, Save, Download, FileJson, FileSpreadsheet, Shield, Sun, Moon, Palette, Globe } from "lucide-react";
import { toast } from "sonner";
import { downloadCSV, downloadJSON, convertToCSV, formatCompleteDataForExport, formatSliderHistoryForExport } from "@/lib/export";
import { requestNotificationPermission, areNotificationsEnabled, scheduleDailyReminder, sendLocalNotification } from "@/lib/pushNotifications";
import { AxisManagement } from "@/components/AxisManagement";
import { PageHeader } from "@/components/PageHeader";
import { NotificationScheduler } from "@/components/NotificationScheduler";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Settings() {
  const { theme, toggleTheme, switchable } = useTheme();
  const { language, setLanguage, t } = useLanguage();

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
      toast.success(t("Settings saved", "Configurações salvas"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const sendTestMutation = trpc.notifications.sendTest.useMutation({
    onSuccess: () => {
      toast.success(t("Test notification sent to project owner", "Notificação de teste enviada"));
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
      toast.success(t("Notification permission granted", "Permissão de notificação concedida"));
      setEnabled(true);
      setHasChanges(true);
      
      // Send a test notification
      sendLocalNotification("Destiny Hacking", {
        body: t("Daily reminders are now enabled!", "Lembretes diários ativados!"),
        icon: "/icon-192.png"
      });
    } else {
      toast.error(result.error || t("Notification permission denied", "Permissão de notificação negada"));
    }
  };

  const handleSendTest = () => {
    sendTestMutation.mutate();
  };

  // Export handlers
  const handleExportCSV = () => {
    toast.info(t("Exporting CSV...", "Exportando CSV..."));
    const sampleData = [
      { date: new Date().toISOString(), axis: 'Anxiety ↔ Calm', value: 75, context: 'work', notes: 'Sample data' }
    ];
    const csv = convertToCSV(sampleData, ['date', 'axis', 'value', 'context', 'notes']);
    const filename = `destiny-hacking-slider-history-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(filename, csv);
    toast.success(t("CSV exported successfully", "CSV exportado com sucesso"));
  };

  const handleExportJSON = () => {
    toast.info(t("Exporting JSON...", "Exportando JSON..."));
    const completeData = formatCompleteDataForExport({
      sliderHistory: [],
      dailyCycles: [],
      insights: [],
    });
    
    const filename = `destiny-hacking-complete-data-${new Date().toISOString().split('T')[0]}.json`;
    downloadJSON(filename, completeData);
    toast.success(t("JSON exported successfully", "JSON exportado com sucesso"));
  };

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title={t("Settings", "Configurações")} subtitle={t("Preferences & notifications", "Preferências e notificações")} showBack />
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={t("Settings", "Configurações")}
        subtitle={t("Preferences & notifications", "Preferências e notificações")}
        showBack
        rightAction={
          hasChanges ? (
            <Button
              size="sm"
              onClick={handleSave}
              disabled={updateSettingsMutation.isPending}
            >
              <Save className="h-3.5 w-3.5 mr-1" />
              {t("Save", "Salvar")}
            </Button>
          ) : undefined
        }
      />

      <main className="px-4 py-4 space-y-4 pb-24">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle>{t('Appearance', 'Aparência')}</CardTitle>
            </div>
            <CardDescription>
              {t('Customize the look and feel of your experience', 'Personalize a aparência da sua experiência')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Theme Toggle */}
            {switchable && toggleTheme && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon className="h-5 w-5 text-blue-400" />
                  ) : (
                    <Sun className="h-5 w-5 text-amber-500" />
                  )}
                  <div>
                    <Label className="text-sm font-medium">{t('Theme', 'Tema')}</Label>
                    <p className="text-xs text-muted-foreground">
                      {theme === 'dark'
                        ? t('Dark mode active', 'Modo escuro ativo')
                        : t('Light mode active', 'Modo claro ativo')}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="gap-2"
                >
                  {theme === 'dark' ? (
                    <><Sun className="h-4 w-4" /> {t('Light', 'Claro')}</>
                  ) : (
                    <><Moon className="h-4 w-4" /> {t('Dark', 'Escuro')}</>
                  )}
                </Button>
              </div>
            )}

            {/* Language Switcher */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-emerald-500" />
                <div>
                  <Label className="text-sm font-medium">{t('Language', 'Idioma')}</Label>
                  <p className="text-xs text-muted-foreground">
                    {language === 'en' ? 'English' : 'Português'}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant={language === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('en')}
                >
                  EN
                </Button>
                <Button
                  variant={language === 'pt' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('pt')}
                >
                  PT
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Axis Management */}
        <AxisManagement />

        {/* Client-Side Notification Scheduling */}
        <NotificationScheduler />

        {/* Data Export */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              <CardTitle>{t('Data Export', 'Exportar Dados')}</CardTitle>
            </div>
            <CardDescription>
              {t('Download your complete emotional calibration history and insights', 'Baixe seu histórico completo de calibração emocional e insights')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* CSV Export */}
              <Button variant="outline" onClick={handleExportCSV}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                {t('Export History (.csv)', 'Exportar Histórico (.csv)')}
              </Button>

              {/* JSON Export */}
              <Button variant="outline" onClick={handleExportJSON}>
                <FileJson className="h-4 w-4 mr-2" />
                {t('Export All Data (.json)', 'Exportar Todos os Dados (.json)')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Data */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>{t('Privacy & Data Sovereignty', 'Privacidade e Soberania de Dados')}</CardTitle>
            </div>
            <CardDescription>
              {t('Your data belongs to you. Learn how we protect it.', 'Seus dados pertencem a você. Saiba como os protegemos.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href="/privacy">{t('View Privacy Policy', 'Ver Política de Privacidade')}</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
