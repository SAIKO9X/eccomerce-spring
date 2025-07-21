import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { logout } from "../authSlice";

const initialState = {
  jwt: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

export const sellerLogin = createAsyncThunk(
  "/sellers/login",
  async (loginRequest, { rejectWithValue, dispatch }) => {
    try {
      dispatch(logout({ navigate: () => {} }));
      const response = await api.post("/sellers/login", loginRequest);
      console.log("seller login", response.data);
      localStorage.setItem("jwt", response.data.jwt);
      localStorage.setItem("role", "ROLE_SELLER");
      return { jwt: response.data.jwt, role: "ROLE_SELLER" };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const registerSeller = createAsyncThunk(
  "/sellers/register",
  async (sellerData, { rejectWithValue }) => {
    try {
      const response = await api.post("/sellers", sellerData);
      console.log("seller register", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const verifySellerEmail = createAsyncThunk(
  "/sellers/verify",
  async (otp, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/sellers/verify/${otp}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erro ao verificar OTP");
    }
  }
);

const sellerAuthSlice = createSlice({
  name: "sellerAuth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sellerLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sellerLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload.jwt;
        state.isLoggedIn = true;
      })
      .addCase(sellerLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerSeller.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifySellerEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifySellerEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifySellerEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default sellerAuthSlice.reducer;
