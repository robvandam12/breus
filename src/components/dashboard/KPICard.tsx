
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
    <Card className="ios-card h-full border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-2 sm:p-3">
        <CardTitle className="text-xs font-medium text-zinc-600 truncate flex-1 leading-tight">
          {title}
        </CardTitle>
        <div className="flex items-center gap-1 ml-1">
          {badge && (
            <Badge variant={badge.variant} className="text-xs px-1 py-0 h-4">
              {badge.text}
            </Badge>
          )}
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-cyan-100 rounded-md flex items-center justify-center flex-shrink-0">
            <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-600" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-3 pt-0">
        <div className="text-lg sm:text-xl font-bold text-zinc-900 mb-0.5 leading-none">{value}</div>
        {description && (
          <p className="text-xs text-zinc-500 mb-0.5 truncate leading-tight">{description}</p>
        )}
        {trend && (
          <div className="flex items-center">
            <span className={`text-xs font-medium ${
              trend.isPositive ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-zinc-500 ml-1 hidden sm:inline leading-tight">vs mes anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
