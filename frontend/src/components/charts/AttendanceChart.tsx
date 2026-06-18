import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

interface AttendanceDataPoint {
  date: string;
  present: number;
  absent: number;
  total: number;
  percentage: number;
}

interface AttendanceChartProps {
  data: AttendanceDataPoint[];
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs font-semibold text-gray-300 mb-2">{label}</p>
      {payload.map(entry => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-400">{entry.name}:</span>
          <span className="text-white font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export const AttendanceChart: React.FC<AttendanceChartProps> = ({ data, height = 280 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ color: '#9ca3af', fontSize: 12, paddingTop: 12 }}
          iconType="circle"
          iconSize={8}
        />
        <Area
          type="monotone" dataKey="present" name="Present"
          stroke="#10b981" strokeWidth={2}
          fill="url(#presentGrad)" dot={false}
          activeDot={{ r: 4, fill: '#10b981' }}
        />
        <Area
          type="monotone" dataKey="absent" name="Absent"
          stroke="#ef4444" strokeWidth={2}
          fill="url(#absentGrad)" dot={false}
          activeDot={{ r: 4, fill: '#ef4444' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
