export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-white/10 border-t-neon-green rounded-full animate-spin"></div>
        <p className="text-neon-green font-mono text-sm animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
