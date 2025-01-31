import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import styled from 'styled-components';

import { cn } from "../../lib/utils"

const SoftUISlider = styled.input.attrs({ type: 'range' })`
  -webkit-appearance: none;
  width: 100%;
  height: 12px;
  background: #e0e0e0;
  border-radius: 12px;
  box-shadow: inset 8px 8px 16px #bebebe, inset -8px -8px 16px #ffffff;
  outline: none;
  padding: 0;
  margin: 20px 0px;
  transition: all 0.3s ease;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    background: #e0e0e0;
    border-radius: 50%;
    box-shadow: 8px 8px 16px #bebebe, -8px -8px 16px #ffffff;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    background: #e0e0e0;
    border-radius: 50%;
    box-shadow: 8px 8px 16px #bebebe, -8px -8px 16px #ffffff;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  &:active::-webkit-slider-thumb {
    box-shadow: 4px 4px 8px #bebebe, -4px -4px 8px #ffffff;
  }

  &:active::-moz-range-thumb {
    box-shadow: 4px 4px 8px #bebebe, -4px -4px 8px #ffffff;
  }
`;

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className = "", ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
export default SoftUISlider;