import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="fixed inset-0 w-full bg-linear-to-b from-black/50 to-blue-900/20 text-white font-sans overflow-hidden flex flex-col pt-[30vh]">
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#444 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* Content */}
      <div className="z-30 text-center space-y-8 px-6 relative -mt-20">
        <h1 className="text-6xl md:text-8xl font-bold font-mono text-blue-400 opacity-50">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed">
          The page you're looking for is at least{" "}
          <span className="text-blue-400 font-mono whitespace-nowrap">
            one quadrillion lightyears
          </span>{" "}
          away.
          <br />
          You can enjoy the cosmic view for a bit, or beam yourself back home.
        </h2>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 border border-blue-400/30 hover:border-blue-400 text-blue-400 hover:text-white hover:bg-blue-400/10 rounded-full transition-all duration-300 font-mono text-sm uppercase tracking-widest"
        >
          <span>Redirect to Home instead?</span>
        </Link>
      </div>

      {/* Humanoid Image (Fixed Bottom) */}
      <div className="fixed bottom-[-20vh] left-0 w-full z-10 pointer-events-none flex items-end justify-center">
        <div className="relative w-full max-w-8xl h-screen">
          <Image
            src="/humanoid.svg"
            alt="AI Humanoid"
            fill
            className="object-bottom object-contain opacity-80 drop-shadow-[0_0_50px_rgba(96,165,250,0.15)]"
            priority
          />
        </div>
      </div>
    </div>
  );
}
