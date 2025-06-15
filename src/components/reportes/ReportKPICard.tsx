
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReportKPICardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color?: string;
}

export const ReportKPICard = ({ title, value, icon: Icon, color }: ReportKPICardProps) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={`h-4 w-4 text-muted-foreground`} />
        </CardHeader>
        <CardContent>
            <div className={`text-2xl font-bold ${color || 'text-primary'}`}>{value}</div>
        </CardContent>
    </Card>
);
