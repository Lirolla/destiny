import { Link } from "wouter";
import {
  BarChart3,
  Brain,
  Calendar,
  ChevronRight,
  Compass,
  Heart,
  Layers,
  Lightbulb,
  Moon,
  Settings,
  Sprout,
  Star,
  Sun,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const menuSections = [
  {
    title: "Daily Practice",
    items: [
      {
        icon: Compass,
        label: "Daily Cycle",
        description: "Morning, midday & evening rituals",
        path: "/daily-cycle",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
      },
      {
        icon: Layers,
        label: "Emotional Sliders",
        description: "Calibrate your inner state",
        path: "/sliders",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
      },
      {
        icon: Brain,
        label: "Bias Clearing",
        description: "Clear mental fog & biases",
        path: "/bias-clearing",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
      },
      {
        icon: Heart,
        label: "Prayer Journal",
        description: "Four-part prayer protocol",
        path: "/prayer-journal",
        color: "text-rose-500",
        bg: "bg-rose-500/10",
      },
    ],
  },
  {
    title: "Growth & Tracking",
    items: [
      {
        icon: BarChart3,
        label: "Progress Dashboard",
        description: "Your learning journey overview",
        path: "/progress",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
      },
      {
        icon: Trophy,
        label: "Achievements",
        description: "Badges & milestones earned",
        path: "/achievements",
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
      },
      {
        icon: Zap,
        label: "Flashcards",
        description: "Review key concepts",
        path: "/flashcards",
        color: "text-orange-500",
        bg: "bg-orange-500/10",
      },
      {
        icon: Calendar,
        label: "Weekly Review",
        description: "Reflect on your week",
        path: "/weekly-review",
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
      },
    ],
  },
  {
    title: "Community & Tools",
    items: [
      {
        icon: Users,
        label: "Inner Circle",
        description: "Connect with accountability partners",
        path: "/inner-circle",
        color: "text-indigo-500",
        bg: "bg-indigo-500/10",
      },
      {
        icon: Sprout,
        label: "Sowing & Reaping",
        description: "Track cause-effect relationships",
        path: "/sowing-reaping",
        color: "text-green-500",
        bg: "bg-green-500/10",
      },
      {
        icon: Lightbulb,
        label: "AI Insights",
        description: "Pattern analysis & recommendations",
        path: "/insights",
        color: "text-sky-500",
        bg: "bg-sky-500/10",
      },
      {
        icon: Star,
        label: "Challenges",
        description: "Group challenges & competitions",
        path: "/challenges",
        color: "text-pink-500",
        bg: "bg-pink-500/10",
      },
    ],
  },
];

export default function More() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">More</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              All features & tools
            </p>
          </div>
          {/* Theme Toggle */}
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="relative w-14 h-8 rounded-full bg-muted border border-border transition-colors duration-300 flex items-center"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <div
                className={`absolute w-6 h-6 rounded-full bg-primary shadow-md flex items-center justify-center transition-transform duration-300 ${
                  theme === "dark" ? "translate-x-7" : "translate-x-1"
                }`}
              >
                {theme === "dark" ? (
                  <Moon className="h-3.5 w-3.5 text-primary-foreground" />
                ) : (
                  <Sun className="h-3.5 w-3.5 text-primary-foreground" />
                )}
              </div>
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-4 space-y-6 pb-28">
        {menuSections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
              {section.title}
            </h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-accent/50 active:bg-accent transition-colors"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Settings Section */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
            Settings
          </h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
            {/* Theme Toggle Row */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                {theme === "dark" ? (
                  <Moon className="w-5 h-5 text-violet-500" />
                ) : (
                  <Sun className="w-5 h-5 text-violet-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">Appearance</div>
                <div className="text-xs text-muted-foreground">
                  {theme === "dark" ? "Dark mode" : "Light mode"}
                </div>
              </div>
              {toggleTheme && (
                <button
                  onClick={toggleTheme}
                  className={`relative w-12 h-7 rounded-full transition-colors duration-300 flex items-center ${
                    theme === "dark" ? "bg-primary" : "bg-muted border border-border"
                  }`}
                  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                  <div
                    className={`absolute w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                      theme === "dark" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              )}
            </div>

            {/* Settings Link */}
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-accent/50 active:bg-accent transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-gray-500/10 flex items-center justify-center flex-shrink-0">
                <Settings className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">Settings</div>
                <div className="text-xs text-muted-foreground truncate">
                  Notifications, export & preferences
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
