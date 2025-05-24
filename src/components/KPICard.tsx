
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function KPICard({ title, value, change, description, icon, className }: KPICardProps) {
  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'negative':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'neutral':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400';
    }
  };

  return (
    <Card className={cn("relative overflow-hidden border-0 ios-card", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {title}
        </CardTitle>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-300">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          {value}
        </div>
        <div className="flex items-center justify-between">
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
          {change && (
            <Badge
              variant="secondary"
              className={cn(
                "text-xs font-medium px-2 py-1 rounded-lg border-0",
                getChangeColor(change.type)
              )}
            >
              {change.value}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
