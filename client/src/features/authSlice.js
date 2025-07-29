// client/src/features/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  authLoaded: false // <-- NEW
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.authLoaded = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.authLoaded = true;
    }
  }
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
