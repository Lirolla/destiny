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

interface ShareProgressProps {
  summary: ProgressSummary;
}

export function ShareProgress({ summary }: ShareProgressProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleWebShare = async () => {
    const success = await shareViaWebAPI(summary);
    if (success) {
      setOpen(false);
      toast.success("Shared successfully!");
    }
  };

  const handleCopy = async () => {
    const success = await copyShareText(summary);
    if (success) {
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy");
    }
  };

  const handleTwitter = () => {
    shareToTwitter(summary);
    setOpen(false);
    toast.success("Opening Twitter...");
  };

  const handleFacebook = () => {
    shareToFacebook(summary);
    setOpen(false);
    toast.success("Opening Facebook...");
  };

  const handleLinkedIn = () => {
    shareToLinkedIn(summary);
    setOpen(false);
    toast.success("Opening LinkedIn...");
  };

  const shareText = generateShareText(summary);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share Progress
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Progress</DialogTitle>
          <DialogDescription>
            Share your anonymized progress summary (no personal emotional data)
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
                Share
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
                Twitter
              </Button>
              <Button
                onClick={handleFacebook}
                variant="outline"
                size="sm"
              >
                <Facebook className="h-4 w-4 mr-1" />
                Facebook
              </Button>
              <Button
                onClick={handleLinkedIn}
                variant="outline"
                size="sm"
              >
                <Linkedin className="h-4 w-4 mr-1" />
                LinkedIn
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
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Only aggregate stats are shared. Your specific emotional data remains private.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
