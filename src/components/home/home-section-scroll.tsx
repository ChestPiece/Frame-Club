"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { scrollToCollectionSection } from "@/lib/animation/scroll-to-collection";

/** When landing on `/?section=collection`, scroll to the section then drop the query (no hash routing). */
export function HomeSectionScroll() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (pathname !== "/") return;
    if (searchParams.get("section") !== "collection") return;

    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        scrollToCollectionSection();
        router.replace("/", { scroll: false });
      });
    });

    return () => window.cancelAnimationFrame(id);
  }, [pathname, router, searchParams]);

  return null;
}
