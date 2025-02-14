import * as React from "react";
import { cn } from "../../lib/utils";

interface KnobProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  disabled?: boolean;
  size?: number;
}

export const Knob = React.forwardRef<HTMLDivElement, KnobProps>(
  ({ value, onChange, min = 0, max = 100, size = 100, className, disabled = false }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const startXRef = React.useRef<number>(0);
    const startValueRef = React.useRef<number>(0);
    const snapAngles = [-120, 0, 120];
    
    const snapValues = [min, (min + max) / 2, max];

    const handleMouseDown = (event: React.MouseEvent) => {
      if (disabled) return;
      event.preventDefault();
      setIsDragging(true);
      startXRef.current = event.clientX;
      startValueRef.current = value;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = React.useCallback(
      (event: MouseEvent) => {
        if (!isDragging) return;

        const deltaX = event.clientX - startXRef.current;
        const sensitivity = (max - min) / 150;

        let newValue = startValueRef.current + deltaX * sensitivity;
        newValue = Math.max(min, Math.min(max, newValue));

        onChange(newValue);
      },
      [isDragging, max, min, onChange]
    );

    const handleMouseUp = React.useCallback(() => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      
      // Snap to nearest preset value
      const closestSnap = snapValues.reduce((prev, curr) => 
        Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
      );
      
      onChange(closestSnap);
    }, [handleMouseMove, onChange, value, snapValues]);

    React.useEffect(() => {
      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      } else {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      }
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const rotation = snapAngles[snapValues.indexOf(value)] || 0;

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-full cursor-pointer select-none knob-primary",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
        
        {/* Guide Marks */}
        <div className="absolute w-1 h-4 bg-gray-500 top-0 left-1/2 -translate-x-1/2" style={{ transform: "rotate(-120deg) translate(-35px, -70px)", width: ".125rem", backgroundColor: "#b7b7b7" }} />
        <div className="absolute w-1 h-4 bg-gray-500 top-0 left-1/2 -translate-x-1/2" style={{ transform: "rotate(0deg) translate(-2px, -7px)", width: ".125rem", backgroundColor: "#b7b7b7" }} />
        <div className="absolute w-1 h-4 bg-gray-500 top-0 left-1/2 -translate-x-1/2" style={{ transform: "rotate(120deg) translate(35px, -70px)", width: ".125rem", backgroundColor: "#b7b7b7" }} />

        <div
          className="absolute inset-2 rounded-full border-2 bg-white shadow-lg cursor-grab active:cursor-grabbing"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute top-2 left-1/2 w-1 h-4 bg-gray-800 -translate-x-1/2" style={{ backgroundColor: "#e2c75f" }}/>
        </div>
      </div>
    );
  }
);

Knob.displayName = "Knob";