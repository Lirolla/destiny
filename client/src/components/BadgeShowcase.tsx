import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBadgeDefinition, getBadgeRarityColor, type BadgeType } from "@/lib/badges";
import { Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BadgeShowcaseProps {
  unlockedBadges: BadgeType[];
  allBadges?: BadgeType[];
  showLocked?: boolean;
}

export function BadgeShowcase({ unlockedBadges, allBadges, showLocked = true }: BadgeShowcaseProps) {
  const displayBadges = showLocked && allBadges ? allBadges : unlockedBadges;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {displayBadges.map((badgeType) => {
        const badge = getBadgeDefinition(badgeType);
        const isUnlocked = unlockedBadges.includes(badgeType);
        const rarityColor = getBadgeRarityColor(badge.rarity);

        return (
          <Card
            key={badgeType}
            className={`relative overflow-hidden transition-all hover:scale-105 ${
              isUnlocked ? "border-primary/50" : "opacity-50 grayscale"
            }`}
          >
            {!isUnlocked && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                <Lock className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            
            <CardHeader className="p-4 pb-2">
              <div className="text-4xl text-center mb-2">{badge.icon}</div>
              <CardTitle className="text-sm text-center">{badge.name}</CardTitle>
            </CardHeader>
            
            <CardContent className="p-4 pt-0">
              <CardDescription className="text-xs text-center mb-2">
                {badge.description}
              </CardDescription>
              <div className="flex justify-center">
                <Badge variant="outline" className={`text-xs ${rarityColor}`}>
                  {badge.rarity}
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

interface BadgeNotificationProps {
  badgeType: BadgeType;
  onClose: () => void;
}

export function BadgeNotification({ badgeType, onClose }: BadgeNotificationProps) {
  const { t } = useLanguage();
  const badge = getBadgeDefinition(badgeType);
  const rarityColor = getBadgeRarityColor(badge.rarity);

  return (
    <Card className="w-full max-w-sm border-primary shadow-lg animate-in slide-in-from-bottom-5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{badge.icon}</div>
            <div>
              <CardTitle className="text-lg">{t({ en: "Badge Unlocked!", pt: "Emblema Desbloqueado!", es: "¡Insignia Desbloqueada!" })}</CardTitle>
              <CardDescription className="text-sm">{badge.name}</CardDescription>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
        <Badge variant="outline" className={`text-xs ${rarityColor}`}>
          {badge.rarity}
        </Badge>
      </CardContent>
    </Card>
  );
}
