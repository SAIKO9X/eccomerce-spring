import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

export const applyCoupon = createAsyncThunk(
  "coupon/apply",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/coupons/apply", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erro ao aplicar cupom");
    }
  }
);

export const removeCoupon = createAsyncThunk(
  "coupon/remove",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/coupons/apply", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erro ao remover cupom");
    }
  }
);

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    loading: false,
    error: null,
    appliedCoupon: null,
  },
  reducers: {
    clearCoupon: (state) => {
      state.error = null;
      state.appliedCoupon = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedCoupon = action.payload.couponCode;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCoupon.fulfilled, (state) => {
        state.loading = false;
        state.appliedCoupon = null;
      })
      .addCase(removeCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCoupon } = couponSlice.actions;
export default couponSlice.reducer;
