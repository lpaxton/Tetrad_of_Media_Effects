"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "../../lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className = "", ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full bg-[#e0e5ec] transition-all duration-300",
      "shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-[#e0e5ec] data-[state=unchecked]:bg-[#e0e5ec]",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-7 w-7 rounded-full bg-white transition-all duration-300",
        "shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff]",
        "data-[state=checked]:translate-x-9 data-[state=unchecked]:translate-x-0",
        "data-[state=checked]:bg-orange-500"
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };