import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import NavBar from "./components/NavBar";
import EnergyLibraryPage from "./pages/EnergyLibraryPage";
import GeneratorPage from "./pages/GeneratorPage";
import KinesisArchivePage from "./pages/KinesisArchivePage";
import SettingsPage from "./pages/SettingsPage";
import WikiSearchPage from "./pages/WikiSearchPage";

type Page = "generator" | "energy" | "kinesis" | "wiki" | "settings";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("generator");
  const [wikiInjectedTopic, setWikiInjectedTopic] = useState<string>("");

  const handleUseForSubliminal = (topic: string) => {
    setWikiInjectedTopic(topic);
    setCurrentPage("generator");
  };

  return (
    <div className="min-h-screen bg-shimmer relative overflow-x-hidden">
      {/* Cosmic background overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-30"
        style={{
          backgroundImage: `url('/assets/generated/synapse-hero-bg.dim_1920x1080.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(1px) saturate(1.2)",
        }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-background/70" />

      {/* Top radial glow decoration */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at top, oklch(0.62 0.22 295 / 0.12), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <NavBar currentPage={currentPage} onNavigate={setCurrentPage} />

        <main className="flex-1">
          {currentPage === "generator" && (
            <GeneratorPage
              injectedTopic={wikiInjectedTopic}
              onInjectedTopicConsumed={() => setWikiInjectedTopic("")}
            />
          )}
          {currentPage === "energy" && <EnergyLibraryPage />}
          {currentPage === "kinesis" && <KinesisArchivePage />}
          {currentPage === "wiki" && (
            <WikiSearchPage onUseForSubliminal={handleUseForSubliminal} />
          )}
          {currentPage === "settings" && <SettingsPage />}
        </main>

        <footer className="text-center py-6 text-muted-foreground text-xs border-t border-border/40 mt-12">
          <span>
            © {new Date().getFullYear()}. Built with{" "}
            <span className="text-primary">♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 transition-colors"
            >
              caffeine.ai
            </a>
          </span>
        </footer>
      </div>

      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.13 0.018 270)",
            border: "1px solid oklch(0.62 0.22 295 / 0.4)",
            color: "oklch(0.93 0.01 260)",
          },
        }}
      />
    </div>
  );
}
