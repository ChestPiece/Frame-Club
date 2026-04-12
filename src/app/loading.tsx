// Minimal placeholder — the SiteLoader in layout.tsx handles the cinematic
// first-visit experience. This file only shows during Suspense on subsequent
// navigations where server data is still fetching.
export default function Loading() {
  return (
    <div className="fixed inset-0 bg-bg-base z-10" aria-hidden="true" />
  );
}

