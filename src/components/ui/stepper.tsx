
import * as React from "react";
import { cn } from "@/lib/utils";

interface StepperContext {
  value: number;
  count: number;
  onChange?: (value: number) => void;
}

const StepperContext = React.createContext<StepperContext>({
  value: 0,
  count: 0,
  onChange: undefined,
});

interface StepperProps {
  value: number;
  onValueChange?: (value: number) => void;
  children: React.ReactNode;
  className?: string;
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ value, onValueChange, className, children, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const count = childArray.length;

    return (
      <StepperContext.Provider
        value={{ value, count, onChange: onValueChange }}
      >
        <div
          ref={ref}
          className={cn("flex gap-2 justify-between", className)}
          {...props}
        >
          {children}
        </div>
      </StepperContext.Provider>
    );
  }
);

Stepper.displayName = "Stepper";

interface StepProps {
  index?: number;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

const Step = React.forwardRef<HTMLDivElement, StepProps>(
  ({ index, title, className, children, ...props }, ref) => {
    const { value, count, onChange } = React.useContext(StepperContext);

    // Calculamos el índice basado en la posición en el childArray
    const realIndex = index !== undefined ? index : React.Children.count(React.Children.toArray(children));
    const isActive = value === realIndex;
    const isCompleted = value > realIndex;

    const handleClick = () => {
      if (onChange) {
        onChange(realIndex);
      }
    };

    const renderBar = (position: "left" | "right") => {
      if ((position === "left" && realIndex === 0) || 
          (position === "right" && realIndex === count - 1)) {
        return null;
      }

      const isBarActive = position === "left" ? 
        value > realIndex : value > realIndex + 1;

      return (
        <div 
          className={cn(
            "h-1 flex-1", 
            isBarActive ? "bg-blue-500" : "bg-gray-200"
          )}
        />
      );
    };

    return (
      <div 
        ref={ref}
        className={cn("flex-1 flex flex-col", className)}
        {...props}
      >
        <div className="flex items-center mb-2">
          {renderBar("left")}
          <div 
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors cursor-pointer",
              isActive && "bg-blue-500 text-white",
              isCompleted && "bg-green-500 text-white",
              !isActive && !isCompleted && "bg-gray-200 text-gray-700"
            )}
            onClick={handleClick}
          >
            {isCompleted ? "✓" : realIndex + 1}
          </div>
          {renderBar("right")}
        </div>
        {title && (
          <div 
            className={cn(
              "text-xs text-center transition-colors",
              isActive && "text-blue-600 font-medium",
              isCompleted && "text-green-600",
              !isActive && !isCompleted && "text-gray-500"
            )}
          >
            {title}
          </div>
        )}
      </div>
    );
  }
);

Step.displayName = "Step";

export { Stepper, Step };
