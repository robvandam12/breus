
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: '01', inmersiones: 4 },
  { date: '02', inmersiones: 3 },
  { date: '03', inmersiones: 7 },
  { date: '04', inmersiones: 8 },
  { date: '05', inmersiones: 5 },
  { date: '06', inmersiones: 9 },
  { date: '07', inmersiones: 6 },
];

export function DashboardChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="inmersiones" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
