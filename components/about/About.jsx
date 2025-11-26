import Link from "next/link";
import Image from "next/image";
import { aboutData } from "./aboutData";
import ScrollToStackButton from "./ScrollToStackButton";
import TechStackSection from "./TechStackSection";

const BIO_LINKS = [
  {
    text: "Give Protocol",
    href: "https://www.linkedin.com/company/give-protocol",
    external: true,
  },
  {
    text: "Scroll Open Campus Season 2",
    href: "https://openeconomy.xyz/",
    external: true,
  },
  {
    text: "Blockchain For Good Alliance (BGA)",
    href: "https://chainforgood.org/",
    external: true,
  },
  { text: "experience section", href: "/experience", external: false },
  { text: "contact page", href: "/contact", external: false },
];

export default function About() {
  const { profile, columns } = aboutData;

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
          className="text-base text-justify text-gray-400 leading-relaxed font-sans mb-3 last:mb-0 mx-auto md:mx-0"
        >
          {parts.map((part, i) => {
            const link = BIO_LINKS.find((l) => l.text === part);
            if (link) {
              return (
                <Link
                  key={i}
                  href={link.href}
                  className="text-neon-green hover:underline"
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

        {/* Header Section: Compact & Professional */}
        <div className="pt-8 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-10 gap-y-8 items-start mb-16">
          {/* Profile Picture */}
          <div className="flex justify-center md:justify-start shrink-0">
            <div className="w-40 h-40 rounded-full border-2 border-neon-green overflow-hidden shadow-[0_0_20px_rgba(0,255,157,0.2)] bg-zinc-900 relative">
              <Image
                src={profile.avatar}
                alt={profile.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 160px, 160px"
              />
            </div>
          </div>

          {/* Bio Text */}
          <div className="space-y-4 text-center md:text-left pr-6">
            <div>
              <h2 className="text-4xl font-bold font-sans text-white mb-1">
                {profile.name}
              </h2>
              <h3 className="text-xl text-neon-green font-mono">
                {profile.role}
              </h3>
            </div>
            <div className="space-y-3">{renderBio(profile.bio)}</div>

            {/* Separator & Scroll Button */}
            <div className="flex items-center gap-4 mt-12">
              <div className="h-px flex-1 bg-linear-to-r from-neon-green/50 to-transparent"></div>
              <ScrollToStackButton />
              <div className="h-px flex-1 bg-linear-to-l from-neon-green/50 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Stacks Section: 5 Columns */}
        <TechStackSection columns={columns} />
      </div>
    </section>
  );
}
