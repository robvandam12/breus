
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Inmersion } from '@/types/inmersion';

interface ImmersionDepthChartProps {
  immersion: Inmersion;
}

export const ImmersionDepthChart = ({ immersion }: ImmersionDepthChartProps) => {
  if (!immersion.depth_history || immersion.depth_history.length < 2) {
    return <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 py-4">No hay suficientes datos de profundidad para mostrar un gráfico.</div>;
  }

  const data = immersion.depth_history.map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
    depth: d.depth * -1 // Profundidad como valor negativo para el gráfico
  }));

  return (
    <div className="h-28 w-full mt-2">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="time" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis 
            tickFormatter={(value) => `${Math.abs(value)}m`} 
            tick={{ fontSize: 10 }} 
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #ddd',
              fontSize: '12px',
              borderRadius: '0.5rem'
            }}
            labelFormatter={(label) => `Hora: ${label}`}
            formatter={(value: number) => [`${Math.abs(value)}m`, 'Profundidad']}
          />
          <Line type="monotone" dataKey="depth" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
