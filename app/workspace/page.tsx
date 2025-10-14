"use client";

import { useEffect, useState } from "react";
import { useWorkspaceStore } from "@/lib/store";
import { OutlineTree } from "@/components/OutlineTree";
import { EditorPane } from "@/components/EditorPane";
import { Timeline } from "@/components/Timeline";
import { PricingTable } from "@/components/PricingTable";
import { CommentDrawer } from "@/components/CommentDrawer";
import { VersionList } from "@/components/VersionList";
import { StatusBadge } from "@/components/StatusBadge";
import { ExportMenu } from "@/components/ExportMenu";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Save,
  Share2,
  Settings,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Section } from "@/lib/schema";

export default function WorkspacePage() {
  const {
    sow,
    proposal,
    versions,
    comments,
    changes,
    loadFromStorage,
    updateSowSection,
    addVersion,
    addComment,
    resolveComment,
    updateStatus,
  } = useWorkspaceStore();

  const { toast } = useToast();
  const [activeSectionId, setActiveSectionId] = useState<string>();
  const [activeTab, setActiveTab] = useState("sow");
  const [lastSaved, setLastSaved] = useState<Date>();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (sow && sow.sections.length > 0 && !activeSectionId) {
      setActiveSectionId(sow.sections[0].id);
    }
  }, [sow, activeSectionId]);

  const currentDraft = activeTab === "sow" ? sow : proposal;

  if (!currentDraft) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-semibold">No Document Found</h2>
          <p className="text-muted-foreground">
            Create a new SOW from the intake form
          </p>
          <Link href="/intake">
            <Button>Go to Intake</Button>
          </Link>
        </div>
      </div>
    );
  }

  const activeSection = currentDraft.sections.find(
    (s) => s.id === activeSectionId
  );

  const handleSectionUpdate = (content: any) => {
    if (!activeSectionId) return;
    updateSowSection(activeSectionId, content);
    setLastSaved(new Date());
    
    toast({
      title: "Auto-saved",
      description: "Your changes have been saved.",
    });
  };

  const handleSave = () => {
    if (!currentDraft) return;
    
    addVersion(currentDraft, `Manual save - ${new Date().toLocaleTimeString()}`);
    setLastSaved(new Date());
    
    toast({
      title: "Saved",
      description: "Version created successfully.",
    });
  };

  const handleStatusChange = (newStatus: typeof currentDraft.status) => {
    if (!currentDraft) return;
    updateStatus(currentDraft.id, newStatus);
    
    toast({
      title: "Status Updated",
      description: `Document is now ${newStatus}`,
    });
  };

  const handleAddComment = (content: string, sectionId: string) => {
    addComment({
      sectionId,
      content,
      author: "Current User",
      resolved: false,
      replies: [],
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-semibold">{currentDraft.meta.title}</h1>
            <p className="text-xs text-muted-foreground">
              {currentDraft.meta.clientName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={currentDraft.status} />
          
          {lastSaved && (
            <span className="text-xs text-muted-foreground">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}

          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>

          <ExportMenu draft={currentDraft} />

          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>

          {currentDraft.status === "Draft" && (
            <Button size="sm" onClick={() => handleStatusChange("In Review")}>
              Submit for Review
            </Button>
          )}
          
          {currentDraft.status === "In Review" && (
            <Button size="sm" onClick={() => handleStatusChange("Approved")}>
              Approve
            </Button>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Outline */}
        <aside className="w-64 border-r bg-card p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Document Outline</h3>
              <OutlineTree
                sections={currentDraft.sections}
                activeSectionId={activeSectionId}
                onSectionClick={setActiveSectionId}
              />
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setActiveSectionId("timeline")}
                >
                  View Timeline
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setActiveSectionId("pricing")}
                >
                  View Pricing
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <div className="border-b bg-muted/30 px-6 py-2">
              <TabsList>
                <TabsTrigger value="sow">SOW</TabsTrigger>
                <TabsTrigger value="proposal">Proposal</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="versions">Versions</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="sow" className="mt-0">
                {activeSection ? (
                  <Card className="p-6">
                    <EditorPane
                      section={activeSection}
                      onUpdate={handleSectionUpdate}
                      readOnly={currentDraft.status === "Approved"}
                    />
                  </Card>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    Select a section to edit
                  </div>
                )}
              </TabsContent>

              <TabsContent value="proposal" className="mt-0">
                {proposal && activeSection ? (
                  <Card className="p-6">
                    <EditorPane
                      section={
                        proposal.sections.find((s) => s.id === activeSectionId) ||
                        activeSection
                      }
                      onUpdate={handleSectionUpdate}
                      readOnly={currentDraft.status === "Approved"}
                    />
                  </Card>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    Proposal not available
                  </div>
                )}
              </TabsContent>

              <TabsContent value="timeline" className="mt-0">
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Project Timeline</h2>
                  <Timeline milestones={currentDraft.milestones} />
                </Card>
              </TabsContent>

              <TabsContent value="pricing" className="mt-0">
                <Card className="p-6">
                  <PricingTable pricing={currentDraft.pricing} />
                </Card>
              </TabsContent>

              <TabsContent value="versions" className="mt-0">
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Version History</h2>
                  <VersionList versions={versions} />
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </main>

        {/* Right Sidebar - Comments */}
        <aside className="w-80 border-l bg-card">
          <CommentDrawer
            comments={comments}
            onAddComment={handleAddComment}
            onResolveComment={resolveComment}
            currentSectionId={activeSectionId}
          />
        </aside>
      </div>
    </div>
  );
}

