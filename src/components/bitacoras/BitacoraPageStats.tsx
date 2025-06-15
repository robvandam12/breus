
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number | string;
  color: string;
  description: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, color, description }) => (
  <Card className="ios-card">
    <CardContent className="p-6">
      <div className={`text-2xl font-bold ${color}`}>
        {value}
      </div>
      <div className="text-sm text-zinc-500">{description}</div>
    </CardContent>
  </Card>
);

interface BitacoraPageStatsProps {
  totalSupervisor?: number;
  totalBuzo?: number;
  pendingSignature?: number;
  completed?: number;
  type?: 'supervisor' | 'buzo' | 'both';
}

export const BitacoraPageStats: React.FC<BitacoraPageStatsProps> = ({
  totalSupervisor = 0,
  totalBuzo = 0,
  pendingSignature = 0,
  completed = 0,
  type = 'both'
}) => {
  const renderSupervisorStats = () => (
    <>
      <StatsCard
        title="Total Supervisor"
        value={totalSupervisor}
        color="text-purple-600"
        description="Bitácoras Supervisor"
      />
      <StatsCard
        title="Completadas"
        value={completed}
        color="text-green-600"
        description="Firmadas y Completas"
      />
    </>
  );

  const renderBuzoStats = () => (
    <>
      <StatsCard
        title="Total Buzo"
        value={totalBuzo}
        color="text-teal-600"
        description="Bitácoras de Buzo"
      />
      <StatsCard
        title="Completadas"
        value={completed}
        color="text-green-600"
        description="Firmadas y Completas"
      />
    </>
  );

  const renderBothStats = () => (
    <>
      <StatsCard
        title="Supervisor"
        value={totalSupervisor}
        color="text-purple-600"
        description="Bitácoras Supervisor"
      />
      <StatsCard
        title="Buzo"
        value={totalBuzo}
        color="text-teal-600"
        description="Bitácoras Buzo"
      />
      <StatsCard
        title="Pendientes"
        value={pendingSignature}
        color="text-yellow-600"
        description="Esperando Firma"
      />
      <StatsCard
        title="Completadas"
        value={completed}
        color="text-green-600"
        description="Firmadas y Completas"
      />
    </>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {type === 'supervisor' && renderSupervisorStats()}
      {type === 'buzo' && renderBuzoStats()}
      {type === 'both' && renderBothStats()}
    </div>
  );
};
