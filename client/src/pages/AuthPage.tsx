import { useState } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, ArrowLeft, Compass, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { GlobeLanguageDropdown } from "@/components/GlobeLanguageDropdown";

type AuthMode = "login" | "signup" | "forgot" | "reset";

export default function AuthPage() {
  const { t, language } = useLanguage();
  const [, navigate] = useLocation();

  // Check URL for reset token
  const params = new URLSearchParams(window.location.search);
  const resetToken = params.get("token");
  const modeParam = params.get("mode");

  const [mode, setMode] = useState<AuthMode>(
    resetToken && modeParam === "reset" ? "reset" : "login"
  );

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const utils = trpc.useUtils();

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      toast.success(t({ en: "Account created successfully!", pt: "Conta criada com sucesso!", es: "¡Cuenta creada con éxito!" }));
      utils.auth.me.invalidate();
      navigate("/");
    },
    onError: (err) => toast.error(err.message),
  });

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      toast.success(t({ en: "Welcome back!", pt: "Bem-vindo de volta!", es: "¡Bienvenido de vuelta!" }));
      utils.auth.me.invalidate();
      navigate("/");
    },
    onError: (err) => toast.error(err.message),
  });

  const forgotMutation = trpc.auth.forgotPassword.useMutation({
    onSuccess: (data) => {
      toast.success(t({ en: data.message, pt: "Se uma conta existir com esse e-mail, um link de redefinição foi enviado.", es: "Si existe una cuenta con ese correo, se ha enviado un enlace de restablecimiento." }));
    },
    onError: (err) => toast.error(err.message),
  });

  const resetMutation = trpc.auth.resetPassword.useMutation({
    onSuccess: () => {
      toast.success(t({ en: "Password reset successfully! Please log in.", pt: "Senha redefinida com sucesso! Faça login.", es: "¡Contraseña restablecida con éxito! Por favor, inicia sesión." }));
      setMode("login");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "signup") {
      if (password !== confirmPassword) {
        toast.error(t({ en: "Passwords do not match", pt: "As senhas não coincidem", es: "Las contraseñas no coinciden" }));
        return;
      }
      if (!agreedToTerms) {
        toast.error(t({ en: "You must agree to the Terms & Conditions and Privacy Policy", pt: "Você deve concordar com os Termos e a Política de Privacidade", es: "Debes aceptar los Términos y Condiciones y la Política de Privacidad" }));
        return;
      }
      registerMutation.mutate({ email, password, name });
    } else if (mode === "login") {
      loginMutation.mutate({ email, password });
    } else if (mode === "forgot") {
      forgotMutation.mutate({ email, language });
    } else if (mode === "reset") {
      if (newPassword.length < 8) {
        toast.error(t({ en: "Password must be at least 8 characters", pt: "A senha deve ter pelo menos 8 caracteres", es: "La contraseña debe tener al menos 8 caracteres" }));
        return;
      }
      resetMutation.mutate({ token: resetToken || "", newPassword });
    }
  };

  const isLoading = registerMutation.isPending || loginMutation.isPending || forgotMutation.isPending || resetMutation.isPending;

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-8 bg-background relative">
      {/* Globe language dropdown — top right */}
      <div className="absolute top-4 right-4 z-20">
        <GlobeLanguageDropdown />
      </div>

      {/* Back to landing */}
      <div className="w-full max-w-md mb-6">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t({ en: "Back", pt: "Voltar", es: "Volver" })}
        </Link>
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
          <Compass className="w-6 h-6 text-emerald-400" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Destiny Hacking</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t({ en: "Master Your Free Will", pt: "Domine Seu Livre Arbítrio", es: "Domina tu Libre Albedrío" })}
        </p>
      </div>

      <Card className="w-full max-w-md border-border/50 bg-card">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-lg">
            {mode === "login" && t({ en: "Welcome Back", pt: "Bem-vindo de Volta", es: "Bienvenido de Vuelta" })}
            {mode === "signup" && t({ en: "Create Account", pt: "Criar Conta", es: "Crear Cuenta" })}
            {mode === "forgot" && t({ en: "Reset Password", pt: "Redefinir Senha", es: "Restablecer Contraseña" })}
            {mode === "reset" && t({ en: "New Password", pt: "Nova Senha", es: "Nueva Contraseña" })}
          </CardTitle>
          <CardDescription>
            {mode === "login" && t({ en: "Sign in to continue your journey", pt: "Entre para continuar sua jornada", es: "Inicia sesión para continuar tu viaje" })}
            {mode === "signup" && t({ en: "Begin your path to self-mastery", pt: "Comece seu caminho para o autodomínio", es: "Comienza tu camino hacia el autodominio" })}
            {mode === "forgot" && t({ en: "Enter your email to receive a reset link", pt: "Digite seu e-mail para receber um link de redefinição", es: "Ingresa tu correo electrónico para recibir un enlace de restablecimiento" })}
            {mode === "reset" && t({ en: "Choose a new password for your account", pt: "Escolha uma nova senha para sua conta", es: "Elige una nueva contraseña para tu cuenta" })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (signup only) */}
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">{t({ en: "Name", pt: "Nome", es: "Nombre" })}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={t({ en: "Your name", pt: "Seu nome", es: "Tu nombre" })}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email (not for reset) */}
            {mode !== "reset" && (
              <div className="space-y-2">
                <Label htmlFor="email">{t({ en: "Email", pt: "E-mail", es: "Correo Electrónico" })}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            {/* Password (login & signup) */}
            {(mode === "login" || mode === "signup") && (
              <div className="space-y-2">
                <Label htmlFor="password">{t({ en: "Password", pt: "Senha", es: "Contraseña" })}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t({ en: "Min. 8 characters", pt: "Mín. 8 caracteres", es: "Mín. 8 caracteres" })}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={mode === "signup" ? 8 : 1}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password (signup only) */}
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t({ en: "Confirm Password", pt: "Confirmar Senha", es: "Confirmar Contraseña" })}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder={t({ en: "Repeat password", pt: "Repita a senha", es: "Repite la contraseña" })}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={8}
                  />
                </div>
              </div>
            )}

            {/* New Password (reset only) */}
            {mode === "reset" && (
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t({ en: "New Password", pt: "Nova Senha", es: "Nueva Contraseña" })}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder={t({ en: "Min. 8 characters", pt: "Mín. 8 caracteres", es: "Mín. 8 caracteres" })}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Terms & Conditions checkbox (signup only) */}
            {mode === "signup" && (
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                  {t({ en: "I agree to the ", pt: "Eu concordo com os ", es: "Acepto los " })}{" "}
                  <Link href="/terms" className="text-emerald-400 hover:underline">
                    {t({ en: "Terms & Conditions", pt: "Termos e Condições", es: "Términos y Condiciones" })}
                  </Link>{" "}
                  {t({ en: "and ", pt: "e ", es: "y la " })}{" "}
                  <Link href="/privacy" className="text-emerald-400 hover:underline">
                    {t({ en: "Privacy Policy", pt: "Política de Privacidade", es: "Política de Privacidad" })}
                  </Link>
                </Label>
              </div>
            )}

            {/* Forgot password link (login only) */}
            {mode === "login" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-sm text-emerald-400 hover:underline"
                >
                  {t({ en: "Forgot password?", pt: "Esqueceu a senha?", es: "¿Olvidaste tu contraseña?" })}
                </button>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                <>
                  {mode === "login" && t({ en: "Sign In", pt: "Entrar", es: "Iniciar Sesión" })}
                  {mode === "signup" && t({ en: "Create Account", pt: "Criar Conta", es: "Crear Cuenta" })}
                  {mode === "forgot" && t({ en: "Send Reset Link", pt: "Enviar Link de Redefinição", es: "Enviar Enlace de Restablecimiento" })}
                  {mode === "reset" && t({ en: "Reset Password", pt: "Redefinir Senha", es: "Restablecer Contraseña" })}
                </>
              )}
            </Button>
          </form>

          {/* Mode switcher */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" && (
              <>
                {t({ en: "Don't have an account? ", pt: "Não tem uma conta? ", es: "¿No tienes una cuenta? " })}
                <button onClick={() => setMode("signup")} className="text-emerald-400 hover:underline">
                  {t({ en: "Sign Up", pt: "Cadastre-se", es: "Regístrate" })}
                </button>
              </>
            )}
            {mode === "signup" && (
              <>
                {t({ en: "Already have an account? ", pt: "Já tem uma conta? ", es: "¿Ya tienes una cuenta? " })}
                <button onClick={() => setMode("login")} className="text-emerald-400 hover:underline">
                  {t({ en: "Sign In", pt: "Entrar", es: "Iniciar Sesión" })}
                </button>
              </>
            )}
            {mode === "forgot" && (
              <>
                <button onClick={() => setMode("login")} className="text-emerald-400 hover:underline">
                  {t({ en: "Back to Sign In", pt: "Voltar para Login", es: "Volver a Iniciar Sesión" })}
                </button>
              </>
            )}
            {mode === "reset" && (
              <>
                <button onClick={() => setMode("login")} className="text-emerald-400 hover:underline">
                  {t({ en: "Back to Sign In", pt: "Voltar para Login", es: "Volver a Iniciar Sesión" })}
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer quote */}
      <p className="mt-8 text-xs text-muted-foreground/60 text-center italic max-w-xs">
        "I am the master of my fate, I am the captain of my soul."
      </p>
    </div>
  );
}

