
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

export const GlobalFiltersCard = () => {
    const [dateRange, setDateRange] = useState("month");
    const [selectedSalmonera, setSelectedSalmonera] = useState("all");
    const [selectedContratista, setSelectedContratista] = useState("all");

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Filtros de Reporte (Ejemplo)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Label htmlFor="dateRange">Período</Label>
                        <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="week">Última semana</SelectItem>
                                <SelectItem value="month">Último mes</SelectItem>
                                <SelectItem value="quarter">Último trimestre</SelectItem>
                                <SelectItem value="year">Último año</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="salmonera">Salmonera</Label>
                        <Select value={selectedSalmonera} onValueChange={setSelectedSalmonera}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="blumar">Blumar S.A.</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="contratista">Contratista</Label>
                        <Select value={selectedContratista} onValueChange={setSelectedContratista}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="aerocam">Aerocam Chile</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-end">
                        <Button className="w-full">Aplicar Filtros</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
