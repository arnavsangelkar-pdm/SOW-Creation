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
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discovery }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate draft");
      }

      const { sow, proposal } = await response.json();

      // Store in localStorage
      localStorage.setItem(
        "sow_workspace",
        JSON.stringify({
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
        })
      );

      toast({
        title: "SOW Generated!",
        description: "Your document has been created successfully.",
      });

      router.push("/workspace");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate SOW. Please try again.",
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

