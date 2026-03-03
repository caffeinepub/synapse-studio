import {
  Archive,
  BookOpen,
  Brain,
  Film,
  Ghost,
  Globe,
  Heart,
  Menu,
  Moon,
  Search,
  Settings,
  Star,
  Wand2,
  X,
  Youtube,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type Page =
  | "generator"
  | "energy"
  | "kinesis"
  | "wiki"
  | "religions"
  | "entities"
  | "spells"
  | "sigils"
  | "rituals"
  | "healing"
  | "settings"
  | "youtube"
  | "videoeditor";

interface NavBarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  {
    id: "generator" as Page,
    label: "Studio",
    icon: Zap,
    description: "Subliminal Generator",
  },
  {
    id: "energy" as Page,
    label: "Energy Library",
    icon: BookOpen,
    description: "Chakras & Consciousness",
  },
  {
    id: "kinesis" as Page,
    label: "Kinesis Archive",
    icon: Archive,
    description: "Encyclopedia of Powers",
  },
  {
    id: "wiki" as Page,
    label: "Wiki Search",
    icon: Search,
    description: "Fandom Character & Powers Search",
  },
  {
    id: "religions" as Page,
    label: "Religions",
    icon: Globe,
    description: "World Religions Encyclopedia",
  },
  {
    id: "entities" as Page,
    label: "Entities",
    icon: Ghost,
    description: "Spiritual Entities & Archetypes",
  },
  {
    id: "spells" as Page,
    label: "Spells",
    icon: Wand2,
    description: "Spells & Magical Traditions",
  },
  {
    id: "sigils" as Page,
    label: "Sigils",
    icon: Star,
    description: "Sigil Codex & Sacred Symbols",
  },
  {
    id: "rituals" as Page,
    label: "Rituals",
    icon: Moon,
    description: "Rituals & Sacred Systems",
  },
  {
    id: "healing" as Page,
    label: "Healing",
    icon: Heart,
    description: "Healing Methods & Modalities",
  },
  {
    id: "settings" as Page,
    label: "Settings",
    icon: Settings,
    description: "AI Configuration",
  },
  {
    id: "youtube" as Page,
    label: "YouTube",
    icon: Youtube,
    description: "Video Content Creator",
  },
  {
    id: "videoeditor" as Page,
    label: "Video Editor",
    icon: Film,
    description: "Frequency, TTS, Audio & Thumbnail",
  },
];

export default function NavBar({ currentPage, onNavigate }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
              <div className="relative">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center glow-primary">
                  <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent pulse-glow" />
              </div>
              <div className="min-w-0">
                <span className="font-heading font-bold text-sm sm:text-base tracking-tight gradient-text block truncate">
                  SYNAPSE STUDIO
                </span>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-none tracking-widest uppercase hidden xs:block">
                  Subliminal AI
                </p>
              </div>
            </div>

            {/* Desktop Navigation — hidden below md */}
            <nav
              className="hidden md:flex items-center gap-0.5 overflow-x-auto scrollbar-hide"
              aria-label="Main navigation"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`relative flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 whitespace-nowrap
                      ${
                        isActive
                          ? "text-primary bg-primary/10 border border-primary/30"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden lg:inline">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                        style={{ background: "oklch(0.62 0.22 295)" }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Mobile hamburger button — shown below md */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-border/40 bg-secondary/20 hover:bg-secondary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 shrink-0"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[85vw] bg-background border-l border-border/60 shadow-2xl flex flex-col md:hidden"
              aria-label="Mobile navigation"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <span className="font-heading font-bold text-sm gradient-text">
                    SYNAPSE STUDIO
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-secondary/40 transition-colors"
                  aria-label="Close navigation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav items */}
              <div className="flex-1 overflow-y-auto py-3 px-3">
                {navItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 min-h-[52px]
                        ${
                          isActive
                            ? "bg-primary/15 border border-primary/30 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                        }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive ? "bg-primary/20" : "bg-secondary/50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-heading font-semibold text-sm">
                          {item.label}
                        </p>
                        <p className="text-[11px] text-muted-foreground/70 truncate">
                          {item.description}
                        </p>
                      </div>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Drawer footer */}
              <div className="px-5 py-4 border-t border-border/40">
                <p className="text-[10px] text-muted-foreground/50 text-center tracking-widest uppercase">
                  Subliminal AI System
                </p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
