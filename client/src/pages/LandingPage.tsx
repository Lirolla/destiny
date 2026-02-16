import { useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Compass, Sun, Brain, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppStoreBadges from "@/components/AppStoreBadges";
import { GlobeLanguageDropdown } from "@/components/GlobeLanguageDropdown";
import { useLanguage } from "@/contexts/LanguageContext";

const AXES = [
  { id: 0, left: { en: "Powerless", pt: "Impotente", es: "Impotente" }, right: { en: "Powerful", pt: "Poderoso", es: "Poderoso" }, name: { en: "The Will Axis", pt: "O Eixo da Vontade", es: "El Eje de la Voluntad" } },
  { id: 1, left: { en: "Blame", pt: "Culpa", es: "Culpa" }, right: { en: "Ownership", pt: "Responsabilidade", es: "Responsabilidad" }, name: { en: "Ownership", pt: "Responsabilidade", es: "Responsabilidad" } },
  { id: 2, left: { en: "Reckless Sowing", pt: "Semeadura Imprudente", es: "Siembra Imprudente" }, right: { en: "Intentional Sowing", pt: "Semeadura Intencional", es: "Siembra Intencional" }, name: { en: "Sowing", pt: "Semeadura", es: "Siembra" } },
  { id: 3, left: { en: "Bitterness", pt: "Amargura", es: "Amargura" }, right: { en: "Meaning", pt: "Significado", es: "Significado" }, name: { en: "Meaning", pt: "Significado", es: "Significado" } },
  { id: 4, left: { en: "Victimhood", pt: "Vitimismo", es: "Victimismo" }, right: { en: "Agency", pt: "Agência", es: "Agencia" }, name: { en: "Agency", pt: "Agência", es: "Agencia" } },
  { id: 5, left: { en: "Resentment", pt: "Ressentimento", es: "Resentimiento" }, right: { en: "Forgiveness", pt: "Perdão", es: "Perdón" }, name: { en: "Forgiveness", pt: "Perdão", es: "Perdón" } },
  { id: 6, left: { en: "Self-Deception", pt: "Autoengano", es: "Autoengaño" }, right: { en: "Clarity", pt: "Clareza", es: "Claridad" }, name: { en: "Clarity", pt: "Clareza", es: "Claridad" } },
  { id: 7, left: { en: "Suppression", pt: "Supressão", es: "Supresión" }, right: { en: "Healthy Expression", pt: "Expressão Saudável", es: "Expresión Saludable" }, name: { en: "Expression", pt: "Expressão", es: "Expresión" } },
  { id: 8, left: { en: "Attachment to Outcome", pt: "Apego ao Resultado", es: "Apego al Resultado" }, right: { en: "Faithful Action", pt: "Ação Fiel", es: "Acción Fiel" }, name: { en: "Faith", pt: "Fé", es: "Fe" } },
  { id: 9, left: { en: "Fear of Judgment", pt: "Medo do Julgamento", es: "Miedo al Juicio" }, right: { en: "Authentic Living", pt: "Vida Autêntica", es: "Vida Auténtica" }, name: { en: "Authenticity", pt: "Autenticidade", es: "Autenticidad" } },
  { id: 10, left: { en: "Comfort Addiction", pt: "Vício no Conforto", es: "Adicción al Confort" }, right: { en: "Courageous Growth", pt: "Crescimento Corajoso", es: "Crecimiento Valiente" }, name: { en: "Courage", pt: "Coragem", es: "Coraje" } },
  { id: 11, left: { en: "Pride / Ego", pt: "Orgulho / Ego", es: "Orgullo / Ego" }, right: { en: "Humble Confidence", pt: "Confiança Humilde", es: "Confianza Humilde" }, name: { en: "Humility", pt: "Humildade", es: "Humildad" } },
  { id: 12, left: { en: "Scarcity", pt: "Escassez", es: "Escasez" }, right: { en: "Gratitude", pt: "Gratidão", es: "Gratitud" }, name: { en: "Gratitude", pt: "Gratidão", es: "Gratitud" } },
  { id: 13, left: { en: "Isolation", pt: "Isolamento", es: "Aislamiento" }, right: { en: "Meaningful Connection", pt: "Conexão Significativa", es: "Conexión Significativa" }, name: { en: "Connection", pt: "Conexão", es: "Conexión" } },
  { id: 14, left: { en: "Reactive", pt: "Reativo", es: "Reactivo" }, right: { en: "Stoic Composure", pt: "Compostura Estoica", es: "Compostura Estoica" }, name: { en: "Composure", pt: "Compostura", es: "Compostura" } },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function LandingPage() {
  const { t } = useLanguage();
  const downloadRef = useRef<HTMLDivElement>(null);

  const scrollToDownload = () => {
    downloadRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 text-center">
        {/* Globe language dropdown — top right */}
        <div className="absolute top-4 right-4 z-20">
          <GlobeLanguageDropdown light />
        </div>

        {/* Subtle green gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#01D98D]/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(1,217,141,0.06)_0%,_transparent_70%)] pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 max-w-3xl mx-auto"
        >
          {/* Logo */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#01D98D]/15 flex items-center justify-center mb-4">
              <Compass className="w-8 h-8 text-[#01D98D]" />
            </div>
            <p className="text-sm tracking-[0.3em] uppercase text-[#01D98D]/70 font-medium">
              Destiny Hacking
            </p>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6"
          >
            {t({ en: "Master Your", pt: "Domine Seu", es: "Domina Tu" })}{" "}
            <span className="text-[#01D98D]">{t({ en: "Free Will", pt: "Livre Arbítrio", es: "Libre Albedrío" })}</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t({
              en: "A daily practice to calibrate your mind, harness your choices, and become the captain of your soul.",
              pt: "Uma prática diária para calibrar sua mente, dominar suas escolhas e tornar-se o capitão da sua alma.",
              es: "Una práctica diaria para calibrar tu mente, tomar las riendas de tus elecciones y convertirte en el capitán de tu alma.",
            })}
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth">
              <Button size="lg" className="bg-[#01D98D] hover:bg-[#01D98D]/90 text-black font-semibold px-8 py-6 text-base rounded-xl">
                {t({ en: "Get Started", pt: "Começar", es: "Empezar" })}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToDownload}
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-base rounded-xl bg-transparent"
            >
              {t({ en: "Download App", pt: "Baixar App", es: "Descargar App" })}
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-white/30 animate-bounce" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: WHAT IS DESTINY HACKING?
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-6">
              {t({ en: "What Is Destiny Hacking?", pt: "O Que É Destiny Hacking?", es: "¿Qué Es Destiny Hacking?" })}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
              {t({
                en: "Destiny Hacking is a philosophical self-improvement app built around 15 measurable dimensions of free will. Through daily calibration, AI-powered coaching, and 14 interactive learning modules, you'll develop the self-awareness and intentionality to take control of your life.",
                pt: "Destiny Hacking é um aplicativo de autoaperfeiçoamento filosófico construído em torno de 15 dimensões mensuráveis do livre arbítrio. Através de calibração diária, coaching com IA e 14 módulos de aprendizagem interativos, você desenvolverá a autoconsciência e a intencionalidade para assumir o controle da sua vida.",
                es: "Destiny Hacking es una aplicación filosófica de automejora construida en torno a 15 dimensiones medibles del libre albedrío. A través de la calibración diaria, el coaching impulsado por IA y 14 módulos de aprendizaje interactivos, desarrollarás la autoconciencia y la intencionalidad para tomar el control de tu vida.",
              })}
            </motion.p>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: <Compass className="w-7 h-7" />,
                title: t({ en: "15 Axes of Free Will", pt: "15 Eixos do Livre Arbítrio", es: "15 Ejes del Libre Albedrío" }),
                desc: t({
                  en: "Calibrate your mind across 15 dimensions, from Powerless ↔ Powerful to Drifting ↔ Architect of Destiny.",
                  pt: "Calibre sua mente em 15 dimensões, de Impotente ↔ Poderoso a Flutuando ↔ Arquiteto do Destino.",
                  es: "Calibra tu mente a través de 15 dimensiones, desde Impotente ↔ Poderoso hasta A la Deriva ↔ Arquitecto del Destino.",
                }),
              },
              {
                icon: <Sun className="w-7 h-7" />,
                title: t({ en: "Daily Practice", pt: "Prática Diária", es: "Práctica Diaria" }),
                desc: t({
                  en: "Morning calibration. Midday decisive action. Evening reflection. Build your streak.",
                  pt: "Calibração matutina. Ação decisiva ao meio-dia. Reflexão noturna. Construa sua sequência.",
                  es: "Calibración matutina. Acción decisiva a mediodía. Reflexión vespertina. Construye tu racha.",
                }),
              },
              {
                icon: <Brain className="w-7 h-7" />,
                title: t({ en: "AI Stoic Strategist", pt: "Estrategista Estoico IA", es: "Estratega Estoico de IA" }),
                desc: t({
                  en: "An AI coach that analyses your lowest axes and generates personalised action plans.",
                  pt: "Um coach de IA que analisa seus eixos mais baixos e gera planos de ação personalizados.",
                  es: "Un entrenador de IA que analiza tus ejes más bajos y genera planes de acción personalizados.",
                }),
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 hover:bg-white/[0.05] transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[#01D98D]/10 flex items-center justify-center text-[#01D98D] mb-5">
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3">{card.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: THE 15 AXES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-white/[0.02]\">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-center mb-4">
              {t({ en: "The 15 Axes of Free Will", pt: "Os 15 Eixos do Livre Arbítrio", es: "Los 15 Ejes del Libre Albedrío" })}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/50 text-center mb-12 max-w-xl mx-auto">
              {t({
                en: "Each axis represents a spectrum of human experience. Where do you stand?",
                pt: "Cada eixo representa um espectro da experiência humana. Onde você se encontra?",
                es: "Cada eje representa un espectro de la experiencia humana. ¿Dónde te sitúas tú?",
              })}
            </motion.p>

            <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {AXES.map((axis) => (
                <div
                  key={axis.id}
                  className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 hover:bg-white/[0.05] transition-colors"
                >
                  <span className="text-xs font-mono text-[#01D98D]/60 w-5 shrink-0">
                    {String(axis.id).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-sm">
                      <span className="text-white/40 truncate">{t(axis.left)}</span>
                      <span className="text-[#01D98D] shrink-0">↔</span>
                      <span className="text-white font-medium truncate">{t(axis.right)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: HOW IT WORKS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-center mb-16">
              {t({ en: "How It Works", pt: "Como Funciona", es: "Cómo Funciona" })}
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: t({ en: "Calibrate", pt: "Calibrar", es: "Calibración" }),
                  desc: t({
                    en: "Rate your 15 axes each morning. Know where you stand.",
                    pt: "Avalie seus 15 eixos cada manhã. Saiba onde você está.",
                    es: "Evalúa tus 15 ejes cada mañana. Conoce tu posición.",
                  }),
                  color: "#01D98D",
                },
                {
                  step: "02",
                  title: t({ en: "Act", pt: "Agir", es: "Actuar" }),
                  desc: t({
                    en: "The AI Stoic Strategist gives you one decisive action for today.",
                    pt: "O Estrategista Estoico IA dá a você uma ação decisiva para hoje.",
                    es: "El Estratega Estoico de IA te da una acción decisiva para hoy.",
                  }),
                  color: "#01D98D",
                },
                {
                  step: "03",
                  title: t({ en: "Reflect", pt: "Refletir", es: "Reflexionar" }),
                  desc: t({
                    en: "Map cause and effect each evening. Watch your Destiny Score grow.",
                    pt: "Mapeie causa e efeito cada noite. Veja sua Pontuação de Destino crescer.",
                    es: "Analiza causa y efecto cada noche. Observa cómo crece tu Puntuación de Destino.",
                  }),
                  color: "#01D98D",
                },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp} className="text-center">
                  <div className="text-5xl font-bold text-[#01D98D]/20 mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5: THE PHILOSOPHY
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-white/[0.02]\">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-8">
              {t({ en: "The Philosophy", pt: "A Filosofia", es: "La Filosofía" })}
            </motion.h2>

            <motion.blockquote
              variants={fadeUp}
              className="text-lg sm:text-xl italic text-white/70 leading-relaxed mb-8 border-l-2 border-[#01D98D]/40 pl-6 text-left"
            >
              {t({
                en: '\"In the grand tapestry of existence, there is a single thread that defines us, empowers us, and binds us to the course of our lives: free will.\"',
                pt: '\"Na grande tapeçaria da existência, há um único fio que nos define, nos fortalece e nos liga ao rumo das nossas vidas: o livre-arbítrio.\"',
                es: '\"En el gran tapiz de la existencia, hay un único hilo que nos define, nos empodera y nos une al curso de nuestras vidas: el libre albedrío.\"',
              })}
            </motion.blockquote>

            <motion.p variants={fadeUp} className="text-white/50 mb-8 leading-relaxed">
              {t({
                en: "Destiny Hacking is built on a philosophical framework that combines Stoic wisdom, the concept of universal balance, and the radical idea that free will is humanity's greatest gift. The book explores 14 chapters of practical philosophy designed to help you take ownership of your life.",
                pt: "Destiny Hacking é construído sobre uma estrutura filosófica que combina sabedoria estoica, o conceito de equilíbrio universal e a ideia radical de que o livre arbítrio é o maior dom da humanidade. O livro explora 14 capítulos de filosofia prática projetados para ajudá-lo a assumir o controle da sua vida.",
                es: "Destiny Hacking se basa en un marco filosófico que combina la sabiduría estoica, el concepto de equilibrio universal y la idea radical de que el libre albedrío es el mayor regalo de la humanidad. El libro explora 14 capítulos de filosofía práctica diseñados para ayudarte a tomar las riendas de tu vida.",
              })}
            </motion.p>

            <motion.div variants={fadeUp}>
              <Link href="/philosophy">
                <Button variant="outline" className="border-[#01D98D]/30 text-[#01D98D] hover:bg-[#01D98D]/10 bg-transparent">
                  {t({ en: "Read the Philosophy", pt: "Ler a Filosofia", es: "Leer la Filosofía" })}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6: DOWNLOAD / GET STARTED
      ═══════════════════════════════════════════════════════════════ */}
      <section ref={downloadRef} className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-4">
              {t({ en: "Begin Your Journey", pt: "Comece Sua Jornada", es: "Comienza Tu Viaje" })}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/50 mb-10">
              {t({
                en: "Available on iOS and Android. Free to download.",
                pt: "Disponível no iOS e Android. Download gratuito.",
                es: "Disponible en iOS y Android. Descarga gratuita.",
              })}
            </motion.p>

            <motion.div variants={fadeUp}>
              <AppStoreBadges className="mb-8" />
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-4 justify-center">
              <div className="h-px bg-white/10 w-16" />
              <span className="text-white/30 text-sm">{t({ en: "or", pt: "ou", es: "o" })}</span>
              <div className="h-px bg-white/10 w-16" />
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8">
              <Link href="/auth">
                <Button size="lg" className="bg-[#01D98D] hover:bg-[#01D98D]/90 text-black font-semibold px-10 py-6 text-base rounded-xl">
                  {t({ en: "Create Account", pt: "Criar Conta", es: "Crear Cuenta" })}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7: FOOTER
      ═══════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.06] py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#01D98D]" />
              <span className="font-semibold">Destiny Hacking</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/50">
              <Link href="/terms" className="hover:text-white transition-colors">
                {t({ en: "Terms & Conditions", pt: "Termos e Condições", es: "Términos y Condiciones" })}
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                {t({ en: "Privacy Policy", pt: "Política de Privacidade", es: "Política de Privacidad" })}
              </Link>
              <a href="mailto:support@destinyhacking.app" className="hover:text-white transition-colors">
                {t({ en: "Contact", pt: "Contato", es: "Contacto" })}
              </a>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-white/30 mb-3">
              © 2026 Merx Digital Solutions Ltd. {t({ en: "All rights reserved.", pt: "Todos os direitos reservados.", es: "Todos los derechos reservados." })}
            </p>
            <p className="text-xs italic text-white/20">
              "I am the master of my fate, I am the captain of my soul."
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
