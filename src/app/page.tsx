import Link from "next/link";
import { MessageSquare, Sparkles, Clock, Brain } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-base-content mb-6">
          Chat with Multiple AI Personas
          <span className="text-primary"> Simultaneously</span>
        </h1>
        <p className="text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
          Experience dynamic conversations with customizable AI personalities. Shape their identities, behaviors, and expertise to suit your needs.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/api/auth/signin"
            className="px-8 py-3 bg-primary text-primary-content rounded-lg font-medium hover:bg-primary/80 transition-colors"
          >
            Start Free Trial
          </Link>
          <Link
            href="/api/auth/signin"
            className="px-8 py-3 bg-base-200 text-base-content rounded-lg font-medium hover:bg-base-300 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features for Enhanced AI Interactions</h2>
        
        {/* Core Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="p-6 rounded-xl bg-base-200 border border-base-300 transform hover:scale-105 transition-transform">
            <MessageSquare className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Multiple Chat Personas</h3>
            <p className="text-base-content/70">
              Chat with multiple AI personalities in a single conversation. Perfect for brainstorming, debates, and multi-perspective analysis.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-base-200 border border-base-300 transform hover:scale-105 transition-transform">
            <Brain className="w-12 h-12 text-secondary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Customizable Identities</h3>
            <p className="text-base-content/70">
              Create and customize AI personas with specific expertise, personality traits, and knowledge domains. From experts to creative partners.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-base-200 border border-base-300 transform hover:scale-105 transition-transform">
            <Clock className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Instant Free Trial</h3>
            <p className="text-base-content/70">
            Get started quickly with our streamlined onboarding process. Experience the full power of multi-persona AI conversations.
            </p>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="py-24 bg-base-200/30 -mx-4 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Advanced Capabilities</h2>
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div className="p-8 rounded-xl bg-base-100 border border-base-300 shadow-lg">
                <h3 className="text-2xl font-semibold mb-6 text-primary">Collaborative Intelligence</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">•</span>
                    <span className="text-lg">Group discussions with multiple AI personas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">•</span>
                    <span className="text-lg">Cross-domain problem solving</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">•</span>
                    <span className="text-lg">Dynamic conversation flow between personas</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 rounded-xl bg-base-100 border border-base-300 shadow-lg">
                <h3 className="text-2xl font-semibold mb-6 text-primary">Persona Management</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">•</span>
                    <span className="text-lg">Save and reuse custom personas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">•</span>
                    <span className="text-lg">Fine-tune personality attributes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">•</span>
                    <span className="text-lg">Share personas with team members</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="bg-gradient-to-b from-base-200/50 to-base-200 rounded-3xl p-12 mb-12">
          <h3 className="text-3xl font-bold mb-8 text-center">Transformative Use Cases</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-base-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h4 className="text-xl font-semibold mb-3 text-primary">Focus Groups</h4>
              <p className="text-base-content/70">
                Simulate diverse focus group discussions with AI personas representing different demographics, perspectives, and user profiles.
              </p>
            </div>
            <div className="bg-base-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h4 className="text-xl font-semibold mb-3 text-secondary">Strategic Planning</h4>
              <p className="text-base-content/70">
                Engage with AI advisors specializing in different business domains for comprehensive strategy development.
              </p>
            </div>
            <div className="bg-base-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h4 className="text-xl font-semibold mb-3 text-accent">Educational Scenarios</h4>
              <p className="text-base-content/70">
                Create immersive learning environments with AI tutors, mentors, and subject matter experts.
              </p>
            </div>
            <div className="bg-base-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h4 className="text-xl font-semibold mb-3 text-primary">Creative Development</h4>
              <p className="text-base-content/70">
                Collaborate with AI personas representing different creative roles - from writers to critics to storytellers.
              </p>
            </div>
            <div className="bg-base-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h4 className="text-xl font-semibold mb-3 text-secondary">Decision Making</h4>
              <p className="text-base-content/70">
                Analyze decisions from multiple angles with AI personas offering different expertise and viewpoints.
              </p>
            </div>
            <div className="bg-base-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h4 className="text-xl font-semibold mb-3 text-accent">Research & Analysis</h4>
              <p className="text-base-content/70">
                Conduct thorough research discussions with AI specialists across various disciplines and methodologies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-base-200 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-base-300">
          <Sparkles className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your AI Interactions?</h2>
          <p className="text-xl text-base-content/70 mb-8">
            Start your journey into multi-persona AI conversations today. Transform the way you think, create, and solve problems.
          </p>
          <Link
            href="/api/auth/signin"
            className="px-8 py-3 bg-primary text-primary-content rounded-lg font-medium hover:bg-primary/80 transition-colors inline-block"
          >
            Begin Your Journey
          </Link>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="container mx-auto px-4 py-8 text-center border-t border-base-300">
        <p className="text-base-content/70">
          © 2025 DiverseGPT. All rights reserved.
        </p>
        <div className="mt-4 space-x-4">
          <Link href="/terms" className="text-base-content/70 hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <span className="text-base-content/70">•</span>
          <Link href="/privacy" className="text-base-content/70 hover:text-primary transition-colors">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
