// Minimal route-level fallback while server components stream.
export default function Loading() {
  return (
    <div className="fixed inset-0 bg-bg-base z-10" aria-hidden="true" />
  );
}

