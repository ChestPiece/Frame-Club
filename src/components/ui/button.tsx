import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap border transition-colors outline-none select-none focus-visible:border-brand-bright disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        brand: "border-brand bg-brand text-text-primary hover:bg-brand-mid",
        outline: "border-border bg-transparent text-text-primary hover:bg-bg-elevated",
        muted: "border-border bg-bg-deep text-text-muted hover:text-text-primary",
        ghost: "border-transparent bg-transparent text-text-muted hover:text-text-primary",
      },
      size: {
        sm: "px-3 py-2 text-[10px]",
        default: "px-4 py-3 text-xs",
        lg: "px-5 py-4 text-sm",
        xl: "px-6 py-4 text-xl",
        "icon-sm": "size-7 border-transparent p-0",
        icon: "size-8 border-transparent p-0",
      },
    },
    defaultVariants: {
      variant: "brand",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "brand",
  size = "default",
  render,
  nativeButton,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      render={render}
      nativeButton={render ? false : nativeButton}
      {...props}
    />
  )
}

export { Button, buttonVariants }
