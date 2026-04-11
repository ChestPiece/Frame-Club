import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "machined-field disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
}

export { Input }
