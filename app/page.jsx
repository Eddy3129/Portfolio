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
      className="min-h-screen flex items-center justify-center overflow-hidden relative pb-[8vh]"
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#333 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 items-center z-10 relative">
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
        </div>

        {/* 3D TECH STACK (Hidden on mobile) */}
        <div className="hidden lg:block w-full h-full">
          <TechStack />
        </div>
      </div>
    </section>
  );
}