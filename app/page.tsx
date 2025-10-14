"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  FileText,
  MessageSquare,
  Download,
  Zap,
  Shield,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SOW Generator</span>
          </div>
          <Link href="/intake">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">
            Turn Discovery Calls into
            <span className="text-primary"> Polished SOWs</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            AI-powered Statement of Work and Proposal generation. From intake to
            export in minutes, not days.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/intake">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Create Your First SOW
              </Button>
            </Link>
            <Link href="/workspace">
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Everything you need to create professional SOWs
          </h2>
          <p className="text-muted-foreground">
            From discovery to approval, all in one place
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <Sparkles className="h-10 w-10 text-primary mb-2" />
              <CardTitle>AI-Powered Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Transform discovery inputs into structured SOWs with smart
                defaults and best practices built in.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Rich Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Edit sections, deliverables, timelines, and pricing with
                intuitive visual controls.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Add comments, track changes, and manage versions with built-in
                review workflows.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Download className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Export Options</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Download as PDF, DOCX, or Markdown. Share read-only links with
                clients.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Generate complete SOWs in seconds. No more copying from
                templates or starting from scratch.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Always in Control</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Review, edit, and approve every section. AI suggests, you
                decide.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-3xl mx-auto bg-primary text-primary-foreground">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to get started?</h2>
            <p className="text-lg opacity-90">
              Create your first SOW in under 5 minutes. No credit card required.
            </p>
            <Link href="/intake">
              <Button size="lg" variant="secondary">
                Start Creating
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm dark:bg-gray-900/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 SOW Generator. Built with Next.js and AI.</p>
        </div>
      </footer>
    </div>
  );
}

