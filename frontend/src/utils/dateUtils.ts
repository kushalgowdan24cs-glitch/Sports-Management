import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

export const formatDate = (dateString: string, pattern = 'dd MMM yyyy'): string => {
  try {
    return format(parseISO(dateString), pattern);
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'dd MMM yyyy, hh:mm a');
  } catch {
    return dateString;
  }
};

export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (isToday(date)) return `Today at ${format(date, 'hh:mm a')}`;
    if (isYesterday(date)) return `Yesterday at ${format(date, 'hh:mm a')}`;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return dateString;
  }
};

export const formatInputDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'yyyy-MM-dd');
  } catch {
    return dateString;
  }
};

export const getTodayString = (): string => format(new Date(), 'yyyy-MM-dd');

export const getMonthName = (monthIndex: number): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[monthIndex] ?? '';
};

export const getLastNMonths = (n: number): string[] => {
  const months: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(format(d, 'MMM yyyy'));
  }
  return months;
};
