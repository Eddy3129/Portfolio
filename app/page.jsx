import Link from "next/link";
import TypingHero from "../components/home/TypingHero";
import TechStack from "../components/home/TechStack";

const HERO_TEXT = "Web 3 Developer, Full-stack Engineer & Degen.";

const HERO_LINKS = [
  {
    text: "View_Portfolio",
    href: "/experience",
    className:
      "px-8 py-4 bg-neon-green text-black font-bold rounded hover:bg-white transition-colors",
  },
  {
    text: "Contact_Me",
    href: "/contact",
    className:
      "px-8 py-4 border border-white/20 hover:border-white text-white rounded transition-colors",
  },
];

export default function Home() {
  return (
    <section
      id="about"
      className="max-h-screen flex items-start justify-center overflow-hidden pt-12"
    >
      <div
        className="opacity-10"
        style={{
          backgroundImage: "radial-gradient(#333 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 items-center">
        {/* Text Content */}
        <div>
          <TypingHero />
          <p className="text-2xl text-gray-400 mb-16 max-w-2xl font-light">
            {HERO_TEXT}
          </p>
          <div className="flex flex-wrap gap-4 font-mono">
            {HERO_LINKS.map((link) => (
              <Link key={link.text} href={link.href} className={link.className}>
                {link.text}
              </Link>
            ))}
          </div>

          {/* <div className="grid grid-cols-3 gap-8 mt-16 border-t border-white/10 pt-8">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-white font-mono">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div> */}
        </div>

        {/* 3D TECH STACK */}
        <TechStack />
      </div>
    </section>
  );
}
