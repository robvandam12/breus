
import { Card, CardContent } from "@/components/ui/card";
import { FileText, TrendingUp, CheckCircle, Clock } from "lucide-react";

export const MainKPIs = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-600">Total Operaciones</p>
                            <p className="text-3xl font-bold text-blue-600">24</p>
                        </div>
                        <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="mt-2 text-sm text-green-600">
                        +12% vs mes anterior
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-600">Inmersiones</p>
                            <p className="text-3xl font-bold text-teal-600">186</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-teal-600" />
                    </div>
                    <div className="mt-2 text-sm text-green-600">
                        +8% vs mes anterior
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-600">Cumplimiento</p>
                            <p className="text-3xl font-bold text-green-600">92%</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="mt-2 text-sm text-green-600">
                        +3% vs mes anterior
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-600">Pendientes</p>
                            <p className="text-3xl font-bold text-orange-600">7</p>
                        </div>
                        <Clock className="w-8 h-8 text-orange-600" />
                    </div>
                    <div className="mt-2 text-sm text-red-600">
                        -2 vs mes anterior
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
