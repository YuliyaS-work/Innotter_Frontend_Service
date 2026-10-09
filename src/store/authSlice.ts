import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
  id: string;
  roles: string[];
  email?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

const initialUserId = localStorage.getItem('user_id');

// roles from localStorage
const savedRoles = localStorage.getItem('user_roles');
let initialRoles: string[] = [];

if (savedRoles) {
  try {
    initialRoles = JSON.parse(savedRoles);
  } catch (error) {
    console.error('Failed to parse user_roles from localStorage:', error);
  }
}

const initialState: AuthState = {
  user: initialUserId ? { id: initialUserId, roles: initialRoles } : null,
  isAuthenticated: Boolean(initialUserId),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser }>
    ) => {
      const { user } = action.payload;
      state.user = user;
      state.isAuthenticated = true;

      localStorage.setItem('user_id', user.id);
      localStorage.setItem('user_roles', JSON.stringify(user.roles));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem('user_id');
      localStorage.removeItem('user_roles');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;