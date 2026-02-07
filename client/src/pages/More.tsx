import { Link } from "wouter";
import {
  BarChart3,
  Brain,
  Calendar,
  ChevronRight,
  Compass,
  Flame,
  Heart,
  Layers,
  Lightbulb,
  Settings,
  Sprout,
  Star,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

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
  {
    title: "Settings",
    items: [
      {
        icon: Settings,
        label: "Settings",
        description: "Notifications, export & preferences",
        path: "/settings",
        color: "text-gray-500",
        bg: "bg-gray-500/10",
      },
    ],
  },
];

export default function More() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold">More</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            All features & tools
          </p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
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
      </div>
    </div>
  );
}
