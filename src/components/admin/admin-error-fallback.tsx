type AdminErrorFallbackProps = {
  message: string;
};

export function AdminErrorFallback({ message }: AdminErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="border border-border bg-bg-surface p-10 text-center">
        <p className="display-kicker text-2xl text-text-primary">{message}</p>
        <p className="mt-3 text-sm text-text-muted">Check your Supabase connection and refresh the page.</p>
      </div>
    </div>
  );
}
