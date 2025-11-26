import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/Navbar";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "Eddy Lim | Tech Generalist",
  description:
    "Welcome to the portfolio of Eddy, who builds for the decentralized future.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
    >
      <body className="antialiased text-[#e0e0e0]">
        <div className="fixed inset-0 bg-black/50 -z-10" />
        <Navbar />
        <main className="min-h-screen pt-20">{children}</main>
      </body>
    </html>
  );
}
