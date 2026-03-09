import {
  Archive,
  BookMarked,
  BookOpen,
  Brain,
  Film,
  Ghost,
  Globe,
  Heart,
  Library,
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
  | "videoeditor"
  | "journal"
  | "vault";

interface NavBarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

interface NavItem {
  id: Page;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  group: string;
}

const navItems: NavItem[] = [
  // Core
  {
    id: "generator",
    label: "Studio",
    icon: Zap,
    description: "Subliminal Generator",
    group: "core",
  },
  {
    id: "journal",
    label: "Journal",
    icon: BookMarked,
    description: "Subliminal Session Log",
    group: "core",
  },
  {
    id: "vault",
    label: "Vault",
    icon: Library,
    description: "Saved Affirmations",
    group: "core",
  },
  // Discover
  {
    id: "energy",
    label: "Energy Library",
    icon: BookOpen,
    description: "Chakras & Consciousness",
    group: "discover",
  },
  {
    id: "kinesis",
    label: "Kinesis",
    icon: Archive,
    description: "Encyclopedia of Powers",
    group: "discover",
  },
  {
    id: "wiki",
    label: "Wiki Search",
    icon: Search,
    description: "Fandom Character & Powers Search",
    group: "discover",
  },
  // Spiritual
  {
    id: "religions",
    label: "Religions",
    icon: Globe,
    description: "World Religions Encyclopedia",
    group: "spiritual",
  },
  {
    id: "entities",
    label: "Entities",
    icon: Ghost,
    description: "Spiritual Entities & Archetypes",
    group: "spiritual",
  },
  {
    id: "spells",
    label: "Spells",
    icon: Wand2,
    description: "Spells & Magical Traditions",
    group: "spiritual",
  },
  {
    id: "sigils",
    label: "Sigils",
    icon: Star,
    description: "Sigil Codex & Sacred Symbols",
    group: "spiritual",
  },
  {
    id: "rituals",
    label: "Rituals",
    icon: Moon,
    description: "Rituals & Sacred Systems",
    group: "spiritual",
  },
  {
    id: "healing",
    label: "Healing",
    icon: Heart,
    description: "Healing Methods & Modalities",
    group: "spiritual",
  },
  // Create
  {
    id: "youtube",
    label: "YouTube",
    icon: Youtube,
    description: "Video Content Creator",
    group: "create",
  },
  {
    id: "videoeditor",
    label: "Video Editor",
    icon: Film,
    description: "Frequency, TTS, Audio & Thumbnail",
    group: "create",
  },
  // System
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    description: "AI Configuration",
    group: "system",
  },
];

const GROUP_LABELS: Record<string, string> = {
  core: "Core",
  discover: "Discover",
  spiritual: "Spiritual",
  create: "Create",
  system: "System",
};

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
                    className={`nav-pill relative flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 whitespace-nowrap
                      ${
                        isActive
                          ? "nav-pill-active bg-primary/15 border border-primary/30 text-primary"
                          : "text-muted-foreground border border-transparent hover:text-foreground hover:bg-muted/50"
                      }`}
                    aria-current={isActive ? "page" : undefined}
                    data-ocid={`nav.${item.id}.link`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden lg:inline">{item.label}</span>
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
              data-ocid="nav.menu.button"
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
                  data-ocid="nav.close.button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav items grouped */}
              <div className="flex-1 overflow-y-auto py-3 px-3">
                {Object.entries(GROUP_LABELS).map(([group, groupLabel]) => {
                  const groupItems = navItems.filter(
                    (item) => item.group === group,
                  );
                  if (groupItems.length === 0) return null;
                  return (
                    <div key={group} className="mb-2">
                      <p className="px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/40">
                        {groupLabel}
                      </p>
                      {groupItems.map((item, idx) => {
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
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-0.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 min-h-[48px]
                              ${
                                isActive
                                  ? "bg-primary/15 border border-primary/30 text-primary"
                                  : "text-muted-foreground border border-transparent hover:text-foreground hover:bg-secondary/40"
                              }`}
                            aria-current={isActive ? "page" : undefined}
                            data-ocid={`nav.${item.id}.link`}
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
                              <p className="text-[10px] text-muted-foreground/60 truncate">
                                {item.description}
                              </p>
                            </div>
                            {isActive && (
                              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            )}
                          </motion.button>
                        );
                      })}
                      <div className="h-px bg-border/20 mx-4 mt-1 mb-2 last:hidden" />
                    </div>
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
