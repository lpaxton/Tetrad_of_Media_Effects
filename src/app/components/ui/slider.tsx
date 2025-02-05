import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "../../lib/utils"
import styled from 'styled-components'

const StyledSliderRoot = styled(SliderPrimitive.Root)`
  position: relative;
  display: flex;
  align-items: center;
  user-select: none;
  touch-action: none;
  width: 100%;
  height: 24px;
  padding: 0 12px;
  
  &:focus-within {
    outline: none;
  }
`;

const StyledSliderTrack = styled(SliderPrimitive.Track)`
  position: relative;
  flex-grow: 1;
  height: 10px;
  background: #e0e5ec;
  border-radius: 5px;
  box-shadow: inset 2px 2px 5px #b8b9be,
              inset -2px -2px 5px #ffffff;
`;

const StyledSliderRange = styled(SliderPrimitive.Range)`
  position: absolute;
  height: 100%;
  background: linear-gradient(145deg, #6486e3, #7691e8);
  border-radius: 5px;
  box-shadow: 2px 2px 4px rgba(100, 134, 227, 0.2),
              -2px -2px 4px rgba(118, 145, 232, 0.2);
`;

const StyledSliderThumb = styled(SliderPrimitive.Thumb)`
  all: unset;
  position: relative;
  display: block;
  width: 24px;
  height: 24px;
  background: #e0e5ec;
  border-radius: 12px;
  box-shadow: 3px 3px 6px #b8b9be,
              -3px -3px 6px #ffffff,
              inset -1px -1px 2px #b8b9be,
              inset 1px 1px 2px #ffffff;
  transition: all 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    background: linear-gradient(145deg, #6486e3, #7691e8);
    border-radius: 50%;
    box-shadow: 1px 1px 2px rgba(100, 134, 227, 0.3),
                -1px -1px 2px rgba(118, 145, 232, 0.3);
  }

  &:hover {
    transform: scale(1.1);
    box-shadow: 4px 4px 8px #b8b9be,
                -4px -4px 8px #ffffff,
                inset -1px -1px 2px #b8b9be,
                inset 1px 1px 2px #ffffff;
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 2px 2px 4px #b8b9be,
                -2px -2px 4px #ffffff,
                inset -2px -2px 4px #ffffff,
                inset 2px 2px 4px #b8b9be;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(100, 134, 227, 0.2),
                4px 4px 8px #b8b9be,
                -4px -4px 8px #ffffff,
                inset -1px -1px 2px #b8b9be,
                inset 1px 1px 2px #ffffff;
  }
`;

// CSS Variables for theme configuration
const GlobalStyle = styled.div`
  --slider-bg: #e0e5ec;
  --slider-shadow-dark: #b8b9be;
  --slider-shadow-light: #ffffff;
  --slider-primary: #6486e3;
  --slider-primary-light: #7691e8;
`;

const SoftUISlider = React.forwardRef<
  React.ElementRef<typeof StyledSliderRoot>,
  React.ComponentPropsWithoutRef<typeof StyledSliderRoot>
>(({ className, ...props }, ref) => (
  <GlobalStyle>
    <StyledSliderRoot
      ref={ref}
      className={cn("soft-ui-slider", className)}
      {...props}
    >
      <StyledSliderTrack>
        <StyledSliderRange />
      </StyledSliderTrack>
      <StyledSliderThumb />
    </StyledSliderRoot>
  </GlobalStyle>
))

SoftUISlider.displayName = "SoftUISlider"

export { SoftUISlider as Slider }