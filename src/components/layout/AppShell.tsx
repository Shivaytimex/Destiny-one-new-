import Link from "next/link";
import { useRouter } from "next/router";
import { Bell, Gift, Heart, Sparkles } from "lucide-react";
import { primaryRoutes } from "../../utils/routes";
import type { ReactNode } from "react";

type AppShellProps = { children: ReactNode; title: string; eyebrow?: string; actions?: ReactNode; hideHeader?: boolean };

export default function AppShell({ children, title, eyebrow, actions, hideHeader = false }: AppShellProps) {
  const router = useRouter();
  const isActive = (href) =>
    href === "/" ? router.pathname === "/" : router.pathname.startsWith(href);

  return (
    <div className="app-shell min-h-screen bg-destiny-background text-destiny-ink">
      <main className="main-content">
        {!hideHeader && <header className="page-header">
          <div>
            <Link className="destiny-wordmark" href="/" aria-label="DestinyOne home">
              <span className="destiny-mark"><Heart size={18} fill="currentColor" /></span>
              <strong>DESTINY<span>ONE</span></strong>
            </Link>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1>{title}</h1>
          </div>
          <div className="header-actions">
            <Link className="icon-button" href="/notifications" aria-label="Notifications">
              <Bell size={21} />
              <span className="notification-dot">3</span>
            </Link>
            <Link className="header-gift-button" href="/gifts" aria-label="Open romantic gifts"><Gift size={19} /><span>Gift</span></Link>
            {actions}
            <Link className="avatar-button" href="/profile" aria-label="Open profile">S</Link>
          </div>
        </header>}
        {children}
      </main>

      <nav className="bottom-nav destiny-dock" aria-label="Primary navigation">
        {primaryRoutes.map(({ href, label, icon: Icon }) => (
          <Link className={isActive(href) ? "bottom-link active" : "bottom-link"} href={href} key={href}>
            <span className="dock-icon"><Icon size={19} /></span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
