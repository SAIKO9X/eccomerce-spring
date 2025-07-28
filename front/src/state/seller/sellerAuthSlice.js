// sellerAuthSlice.js - CORRIGIDO
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

const initialState = {
  jwt: null,
  isLoggedIn: false,
  loading: false,
  error: null,
  role: null, // Adicionar role aqui também
};

export const sellerLogin = createAsyncThunk(
  "/sellers/login",
  async (loginRequest, { rejectWithValue }) => {
    try {
      const response = await api.post("/sellers/login", loginRequest);
      console.log("seller login", response.data);

      localStorage.setItem("jwt", response.data.jwt);
      localStorage.setItem("role", "ROLE_SELLER");

      return {
        jwt: response.data.jwt,
        role: "ROLE_SELLER",
        message: response.data.message,
      };
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
  reducers: {
    // Adicionar reducer para limpar estado
    clearSellerAuth: (state) => {
      state.jwt = null;
      state.isLoggedIn = false;
      state.role = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sellerLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sellerLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload.jwt;
        state.role = action.payload.role;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(sellerLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoggedIn = false;
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

export const { clearSellerAuth } = sellerAuthSlice.actions;
export default sellerAuthSlice.reducer;
