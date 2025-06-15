
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { BarChart2 } from 'lucide-react';

interface TypeData {
    name: string;
    value: number;
}

interface SecurityTypeChartProps {
    data: TypeData[];
}

export const SecurityTypeChart = ({ data }: SecurityTypeChartProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2"><BarChart2 className="w-5 h-5" />Alertas por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 12 }} />
                        <Tooltip cursor={{fill: 'rgba(240, 240, 240, 0.5)'}}/>
                        <Bar dataKey="value" name="Cantidad" fill="#3b82f6" barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
