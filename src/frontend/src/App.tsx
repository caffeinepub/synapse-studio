import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import NavBar from "./components/NavBar";
import EnergyLibraryPage from "./pages/EnergyLibraryPage";
import GeneratorPage, { type SubliminalContext } from "./pages/GeneratorPage";
import KinesisArchivePage from "./pages/KinesisArchivePage";
import ReligionsPage from "./pages/ReligionsPage";
import RitualsPage from "./pages/RitualsPage";
import SettingsPage from "./pages/SettingsPage";
import SpellsPage from "./pages/SpellsPage";
import SpiritualEntitiesPage from "./pages/SpiritualEntitiesPage";
import VideoEditorPage from "./pages/VideoEditorPage";
import WikiSearchPage from "./pages/WikiSearchPage";
import YouTubePage from "./pages/YouTubePage";

type Page =
  | "generator"
  | "energy"
  | "kinesis"
  | "wiki"
  | "religions"
  | "entities"
  | "spells"
  | "rituals"
  | "settings"
  | "youtube"
  | "videoeditor";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("generator");
  const [wikiInjectedTopic, setWikiInjectedTopic] = useState<string>("");
  const [subliminalCtx, setSubliminalCtx] = useState<SubliminalContext>({
    topic: "",
    affirmations: [],
    modes: {
      booster: false,
      fantasy: false,
      protection: false,
      chakraAlignment: false,
    },
    selectedChakras: [],
    colorPalette: "Violet/Indigo",
    themeStyle: "Dark Cosmic",
  });

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
              onSubliminalUpdate={setSubliminalCtx}
            />
          )}
          {currentPage === "energy" && <EnergyLibraryPage />}
          {currentPage === "kinesis" && <KinesisArchivePage />}
          {currentPage === "wiki" && (
            <WikiSearchPage onUseForSubliminal={handleUseForSubliminal} />
          )}
          {currentPage === "religions" && (
            <ReligionsPage onUseForSubliminal={handleUseForSubliminal} />
          )}
          {currentPage === "entities" && (
            <SpiritualEntitiesPage
              onUseForSubliminal={handleUseForSubliminal}
            />
          )}
          {currentPage === "spells" && (
            <SpellsPage onUseForSubliminal={handleUseForSubliminal} />
          )}
          {currentPage === "rituals" && (
            <RitualsPage onUseForSubliminal={handleUseForSubliminal} />
          )}
          {currentPage === "settings" && <SettingsPage />}
          {currentPage === "youtube" && (
            <YouTubePage
              injectedTopic={wikiInjectedTopic}
              onInjectedTopicConsumed={() => setWikiInjectedTopic("")}
              subliminalCtx={subliminalCtx}
            />
          )}
          {currentPage === "videoeditor" && (
            <VideoEditorPage subliminalCtx={subliminalCtx} />
          )}
        </main>

        <footer className="text-center py-4 sm:py-6 text-muted-foreground text-xs border-t border-border/40 mt-8 sm:mt-12 px-4">
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
