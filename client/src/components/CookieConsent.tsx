import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { X } from "lucide-react";
import { trpc } from "@/lib/trpc";

const COOKIE_CONSENT_KEY = "cookie_notice_dismissed";

export function CookieConsent() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const { data: me } = trpc.auth.me.useQuery();
  const isAuthenticated = !!me;

  useEffect(() => {
    const dismissed = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={`fixed ${isAuthenticated ? "bottom-20" : "bottom-4"} left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300`}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 shadow-2xl max-w-lg mx-auto">
        <div className="flex items-start gap-3">
          <span className="text-lg mt-0.5">🍪</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-zinc-300 leading-relaxed">
              {t({
                en: "We use essential cookies and local storage to keep you logged in and save your preferences. No tracking or advertising.",
                pt: "Usamos cookies essenciais e armazenamento local para manter você conectado e salvar suas preferências. Sem rastreamento ou publicidade.",
                es: "Usamos cookies esenciales y almacenamiento local para mantener tu sesión y guardar tus preferencias. Sin rastreo ni publicidad."
              })}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <Link
                href="/privacy"
                className="text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
              >
                {t({ en: "Privacy Policy", pt: "Política de Privacidade", es: "Política de Privacidad" })}
              </Link>
              <button
                onClick={dismiss}
                className="ml-auto flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-full transition-colors"
              >
                {t({ en: "Got it", pt: "Entendi", es: "Entendido" })}
              </button>
            </div>
          </div>
          <button
            onClick={dismiss}
            className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
            aria-label={t({ en: "Close", pt: "Fechar", es: "Cerrar" })}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
