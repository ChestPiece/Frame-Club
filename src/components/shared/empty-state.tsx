import Link from "next/link";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  label?: string;
  title: string;
  description: string;
  cta?: {
    label: string;
    href: string;
  };
};

export function EmptyState({ label, title, description, cta }: EmptyStateProps) {
  return (
    <div className="border border-border bg-bg-surface p-12 text-center">
      {label ? <p className="technical-label">{label}</p> : null}
      <p className="display-kicker mt-4 text-3xl">{title}</p>
      <p className="mt-4 text-sm text-text-muted">{description}</p>
      {cta ? (
        <Button render={<Link href={cta.href} />} variant="outline" className="mt-6 display-kicker">
          {cta.label}
        </Button>
      ) : null}
    </div>
  );
}
