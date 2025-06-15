
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BarChart2 } from 'lucide-react';

interface SiteData {
    site: string;
    count: number;
}

interface ImmersionsBySiteChartProps {
    data: SiteData[];
}

export const ImmersionsBySiteChart = ({ data }: ImmersionsBySiteChartProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2"><BarChart2 className="w-5 h-5" />Inmersiones por Sitio</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis dataKey="site" type="category" width={100} tick={{ fontSize: 12 }} />
                        <Tooltip cursor={{fill: 'rgba(240, 240, 240, 0.5)'}}/>
                        <Bar dataKey="count" name="Cantidad" fill="#10b981" barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
