import Link from "next/link";
import { ArrowRight, CalendarDays, Gift, HeartHandshake, Lock, ShieldCheck, Sparkles } from "lucide-react";

const faces = [
  ["Maya", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&q=85"],
  ["Anika", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=180&q=85"],
  ["Priya", "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=180&q=85"],
  ["Sara", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=180&q=85"]
];

const ideas = [
  { title: "Future Plans", meta: "12 questions", href: "/blueprint", icon: CalendarDays },
  { title: "Deal Breakers", meta: "8 questions", href: "/readiness", icon: ShieldCheck },
  { title: "Fun & Vibes", meta: "10 questions", href: "/coach", icon: Sparkles }
];

export default function HomeDashboard() {
  return <>
    <section className="destiny-home-hero" aria-labelledby="home-curated-title">
      <span className="destiny-hero-spark" aria-hidden="true">✦</span>
      <div className="destiny-daily-count"><strong>5</strong><span>Introductions</span><small>curated for you</small></div>
      <div className="destiny-hero-copy">
        <p className="eyebrow">Curated around your future</p>
        <h2 id="home-curated-title">Chosen around your future.</h2>
        <p>Five thoughtful introductions. Clear intent before chemistry, with room for a real conversation.</p>
        <div className="destiny-face-row" aria-label="Today’s introductions">
          {faces.map(([name, src]) => <img key={name} src={src} alt={`${name} profile`} />)}
          <span>+1</span>
        </div>
      </div>
      <Link className="destiny-hero-link" href="/matches">See today&apos;s matches <ArrowRight size={18}/></Link>
    </section>

    <section className="destiny-ideas" aria-labelledby="ideas-title">
      <header><div><p className="eyebrow">Explore together</p><h2 id="ideas-title">Start better conversations</h2></div><Link href="/discovery">View all <ArrowRight size={16}/></Link></header>
      <div className="destiny-idea-grid">{ideas.map(({title,meta,href,icon:Icon}) => <Link href={href} key={title} className="destiny-idea-card"><span className="glossy-orb"><Icon size={19}/></span><strong>{title}</strong><small>{meta}</small><ArrowRight className="idea-arrow" size={16}/></Link>)}</div>
    </section>

    <Link href="/gifts" className="destiny-gift-entry">
      <span className="glossy-orb large"><Gift size={24}/></span>
      <span><small>Romantic gifts</small><strong>Send a beautiful surprise in four steps.</strong><em>Flowers, love notes, sweet treats and cozy date-night gifts—without exchanging addresses.</em></span>
      <span className="gift-arrow"><ArrowRight size={20}/></span>
    </Link>

    <section className="destiny-trust-strip" aria-label="DestinyOne standards">
      <article><span className="glossy-orb"><ShieldCheck size={18}/></span><div><strong>Verified & Safe</strong><small>Real people. Real intentions.</small></div></article>
      <article><span className="glossy-orb"><Sparkles size={18}/></span><div><strong>Curated Daily</strong><small>Quality over quantity.</small></div></article>
      <article><span className="glossy-orb"><Lock size={18}/></span><div><strong>Privacy First</strong><small>You are in control.</small></div></article>
      <article><span className="glossy-orb"><HeartHandshake size={18}/></span><div><strong>Made for Serious</strong><small>Connections with purpose.</small></div></article>
    </section>
  </>;
}
