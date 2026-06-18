import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell,
} from 'recharts';

interface TeamComparisonProps {
  data: Array<{
    teamName: string;
    averageScore: number;
    attendanceRate: number;
    wins: number;
  }>;
  height?: number;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

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

export const TeamComparisonChart: React.FC<TeamComparisonProps> = ({ data, height = 280 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barCategoryGap="20%">
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
      <XAxis dataKey="teamName" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12, paddingTop: 12 }} iconType="circle" iconSize={8} />
      <Bar dataKey="averageScore" name="Avg Score" fill="#6366f1" radius={[4, 4, 0, 0]}>
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.85} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

export const GroupedTeamChart: React.FC<TeamComparisonProps> = ({ data, height = 280 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barCategoryGap="25%">
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
      <XAxis dataKey="teamName" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12, paddingTop: 12 }} iconType="circle" iconSize={8} />
      <Bar dataKey="averageScore" name="Avg Score" fill="#6366f1" radius={[4, 4, 0, 0]} />
      <Bar dataKey="attendanceRate" name="Attendance %" fill="#10b981" radius={[4, 4, 0, 0]} />
      <Bar dataKey="wins" name="Wins" fill="#f59e0b" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);
