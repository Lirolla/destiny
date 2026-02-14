import { PageHeader } from "@/components/PageHeader";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Privacy & Data" subtitle="Your data, your sovereignty" showBack />
      
      <main className="px-4 py-6 pb-24 max-w-2xl mx-auto space-y-6">
        <div className="prose prose-sm prose-invert max-w-none space-y-4">
          <h2 className="text-lg font-bold text-foreground">Your Data Sovereignty</h2>
          <p className="text-muted-foreground leading-relaxed">
            Destiny Hacking is built on the principle that <strong className="text-foreground">you own your data</strong>. 
            Your emotional calibrations, reflections, journal entries, and progress data belong to you — 
            not to advertisers, not to data brokers, not to anyone else.
          </p>

          <h3 className="text-base font-semibold text-foreground">What We Store</h3>
          <ul className="text-muted-foreground space-y-2 list-disc pl-5">
            <li>Your emotional axis calibrations (slider values and timestamps)</li>
            <li>Daily cycle completions (morning/midday/evening check-ins)</li>
            <li>Practice module progress and reflections</li>
            <li>Audiobook and book reading progress</li>
            <li>AI coach conversation history (for pattern analysis)</li>
            <li>Achievement badges and streaks</li>
          </ul>

          <h3 className="text-base font-semibold text-foreground">What We Never Do</h3>
          <ul className="text-muted-foreground space-y-2 list-disc pl-5">
            <li>Sell your data to third parties</li>
            <li>Use your emotional data for advertising</li>
            <li>Share your calibrations with other users (unless you explicitly choose to via Inner Circle)</li>
            <li>Train AI models on your personal reflections</li>
            <li>Store data longer than necessary for your use</li>
          </ul>

          <h3 className="text-base font-semibold text-foreground">AI Coach Privacy</h3>
          <p className="text-muted-foreground leading-relaxed">
            The Stoic Strategist AI reads your axis data to provide personalized observations. 
            Your conversations are processed in real-time and are not used to train external AI models. 
            The AI sees your patterns — not your identity.
          </p>

          <h3 className="text-base font-semibold text-foreground">Data Export & Deletion</h3>
          <p className="text-muted-foreground leading-relaxed">
            You can request a full export of your data or complete deletion at any time 
            by contacting us through the Settings page. Your sovereignty extends to your data.
          </p>

          <div className="border-t border-border pt-4 mt-6">
            <p className="text-xs text-muted-foreground/60 italic text-center">
              "I am the master of my fate, I am the captain of my soul." — This applies to your data too.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
