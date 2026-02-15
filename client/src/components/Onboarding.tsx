import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Gauge, Calendar, BookOpen, ArrowRight, ArrowLeft, X } from "lucide-react";

/**
 * Onboarding Flow Component
 * 
 * 3-step tutorial for new users explaining:
 * 1. The 15 Axes of Free Will — Calibrate your state
 * 2. Daily Will Cycle — Morning → Midday → Evening practice
 * 3. Learning Path — 14 chapter-based interactive modules
 */

interface OnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Gauge,
      title: "The 15 Axes of Free Will",
      description: "Calibrate your will with surgical precision",
      content: (
        <div className="space-y-4">
          <p className="text-foreground leading-relaxed">
            Your free will operates across <strong>15 measurable dimensions</strong>. Each axis is a bipolar spectrum — from where you are to where you could be:
          </p>
          <div className="bg-primary/10 p-6 rounded-lg border-l-4 border-primary">
            <div className="text-center mb-4">
              <p className="text-2xl mb-1">🔋</p>
              <p className="text-lg font-semibold">Axis 0: The Will Axis</p>
              <p className="text-sm text-muted-foreground">Powerless ↔ Powerful</p>
              <p className="text-xs text-muted-foreground mt-1 italic">"The master axis — the engine of all change"</p>
            </div>
            <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'linear-gradient(to right, #8B0000, #FFD700)' }}>
              <div className="absolute top-1/2 -translate-y-1/2 h-5 w-5 bg-white border-2 border-primary rounded-full shadow-lg" style={{ left: '65%', transform: 'translate(-50%, -50%)' }} />
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Powerless</span>
              <span className="font-bold text-primary">65</span>
              <span>Powerful</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground italic text-center">
            "Am I exercising my will right now, or am I on autopilot?"
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>15 axes mapped to the 14 chapters of the book, plus the master Will Axis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Each axis has a reflection prompt to deepen your awareness</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Your <strong>Destiny Score</strong> is the average of all 15 axes — your overall free will health</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      icon: Calendar,
      title: "Daily Will Cycle",
      description: "Operationalise free will with structured practice",
      content: (
        <div className="space-y-4">
          <p className="text-foreground leading-relaxed">
            Transform awareness into action through a <strong>three-phase daily practice</strong>:
          </p>
          <div className="space-y-3">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center text-lg">🌅</div>
                <h4 className="font-semibold">Morning Calibration</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                Calibrate all 15 axes. Set your intention. Know where your will stands before the day begins.
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-lg">⚡</div>
                <h4 className="font-semibold">Midday Decisive Action</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                Focus on your <strong>3 lowest axes</strong>. The Stoic Strategist generates a decisive action. Commit to one concrete choice.
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-lg">🌙</div>
                <h4 className="font-semibold">Evening Reflection</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                Recalibrate. Map cause and effect: What did you sow today? What did you reap? The AI analyses patterns.
              </p>
            </div>
          </div>
          <div className="bg-primary/10 p-4 rounded-lg text-center">
            <p className="text-sm font-medium">
              Complete cycles build your <strong>streak</strong> and move you toward the <strong>Invictus Moment</strong>
            </p>
          </div>
        </div>
      )
    },
    {
      icon: BookOpen,
      title: "The Learning Path",
      description: "14 chapter modules to master your free will",
      content: (
        <div className="space-y-4">
          <p className="text-foreground leading-relaxed">
            Progress through <strong>14 interactive modules</strong> — each one built from a chapter of the Destiny Hacking book:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Module 1</div>
              <div className="font-medium text-sm">The Divine Gift</div>
              <div className="text-xs text-muted-foreground">The Power of Free Will</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Module 2</div>
              <div className="font-medium text-sm">The Unbreakable Law</div>
              <div className="text-xs text-muted-foreground">Sowing and Reaping</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Module 3</div>
              <div className="font-medium text-sm">The Unfair Advantage</div>
              <div className="text-xs text-muted-foreground">Meaning in Unfairness</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Module 4</div>
              <div className="font-medium text-sm">The Gravity of Choice</div>
              <div className="text-xs text-muted-foreground">Abuser and Victim</div>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Each module: core principle, mental model, daily practice, decision challenge, reflection</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Complete practice days and challenges to unlock the next module</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>14 modules. 14 chapters. One journey to becoming the captain of your soul.</span>
            </li>
          </ul>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
                <CardDescription>{currentStepData.description}</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onSkip}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStepData.content}

          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button variant="link" onClick={onSkip} className="text-muted-foreground">
              Skip Tutorial
            </Button>

            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
