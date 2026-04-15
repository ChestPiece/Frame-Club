'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center bg-bg-base p-6 text-center">
      <div className="max-w-md border border-brand-mid/40 bg-bg-deep p-10">
        <h2 className="display-kicker text-3xl text-brand-mid">SYSTEM FAULT</h2>
        <p className="mt-4 text-xs uppercase tracking-widest text-text-muted">
          A critical error has occurred in the module.
        </p>
        <p className="mt-2 text-[10px] text-text-muted">
          {error.message || "Unknown anomaly"}
        </p>
        <Button
          onClick={() => reset()}
          variant="outline"
          className="display-kicker mt-8 w-full"
        >
          REBOOT SEQUENCE
        </Button>
      </div>
    </div>
  )
}