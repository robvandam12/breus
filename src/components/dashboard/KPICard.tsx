
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  badge?: {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  };
}

export const KPICard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  badge 
}: KPICardProps) => {
  return (
    <Card className="ios-card h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-3 sm:p-4 sm:pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-zinc-600 truncate flex-1">
          {title}
        </CardTitle>
        <div className="flex items-center gap-1 sm:gap-2 ml-2">
          {badge && (
            <Badge variant={badge.variant} className="text-xs px-1 py-0">
              {badge.text}
            </Badge>
          )}
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-600" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 pt-0">
        <div className="text-xl sm:text-2xl font-bold text-zinc-900 mb-1">{value}</div>
        {description && (
          <p className="text-xs text-zinc-500 mb-1 truncate">{description}</p>
        )}
        {trend && (
          <div className="flex items-center">
            <span className={`text-xs font-medium ${
              trend.isPositive ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-zinc-500 ml-1 hidden sm:inline">vs mes anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
