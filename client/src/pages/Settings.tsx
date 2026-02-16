import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Bell, Clock, Save, Download, FileJson, FileSpreadsheet, Shield, Sun, Moon, Palette, Globe, FileText, AlertTriangle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLocation } from "wouter";
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
  const [, navigate] = useLocation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

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
      toast.success(t({ en: "Settings saved", pt: "Configurações salvas", es: "Configuraciones guardadas" }));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteAccountMutation = trpc.auth.deleteAccount.useMutation({
    onSuccess: () => {
      toast.success(t({ en: "Account deleted successfully", pt: "Conta excluída com sucesso", es: "Cuenta eliminada exitosamente" }));
      // Clear any auth tokens and redirect to landing
      document.cookie = 'app_session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      localStorage.removeItem('token');
      window.location.href = '/';
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const sendTestMutation = trpc.notifications.sendTest.useMutation({
    onSuccess: () => {
      toast.success(t({ en: "Test notification sent to project owner", pt: "Notificação de teste enviada", es: "Notificación de prueba enviada al propietario del proyecto" }));
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
      toast.success(t({ en: "Notification permission granted", pt: "Permissão de notificação concedida", es: "Permiso de notificación concedido" }));
      setEnabled(true);
      setHasChanges(true);
      
      // Send a test notification
      sendLocalNotification("Destiny Hacking", {
        body: t({ en: "Daily reminders are now enabled!", pt: "Lembretes diários ativados!", es: "¡Los recordatorios diarios ahora están activados!" }),
        icon: "/icon-192.png"
      });
    } else {
      toast.error(result.error || t({ en: "Notification permission denied", pt: "Permissão de notificação negada", es: "Permiso de notificación denegado" }));
    }
  };

  const handleSendTest = () => {
    sendTestMutation.mutate();
  };

  // Export handlers
  const handleExportCSV = () => {
    toast.info(t({ en: "Exporting CSV...", pt: "Exportando CSV...", es: "Exportando CSV..." }));
    const sampleData = [
      { date: new Date().toISOString(), axis: 'Anxiety ↔ Calm', value: 75, context: 'work', notes: 'Sample data' }
    ];
    const csv = convertToCSV(sampleData, ['date', 'axis', 'value', 'context', 'notes']);
    const filename = `destiny-hacking-slider-history-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(filename, csv);
    toast.success(t({ en: "CSV exported successfully", pt: "CSV exportado com sucesso", es: "CSV exportado exitosamente" }));
  };

  const handleExportJSON = () => {
    toast.info(t({ en: "Exporting JSON...", pt: "Exportando JSON...", es: "Exportando JSON..." }));
    const completeData = formatCompleteDataForExport({
      sliderHistory: [],
      dailyCycles: [],
      insights: [],
    });
    
    const filename = `destiny-hacking-complete-data-${new Date().toISOString().split('T')[0]}.json`;
    downloadJSON(filename, completeData);
    toast.success(t({ en: "JSON exported successfully", pt: "JSON exportado com sucesso", es: "JSON exportado exitosamente" }));
  };

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title={t({ en: "Settings", pt: "Configurações", es: "Configuración" })} subtitle={t({ en: "Preferences & notifications", pt: "Preferências e notificações", es: "Preferencias y notificaciones" })} showBack />
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={t({ en: "Settings", pt: "Configurações", es: "Configuración" })}
        subtitle={t({ en: "Preferences & notifications", pt: "Preferências e notificações", es: "Preferencias y notificaciones" })}
        showBack
        rightAction={
          hasChanges ? (
            <Button
              size="sm"
              onClick={handleSave}
              disabled={updateSettingsMutation.isPending}
            >
              <Save className="h-3.5 w-3.5 mr-1" />
              {t({ en: "Save", pt: "Salvar", es: "Guardar" })}
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
              <CardTitle>{t({ en: "Appearance", pt: "Aparência", es: "Apariencia" })}</CardTitle>
            </div>
            <CardDescription>
              {t({ en: "Customize the look and feel of your experience", pt: "Personalize a aparência da sua experiência", es: "Personaliza la apariencia de tu experiencia" })}
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
                    <Label className="text-sm font-medium">{t({ en: "Theme", pt: "Tema", es: "Tema" })}</Label>
                    <p className="text-xs text-muted-foreground">
                      {theme === 'dark'
                        ? t({ en: "Dark mode active", pt: "Modo escuro ativo", es: "Modo oscuro activo" })
                        : t({ en: "Light mode active", pt: "Modo claro ativo", es: "Modo claro activo" })}
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
                    <><Sun className="h-4 w-4" /> {t({ en: "Light", pt: "Claro", es: "Claro" })}</>
                  ) : (
                    <><Moon className="h-4 w-4" /> {t({ en: "Dark", pt: "Escuro", es: "Oscuro" })}</>
                  )}
                </Button>
              </div>
            )}

            {/* Language Picker — Bottom Sheet Style */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="h-5 w-5 text-emerald-500" />
                <div>
                  <Label className="text-sm font-medium">{t({ en: "Language", pt: "Idioma", es: "Idioma" })}</Label>
                  <p className="text-xs text-muted-foreground">
                    {t({ en: "Choose your preferred language", pt: "Escolha o seu idioma preferido", es: "Elige tu idioma preferido" })}
                  </p>
                </div>
              </div>
              {([
                { code: "en" as const, flag: "🇬🇧", native: "English", label: "English" },
                { code: "pt" as const, flag: "🇧🇷", native: "Português", label: "Portuguese" },
                { code: "es" as const, flag: "🇪🇸", native: "Español", label: "Spanish" },
              ]).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 ${
                    language === lang.code
                      ? "border-[#01D98D] bg-[#01D98D]/10"
                      : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="text-left flex-1">
                    <p className="font-medium text-sm">{lang.native}</p>
                    <p className="text-xs text-muted-foreground">{lang.label}</p>
                  </div>
                  {language === lang.code && (
                    <div className="h-5 w-5 rounded-full bg-[#01D98D] flex items-center justify-center">
                      <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
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
              <CardTitle>{t({ en: "Data Export", pt: "Exportar Dados", es: "Exportar Datos" })}</CardTitle>
            </div>
            <CardDescription>
              {t({ en: "Download your complete emotional calibration history and insights", pt: "Baixe seu histórico completo de calibração emocional e insights", es: "Descarga tu historial completo de calibración emocional e insights" })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* CSV Export */}
              <Button variant="outline" onClick={handleExportCSV}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                {t({ en: "Export History (.csv)", pt: "Exportar Histórico (.csv)", es: "Exportar Historial (.csv)" })}
              </Button>

              {/* JSON Export */}
              <Button variant="outline" onClick={handleExportJSON}>
                <FileJson className="h-4 w-4 mr-2" />
                {t({ en: "Export All Data (.json)", pt: "Exportar Todos os Dados (.json)", es: "Exportar Todos los Datos (.json)" })}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Legal & Privacy */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>{t({ en: "Legal & Privacy", pt: "Legal e Privacidade", es: "Legal y Privacidad" })}</CardTitle>
            </div>
            <CardDescription>
              {t({ en: "Your data belongs to you. Review our policies.", pt: "Seus dados pertencem a você. Revise nossas políticas.", es: "Tus datos te pertenecen. Revisa nuestras políticas." })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/terms">
                <FileText className="h-4 w-4 mr-2" />
                {t({ en: "Terms & Conditions", pt: "Termos e Condições", es: "Términos y Condiciones" })}
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/privacy">
                <Shield className="h-4 w-4 mr-2" />
                {t({ en: "Privacy Policy", pt: "Política de Privacidade", es: "Política de Privacidad" })}
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Delete Account */}
        <Card className="border-destructive/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">{t({ en: "Delete Account", pt: "Excluir Conta", es: "Eliminar Cuenta" })}</CardTitle>
            </div>
            <CardDescription>
              {t(
                { en: "Permanently delete your account and all associated data. This action cannot be undone.", pt: "Exclua permanentemente sua conta e todos os dados associados. Esta ação não pode ser desfeita.", es: "Elimina permanentemente tu cuenta y todos los datos asociados. Esta acción no se puede deshacer." }
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t({ en: "Delete My Account", pt: "Excluir Minha Conta", es: "Eliminar Mi Cuenta" })}
            </Button>
          </CardContent>
        </Card>

        {/* Delete Account Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive">
                {t({ en: "Delete Account?", pt: "Excluir Conta?", es: "¿Eliminar cuenta?" })}
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                <p>
                  {t(
                    { en: "This will permanently delete your account, all calibration data, progress, streaks, achievements, and journal entries. This cannot be undone.", pt: "Isso excluirá permanentemente sua conta, todos os dados de calibração, progresso, sequências, conquistas e entradas de diário. Isso não pode ser desfeito.", es: "Esto eliminará permanentemente tu cuenta, todos los datos de calibración, progreso, rachas, logros y entradas de diario. Esto no se puede deshacer." }
                  )}
                </p>
                <div className="pt-2">
                  <Label className="text-sm font-medium text-foreground">
                    {t({ en: "Type DELETE to confirm:", pt: "Digite DELETE para confirmar:", es: "Escribe DELETE para confirmar:" })}
                  </Label>
                  <Input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="DELETE"
                    className="mt-2"
                  />
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteConfirmText('')}>
                {t({ en: "Cancel", pt: "Cancelar", es: "Cancelar" })}
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteConfirmText !== 'DELETE'}
                onClick={async () => {
                  try {
                    await deleteAccountMutation.mutateAsync({ confirmation: 'DELETE' });
                  } catch (err: any) {
                    toast.error(err.message || t({ en: "Failed to delete account", pt: "Falha ao excluir conta", es: "Error al eliminar la cuenta" }));
                  }
                }}
              >
                {t({ en: "Delete Everything", pt: "Excluir Tudo", es: "Eliminar Todo" })}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
