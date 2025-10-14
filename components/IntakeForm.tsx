"use client";

import { Discovery } from "@/lib/schema";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { useState } from "react";
import { SAMPLES } from "@/data/samples";
import { parseTranscriptWithAI, SAMPLE_TRANSCRIPT } from "@/lib/transcript-parser";
import { FileText, Upload, Sparkles, Loader2 } from "lucide-react";

interface IntakeFormProps {
  onSubmit: (discovery: Discovery) => void;
  isLoading?: boolean;
}

export function IntakeForm({ onSubmit, isLoading = false }: IntakeFormProps) {
  const [transcript, setTranscript] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [formData, setFormData] = useState<Discovery>({
    client: {
      name: "",
      industry: "",
      region: "",
      contact: "",
    },
    project: {
      title: "",
      context: "",
      objectives: [],
      successCriteria: [],
    },
    scope: {
      modules: [],
      customNotes: "",
    },
    constraints: {
      timelineWeeks: 12,
      budgetRange: "",
      compliance: [],
    },
    risks: [],
    pricingPreference: "TM",
    timelineWindow: {
      start: "",
      end: "",
    },
    tone: "consultative",
  });

  const loadSample = (sampleKey: "A" | "B") => {
    setFormData(SAMPLES[sampleKey]);
    setShowTranscript(false);
    setTranscript("");
  };

  const loadSampleTranscript = () => {
    setTranscript(SAMPLE_TRANSCRIPT);
    setShowTranscript(true);
  };

  const parseAndFillForm = async () => {
    if (!transcript.trim()) return;
    
    setIsParsing(true);
    
    try {
      // Simulate AI API call with proper extraction
      const parsed = await parseTranscriptWithAI(transcript);
      
      // Merge parsed data with existing form data
      setFormData(prev => ({
        ...prev,
        client: {
          ...prev.client,
          ...parsed.client,
        },
        project: {
          ...prev.project,
          ...parsed.project,
        },
        scope: {
          ...prev.scope,
          ...parsed.scope,
        },
        constraints: {
          ...prev.constraints,
          ...parsed.constraints,
        },
        risks: parsed.risks || prev.risks,
        pricingPreference: parsed.pricingPreference || prev.pricingPreference,
        timelineWindow: parsed.timelineWindow || prev.timelineWindow,
        tone: parsed.tone || prev.tone,
      }));
      
      setShowTranscript(false);
    } catch (error) {
      console.error("Error parsing transcript:", error);
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse comma-separated fields
    const discovery: Discovery = {
      ...formData,
      project: {
        ...formData.project,
        objectives: formData.project.objectives.length
          ? formData.project.objectives
          : (formData.project.objectives as any).split(",").map((s: string) => s.trim()).filter(Boolean),
        successCriteria: formData.project.successCriteria.length
          ? formData.project.successCriteria
          : (formData.project.successCriteria as any).split(",").map((s: string) => s.trim()).filter(Boolean),
      },
      scope: {
        ...formData.scope,
        modules: formData.scope.modules.length
          ? formData.scope.modules
          : (formData.scope.modules as any).split(",").map((s: string) => s.trim()).filter(Boolean),
      },
    };

    onSubmit(discovery);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Transcript Upload Section */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Transcript Parsing
          </CardTitle>
          <CardDescription>
            Paste your discovery call transcript and let AI extract the key information.
            You can review and edit before generating the SOW.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showTranscript ? (
            <>
              <div>
                <Label htmlFor="transcript">Call Transcript</Label>
                <Textarea
                  id="transcript"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  rows={12}
                  placeholder="Paste your discovery call transcript here..."
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={parseAndFillForm}
                  className="gap-2"
                  disabled={isParsing || !transcript.trim()}
                >
                  {isParsing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing Transcript...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Parse & Auto-Fill Form
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowTranscript(false)}
                  disabled={isParsing}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowTranscript(true)}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Paste Transcript
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={loadSampleTranscript}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Load Sample Transcript
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sample loaders */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">Or load example:</div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => loadSample("A")}
        >
          Sample A (SaaS)
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => loadSample("B")}
        >
          Sample B (E-commerce)
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={formData.client.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    client: { ...formData.client, name: e.target.value },
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry *</Label>
              <Input
                id="industry"
                value={formData.client.industry}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    client: { ...formData.client, industry: e.target.value },
                  })
                }
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={formData.client.region}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    client: { ...formData.client, region: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                value={formData.client.contact}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    client: { ...formData.client, contact: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="projectTitle">Project Title *</Label>
            <Input
              id="projectTitle"
              value={formData.project.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  project: { ...formData.project, title: e.target.value },
                })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="context">Context *</Label>
            <Textarea
              id="context"
              value={formData.project.context}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  project: { ...formData.project, context: e.target.value },
                })
              }
              rows={4}
              required
            />
          </div>
          <div>
            <Label htmlFor="objectives">Objectives (comma-separated) *</Label>
            <Textarea
              id="objectives"
              value={
                Array.isArray(formData.project.objectives)
                  ? formData.project.objectives.join(", ")
                  : formData.project.objectives
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  project: { ...formData.project, objectives: e.target.value as any },
                })
              }
              rows={3}
              required
            />
          </div>
          <div>
            <Label htmlFor="successCriteria">Success Criteria (comma-separated) *</Label>
            <Textarea
              id="successCriteria"
              value={
                Array.isArray(formData.project.successCriteria)
                  ? formData.project.successCriteria.join(", ")
                  : formData.project.successCriteria
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  project: {
                    ...formData.project,
                    successCriteria: e.target.value as any,
                  },
                })
              }
              rows={3}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scope & Modules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="modules">Modules (comma-separated) *</Label>
            <Textarea
              id="modules"
              value={
                Array.isArray(formData.scope.modules)
                  ? formData.scope.modules.join(", ")
                  : formData.scope.modules
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  scope: { ...formData.scope, modules: e.target.value as any },
                })
              }
              rows={4}
              required
            />
          </div>
          <div>
            <Label htmlFor="customNotes">Custom Notes</Label>
            <Textarea
              id="customNotes"
              value={formData.scope.customNotes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  scope: { ...formData.scope, customNotes: e.target.value },
                })
              }
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Constraints & Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timelineWeeks">Timeline (weeks)</Label>
              <Input
                id="timelineWeeks"
                type="number"
                value={formData.constraints?.timelineWeeks}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    constraints: {
                      ...formData.constraints,
                      timelineWeeks: parseInt(e.target.value) || 12,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="budgetRange">Budget Range</Label>
              <Input
                id="budgetRange"
                value={formData.constraints?.budgetRange}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    constraints: {
                      ...formData.constraints,
                      budgetRange: e.target.value,
                    },
                  })
                }
                placeholder="$100k - $200k"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pricingPreference">Pricing Preference</Label>
              <Select
                value={formData.pricingPreference}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    pricingPreference: value as "TM" | "Fixed" | "Hybrid",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TM">Time & Materials</SelectItem>
                  <SelectItem value="Fixed">Fixed Price</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tone">Tone</Label>
              <Select
                value={formData.tone}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    tone: value as "formal" | "consultative" | "friendly",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="consultative">Consultative</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate SOW & Proposal"}
        </Button>
      </div>
    </form>
  );
}

