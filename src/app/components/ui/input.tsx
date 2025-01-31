import * as React from "react"
import styled from 'styled-components';

import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const SoftUIInput = styled.input`
 background: #e9e9e9;
    border-radius: 12px;
    box-shadow: inset 2px 2px 2px #bebebe, inset -2px -2px 11px #ffffff;
    padding: 10px 20px;
    font-size: 16px;
    margin: 10px 0px 30px;
    color: #333;
    width: 100%;
    border: 1px solid #b7b7b7;
    outline: none;
    transition: all 0.3s ease;

  &:focus {
    box-shadow: inset 2px 2px 2px #bebebe, inset -2px -2px 11px #ffffff;
  }
`;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type, ...props }, ref) => {
    return (
      <SoftUIInput
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

export default SoftUIInput;