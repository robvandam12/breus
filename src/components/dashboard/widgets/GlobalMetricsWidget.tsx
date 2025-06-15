
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export const GlobalMetricsWidget = ({ config }: { config?: any }) => {
    return (
        <Card className="h-full flex flex-col justify-center">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Métricas Globales
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center text-muted-foreground py-10">
                    <p className="mb-4">Las métricas globales y los reportes avanzados estarán disponibles aquí.</p>
                    <Button asChild>
                        <Link to="/reportes">Ir a Reportes</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
