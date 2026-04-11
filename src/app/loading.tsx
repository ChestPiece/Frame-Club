export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-bg-base">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin border-t-2 border-brand-mid" />
        <p className="technical-label text-[10px] text-text-muted">INITIALIZING MODULE...</p>
      </div>
    </div>
  );
}