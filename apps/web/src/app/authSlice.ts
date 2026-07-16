import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthState = { ready: boolean; token: string | null };

const initialState: AuthState = { ready: false, token: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    enableDevelopmentIdentity: () => ({ ready: true, token: null }),
    setSessionToken: (_, action: PayloadAction<string | null>) => ({
      ready: true,
      token: action.payload,
    }),
  },
});

export const { enableDevelopmentIdentity, setSessionToken } = authSlice.actions;
export default authSlice.reducer;
