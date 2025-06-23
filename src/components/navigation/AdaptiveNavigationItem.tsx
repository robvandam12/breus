
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AdaptiveNavigationItemProps {
  title: string;
  icon: LucideIcon;
  path: string;
  isActive: boolean;
  isModuleRequired?: boolean;
  moduleActive?: boolean;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
}

export const AdaptiveNavigationItem = ({
  title,
  icon: Icon,
  path,
  isActive,
  isModuleRequired = false,
  moduleActive = true,
  badge,
  badgeVariant = "default",
  onClick,
  disabled = false,
  tooltip,
}: AdaptiveNavigationItemProps) => {
  const isDisabled = disabled || (isModuleRequired && !moduleActive);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start rounded-2xl px-6 py-4 mb-2 transition-all duration-200",
          "bg-gray-50 hover:bg-blue-50 text-gray-700 font-medium text-sm",
          "hover:text-blue-700 group",
          isActive && "bg-blue-100 text-blue-700",
          isDisabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={onClick}
        disabled={isDisabled}
        title={tooltip}
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
            <Icon className="w-5 h-5 transition-colors duration-200 group-hover:text-blue-600" />
          </div>
          <span className="truncate transition-colors duration-200 group-hover:text-blue-700">
            {title}
          </span>
          
          {/* Badges */}
          <div className="flex items-center gap-2 ml-auto">
            {badge && (
              <Badge variant={badgeVariant} className="text-xs">
                {badge}
              </Badge>
            )}
            
            {isModuleRequired && !moduleActive && (
              <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                Módulo
              </Badge>
            )}
          </div>
        </div>
      </Button>
    </div>
  );
};
