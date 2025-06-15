
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { BarChart2 } from 'lucide-react';

const COLORS: { [key: string]: string } = {
    'critical': '#EF4444',
    'emergency': '#DC2626',
    'warning': '#F97316',
    'info': '#3B82F6',
};
const DEFAULT_COLOR = '#6B7280';

interface PriorityData {
    name: string;
    value: number;
}

interface SecurityPriorityChartProps {
    data: PriorityData[];
}

export const SecurityPriorityChart = ({ data }: SecurityPriorityChartProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2"><BarChart2 className="w-5 h-5" />Alertas por Prioridad</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {data.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || DEFAULT_COLOR} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
