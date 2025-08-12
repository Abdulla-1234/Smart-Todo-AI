import { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinkBase = "px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary hover:text-secondary-foreground transition-colors";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gradient-primary text-primary-foreground shadow-elevated">
              <CheckSquare className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold">Smart Todo AI</span>
          </Link>

          <nav className="flex items-center gap-1">
            <NavLink to="/" className={({isActive}) => `${navLinkBase} ${isActive ? 'bg-secondary' : ''}`}>Dashboard</NavLink>
            <NavLink to="/tasks" className={({isActive}) => `${navLinkBase} ${isActive ? 'bg-secondary' : ''}`}>Tasks</NavLink>
            <NavLink to="/context" className={({isActive}) => `${navLinkBase} ${isActive ? 'bg-secondary' : ''}`}>Context</NavLink>
          </nav>

          <div className="hidden sm:flex items-center gap-2">
            <Button variant="soft" asChild>
              <a href="#quick-add">Quick Add</a>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/tasks">Open Tasks</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Ambient soft gradient */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-soft" />
        <div className="container py-8">{children}</div>
      </main>

      <footer className="border-t">
        <div className="container py-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Smart Todo AI
        </div>
      </footer>
    </div>
  );
}
