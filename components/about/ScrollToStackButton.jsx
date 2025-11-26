import { CaretDoubleDownIcon } from "../PhosphorIcons";

export default function ScrollToStackButton() {
  return (
    <a
      href="#tech-stack-section"
      className="p-3 rounded-full border border-neon-green/30 text-neon-green hover:bg-neon-green/10 hover:border-neon-green transition-all duration-300 animate-bounce cursor-pointer inline-flex items-center justify-center"
      aria-label="Scroll to Tech Stack"
    >
      <CaretDoubleDownIcon size={20} />
    </a>
  );
}
