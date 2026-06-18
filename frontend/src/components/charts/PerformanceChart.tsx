import React from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

interface PerformanceRadarProps {
  data: Array<{ subject: string; value: number; fullMark: number }>;
  height?: number;
}

interface PerformanceTrendProps {
  data: Array<{
    month: string;
    averageScore: number;
    topScore: number;
    fitnessScore: number;
    teamworkScore: number;
  }>;
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
          <span className="text-white font-medium">{entry.value.toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
};

export const PerformanceRadarChart: React.FC<PerformanceRadarProps> = ({ data, height = 280 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <RadarChart data={data}>
      <PolarGrid stroke="rgba(255,255,255,0.08)" />
      <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11 }} />
      <Radar
        name="Score"
        dataKey="value"
        stroke="#6366f1"
        fill="#6366f1"
        fillOpacity={0.25}
        dot={{ fill: '#6366f1', r: 3 }}
      />
    </RadarChart>
  </ResponsiveContainer>
);

export const PerformanceTrendChart: React.FC<PerformanceTrendProps> = ({ data, height = 280 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
      <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12, paddingTop: 12 }} iconType="circle" iconSize={8} />
      <Line type="monotone" dataKey="averageScore" name="Avg Score" stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      <Line type="monotone" dataKey="topScore" name="Top Score" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      <Line type="monotone" dataKey="fitnessScore" name="Fitness" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      <Line type="monotone" dataKey="teamworkScore" name="Teamwork" stroke="#06b6d4" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
    </LineChart>
  </ResponsiveContainer>
);
