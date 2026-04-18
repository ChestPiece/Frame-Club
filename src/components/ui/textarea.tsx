import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "machined-field min-h-28 resize-none leading-relaxed disabled:cursor-not-allowed disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
