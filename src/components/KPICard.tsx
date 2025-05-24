
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
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'negative':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'neutral':
        return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/20 dark:text-zinc-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <Card className={cn("relative overflow-hidden border-0", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {title}
        </CardTitle>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900/30 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          {value}
        </div>
        <div className="flex items-center justify-between">
          {description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
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
