
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3 } from "lucide-react";
import { cumplimientoData } from "@/data/reportesMockData";

export const ComplianceChart = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Cumplimiento de Formularios
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cumplimientoData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="hpt" fill="#3B82F6" name="HPT" />
                        <Bar dataKey="anexo" fill="#10B981" name="Anexo Bravo" />
                        <Bar dataKey="bitacoras" fill="#8B5CF6" name="Bitácoras" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
