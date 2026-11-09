import Link from "next/link";
import Image from "next/image";
import { aboutData } from "./aboutData";
import TechStackSection, { StackCard } from "./TechStackSection";
import AboutTabs from "./AboutTabs";

const BIO_LINKS = [
  { text: "Forward Deployed Engineer", href: "/experience", external: false },
  { text: "Give Protocol", href: "/projects", external: false },
  {
    text: "LinkedIn",
    href: "https://www.linkedin.com/in/eddy-limfy/",
    external: true,
  },
  { text: "contact page", href: "/contact", external: false },
];

export default function About() {
  const { profile, techStack, spokenLanguages } = aboutData;

  // Helper to process bio text with links
  const renderBio = (bio) => {
    // Sort by length descending to ensure longest matches first
    const sortedLinks = [...BIO_LINKS].sort(
      (a, b) => b.text.length - a.text.length
    );
    const pattern = new RegExp(
      `(${sortedLinks
        .map((l) => l.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|")})`,
      "g"
    );

    return bio.split("\n\n").map((paragraph, index) => {
      const parts = paragraph.split(pattern);

      return (
        <p
          key={index}
          className="text-base md:text-[17px] text-left text-gray-300 leading-7 md:leading-8 font-sans first:text-gray-100 first:text-center"
        >
          {parts.map((part, i) => {
            const link = BIO_LINKS.find((l) => l.text === part);
            if (link) {
              return (
                <Link
                  key={i}
                  href={link.href}
                  className="text-neon-green underline decoration-neon-green/30 underline-offset-4 hover:decoration-neon-green transition-colors"
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                >
                  {part}
                </Link>
              );
            }
            return <span key={i}>{part}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <section className="min-h-screen w-full bg-linear-to-b from-black/50 to-neon-green/10 text-gray-200 font-sans pb-12">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        {/* Page Header */}
        <div className="flex items-end gap-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-mono text-white">
            About<span className="text-neon-green">_</span>
          </h1>
          <div className="h-px flex-1 bg-linear-to-r from-neon-green/50 to-transparent mb-4"></div>
        </div>

        {/* 1. Who: photo + name */}
        <div className="pt-8 mb-8 flex flex-col items-center text-center gap-5">
          <div className="w-48 h-48 rounded-full border-2 border-neon-green overflow-hidden shadow-[0_0_20px_rgba(0,255,157,0.2)] bg-zinc-900 relative">
            <Image
              src={profile.avatar}
              alt={profile.name}
              fill
              className="object-cover scale-[1.25] translate-y-[11%]" /* ~20% crop, nudged down to centre the face (max 12.5% before edge shows) */
              sizes="192px"
            />
          </div>
          <div>
            <h2 className="text-4xl font-bold font-sans text-white mb-1">
              {profile.name}
            </h2>
            <h3 className="text-xl text-neon-green font-mono">
              {profile.role}
            </h3>
          </div>
        </div>

        <AboutTabs
          story={
            <div className="max-w-4xl mx-auto space-y-5">
              {renderBio(profile.bio)}
            </div>
          }
          skills={
            <div className="grid gap-6">
              <Panel title="Tech Stack">
                <TechStackSection columns={techStack} />
              </Panel>
              <Panel title="Language Stack">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 lg:gap-6">
                  {spokenLanguages.map((item) => (
                    <StackCard key={item.name} item={item} color="#4FC08D" />
                  ))}
                </div>
              </Panel>
            </div>
          }
        />
      </div>
    </section>
  );
}


function Panel({ title, children }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm p-5 md:p-7">
      <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-neon-green mb-6">
        {title}
      </h3>
      {children}
    </div>
  );
}
