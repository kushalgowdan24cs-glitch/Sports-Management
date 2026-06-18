import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: 'dark' | 'light';
  activeModal: string | null;
  isGlobalLoading: boolean;
}

const savedTheme = (localStorage.getItem('sms_theme') as 'dark' | 'light') || 'dark';

const initialState: UIState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  theme: savedTheme,
  activeModal: null,
  isGlobalLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarCollapse(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setTheme(state, action: PayloadAction<'dark' | 'light'>) {
      state.theme = action.payload;
      localStorage.setItem('sms_theme', action.payload);
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    toggleTheme(state) {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      state.theme = newTheme;
      localStorage.setItem('sms_theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setActiveModal(state, action: PayloadAction<string | null>) {
      state.activeModal = action.payload;
    },
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.isGlobalLoading = action.payload;
    },
  },
});

export const {
  toggleSidebar, setSidebarOpen, toggleSidebarCollapse,
  setTheme, toggleTheme, setActiveModal, setGlobalLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
