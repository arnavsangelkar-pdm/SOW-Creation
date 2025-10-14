"use client";

import { IntakeForm } from "@/components/IntakeForm";
import { Button } from "@/components/ui/button";
import { Discovery } from "@/lib/schema";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function IntakePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (discovery: Discovery) => {
    console.log("Starting SOW generation...", discovery);
    setIsLoading(true);

    try {
      console.log("Sending request to /api/generate");
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discovery }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Failed to generate draft");
      }

      const { sow, proposal } = await response.json();
      console.log("Generation successful, SOW:", sow?.id, "Proposal:", proposal?.id);

      // Store in localStorage
      const workspace = {
        sow,
        proposal,
        versions: [
          {
            id: `v-${Date.now()}`,
            timestamp: new Date().toISOString(),
            description: "Initial generation",
            draft: sow,
          },
        ],
        changes: [],
        comments: [],
      };
      
      console.log("Saving to localStorage...");
      localStorage.setItem("sow_workspace", JSON.stringify(workspace));
      console.log("Saved to localStorage successfully");

      toast({
        title: "SOW Generated!",
        description: "Your document has been created successfully.",
      });

      console.log("Redirecting to workspace...");
      router.push("/workspace");
    } catch (error: any) {
      console.error("Error generating SOW:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Could not generate SOW. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold">Discovery Intake</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New SOW & Proposal</h1>
          <p className="text-muted-foreground">
            Fill in the discovery details below. You can load a sample to get
            started quickly.
          </p>
        </div>

        <IntakeForm onSubmit={handleSubmit} isLoading={isLoading} />
      </main>
    </div>
  );
}

