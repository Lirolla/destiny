import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Share2, Twitter, Facebook, Linkedin, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import type { ProgressSummary } from "@/lib/socialShare";
import {
  generateShareText,
  shareViaWebAPI,
  shareToTwitter,
  shareToFacebook,
  shareToLinkedIn,
  copyShareText,
} from "@/lib/socialShare";
import { useLanguage } from "@/contexts/LanguageContext";

interface ShareProgressProps {
  summary: ProgressSummary;
}

export function ShareProgress({ summary }: ShareProgressProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleWebShare = async () => {
    const success = await shareViaWebAPI(summary);
    if (success) {
      setOpen(false);
      toast.success(t({ en: "Shared successfully!", pt: "Compartilhado com sucesso!", es: "¡Compartido con éxito!" }));
    }
  };

  const handleCopy = async () => {
    const success = await copyShareText(summary);
    if (success) {
      setCopied(true);
      toast.success(t({ en: "Copied to clipboard!", pt: "Copiado para a área de transferência!", es: "¡Copiado al portapapeles!" }));
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error(t({ en: "Failed to copy", pt: "Falha ao copiar", es: "Error al copiar" }));
    }
  };

  const handleTwitter = () => {
    shareToTwitter(summary);
    setOpen(false);
    toast.success(t({ en: "Opening Twitter...", pt: "Abrindo o Twitter...", es: "Abriendo Twitter..." }));
  };

  const handleFacebook = () => {
    shareToFacebook(summary);
    setOpen(false);
    toast.success(t({ en: "Opening Facebook...", pt: "Abrindo o Facebook...", es: "Abriendo Facebook..." }));
  };

  const handleLinkedIn = () => {
    shareToLinkedIn(summary);
    setOpen(false);
    toast.success(t({ en: "Opening LinkedIn...", pt: "Abrindo o LinkedIn...", es: "Abriendo LinkedIn..." }));
  };

  const shareText = generateShareText(summary);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          {t({ en: "Share Progress", pt: "Compartilhar Progresso", es: "Compartir Progreso" })}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t({ en: "Share Your Progress", pt: "Compartilhe Seu Progresso", es: "Comparte Tu Progreso" })}</DialogTitle>
          <DialogDescription>
            {t({ en: "Share your anonymized progress summary (no personal emotional data)", pt: "Compartilhe seu resumo de progresso anonimizado (sem dados emocionais pessoais)", es: "Comparte tu resumen de progreso anonimizado (sin datos emocionales personales)" })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <pre className="text-sm whitespace-pre-wrap font-sans">
                {shareText}
              </pre>
            </CardContent>
          </Card>

          {/* Share Options */}
          <div className="space-y-2">
            {/* Web Share API (mobile) */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button
                onClick={handleWebShare}
                variant="default"
                className="w-full"
              >
                <Share2 className="h-4 w-4 mr-2" />
                {t({ en: "Share", pt: "Compartilhar", es: "Compartir" })}
              </Button>
            )}

            {/* Social Platforms */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={handleTwitter}
                variant="outline"
                size="sm"
              >
                <Twitter className="h-4 w-4 mr-1" />
                {t({ en: "Twitter", pt: "Twitter", es: "Twitter" })}
              </Button>
              <Button
                onClick={handleFacebook}
                variant="outline"
                size="sm"
              >
                <Facebook className="h-4 w-4 mr-1" />
                {t({ en: "Facebook", pt: "Facebook", es: "Facebook" })}
              </Button>
              <Button
                onClick={handleLinkedIn}
                variant="outline"
                size="sm"
              >
                <Linkedin className="h-4 w-4 mr-1" />
                {t({ en: "LinkedIn", pt: "LinkedIn", es: "LinkedIn" })}
              </Button>
            </div>

            {/* Copy to Clipboard */}
            <Button
              onClick={handleCopy}
              variant="outline"
              className="w-full"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {t({ en: "Copied!", pt: "Copiado!", es: "¡Copiado!" })}
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  {t({ en: "Copy to Clipboard", pt: "Copiar para Área de Transferência", es: "Copiar al Portapapeles" })}
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            {t({ en: "Only aggregate stats are shared. Your specific emotional data remains private.", pt: "Apenas estatísticas agregadas são compartilhadas. Seus dados emocionais específicos permanecem privados.", es: "Solo se comparten estadísticas agregadas. Tus datos emocionales específicos permanecen privados." })}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
