import { useMemo } from "react";

const INVICTUS_LINES = [
  "I am the master of my fate, I am the captain of my soul.",
  "My head is bloody, but unbowed.",
  "I thank whatever gods may be for my unconquerable soul.",
  "It matters not how strait the gate, how charged with punishments the scroll.",
  "In the fell clutch of circumstance I have not winced nor cried aloud.",
  "Beyond this place of wrath and tears looms but the Horror of the shade.",
  "Under the bludgeonings of chance my head is bloody, but unbowed.",
  "Out of the night that covers me, black as the pit from pole to pole.",
];

export function InvictusFooter({ className = "" }: { className?: string }) {
  const quote = useMemo(
    () => INVICTUS_LINES[Math.floor(Math.random() * INVICTUS_LINES.length)],
    []
  );

  return (
    <footer className={`py-6 text-center ${className}`}>
      <p className="text-xs text-muted-foreground/40 italic max-w-sm mx-auto leading-relaxed">
        "{quote}"
      </p>
      <p className="text-[10px] text-muted-foreground/30 mt-1">
        — William Ernest Henley, <em>Invictus</em>
      </p>
    </footer>
  );
}
