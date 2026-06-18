import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MatchStatsChartProps {
  wins: number;
  losses: number;
  draws: number;
  height?: number;
}

const COLORS = { WIN: '#10b981', LOSS: '#ef4444', DRAW: '#6b7280' };

const CustomTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) => {
  if (!active || !payload?.length) return null;
  const item = payload[0]!;
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 shadow-xl">
      <div className="flex items-center gap-2 text-xs">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.payload.color }} />
        <span className="text-gray-400">{item.name}:</span>
        <span className="text-white font-medium">{item.value} matches</span>
      </div>
    </div>
  );
};

export const MatchStatsChart: React.FC<MatchStatsChartProps> = ({ wins, losses, draws, height = 260 }) => {
  const data = [
    { name: 'Wins', value: wins, color: COLORS.WIN },
    { name: 'Losses', value: losses, color: COLORS.LOSS },
    { name: 'Draws', value: draws, color: COLORS.DRAW },
  ].filter(d => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-gray-500 text-sm" style={{ height }}>
        No match data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
          strokeWidth={0}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} fillOpacity={0.85} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ color: '#9ca3af', fontSize: 12, paddingTop: 12 }}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
