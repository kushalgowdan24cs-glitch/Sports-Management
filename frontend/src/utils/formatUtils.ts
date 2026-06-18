export const formatScore = (score: number, decimals = 1): string => {
  return score.toFixed(decimals);
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
};

export const getScoreBg = (score: number): string => {
  if (score >= 80) return 'bg-green-500/20 text-green-400 border-green-500/30';
  if (score >= 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  if (score >= 40) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
  return 'bg-red-500/20 text-red-400 border-red-500/30';
};

export const getTrendIcon = (trend: 'UP' | 'DOWN' | 'STABLE'): string => {
  if (trend === 'UP') return '↑';
  if (trend === 'DOWN') return '↓';
  return '→';
};

export const getTrendColor = (trend: 'UP' | 'DOWN' | 'STABLE'): string => {
  if (trend === 'UP') return 'text-green-400';
  if (trend === 'DOWN') return 'text-red-400';
  return 'text-gray-400';
};

export const generateAvatarColor = (name: string): string => {
  const colors = [
    'bg-violet-500', 'bg-blue-500', 'bg-cyan-500', 'bg-emerald-500',
    'bg-amber-500', 'bg-rose-500', 'bg-pink-500', 'bg-indigo-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index] ?? 'bg-violet-500';
};
