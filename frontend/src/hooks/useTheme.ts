import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { toggleTheme, setTheme } from '@/store/slices/uiSlice';

export const useTheme = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.ui.theme);

  const toggle = () => dispatch(toggleTheme());
  const set = (t: 'dark' | 'light') => dispatch(setTheme(t));

  return { theme, toggle, set, isDark: theme === 'dark' };
};
