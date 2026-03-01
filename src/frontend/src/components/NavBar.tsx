import { Archive, BookOpen, Brain, Zap } from "lucide-react";
import { motion } from "motion/react";

type Page = "generator" | "energy" | "kinesis";

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
];

export default function NavBar({ currentPage, onNavigate }: NavBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center glow-primary">
                <Brain className="w-4 h-4 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent pulse-glow" />
            </div>
            <div>
              <span className="font-heading font-bold text-base tracking-tight gradient-text">
                SYNAPSE STUDIO
              </span>
              <p className="text-[10px] text-muted-foreground leading-none tracking-widest uppercase">
                Subliminal AI
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                    ${
                      isActive
                        ? "text-primary bg-primary/10 border border-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
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
        </div>
      </div>
    </header>
  );
}
