
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: `
          bg-rgb(224 224 224)
          border-1 
          color- orange
          text-[#2d3436]
          shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff]
          hover:shadow-[8px_8px_16px_#b8b9be,-8px_-8px_16px_#ffffff]
          active:shadow-[inset_6px_6px_12px_#b8b9be,inset_-6px_-6px_12px_#ffffff]
          active:transform active:scale-96
        `,
        primary: `
          bg-rgb(224 224 224)
          border-1
          text-orange-500
          shadow-[6px_6px_12px_#5573c9,-6px_-6px_12px_#7499fd]
          hover:shadow-[8px_8px_16px_#5573c9,-8px_-8px_16px_#7499fd]
          active:shadow-[inset_6px_6px_12px_#5573c9,inset_-6px_-6px_12px_#7499fd]
          active:transform active:scale-96
        `,
        outline: `
          border-1
          color- orange
          border-[#e0e5ec]
          bg-rgb(224 224 224)
          shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff]
          hover:shadow-[8px_8px_16px_#b8b9be,-8px_-8px_16px_#ffffff]
          active:shadow-[inset_6px_6px_12px_#b8b9be,inset_-6px_-6px_12px_#ffffff]
          active:transform active:scale-95
        `,
        ghost: `
          bg-transparent
          hover:bg-[#e0e5ec]
          hover:shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff]
          active:shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff]
          active:transform active:scale-95
        `,
        link: "underline-offset-4 hover:underline text-primary"
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4 py-2",
        lg: "h-14 px-8 py-4",
        icon: "h-12 w-12"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      border: "10px solidrgb(255, 0, 0)",
      backgroundColor: "#e0e0e0",
      color: "#000000",
      fontSize: "medium"
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }