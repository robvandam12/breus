
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Anchor } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Nueva Operación",
      icon: Plus,
      color: "bg-zinc-600 hover:bg-zinc-700",
      onClick: () => navigate("/operaciones")
    },
    {
      label: "HPT Completa",
      icon: FileText,
      color: "bg-blue-600 hover:bg-blue-700",
      onClick: () => navigate("/formularios/hpt")
    },
    {
      label: "Nueva Inmersión",
      icon: Anchor,
      color: "bg-cyan-600 hover:bg-cyan-700",
      onClick: () => navigate("/inmersiones")
    }
  ];

  return (
    <Card className="ios-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={action.onClick}
            className={`w-full p-3 text-left rounded-xl text-white font-medium transition-all duration-200 ios-button touch-target ${action.color}`}
          >
            <div className="flex items-center gap-3">
              <action.icon className="w-5 h-5" />
              {action.label}
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};
