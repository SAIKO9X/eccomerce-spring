import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

const BASE_URL = "/api/coupons";

const initialState = {
  loading: false,
  error: null,
  coupons: [],
};

export const fetchAllCoupons = createAsyncThunk(
  "adminCoupon/fetchAllCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/admin/all`, {
        headers: { Authorization: localStorage.getItem("jwt") },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erro ao buscar cupons");
    }
  }
);

export const createCoupon = createAsyncThunk(
  "adminCoupon/createCoupon",
  async (couponData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${BASE_URL}/admin/create`, couponData, {
        headers: { Authorization: localStorage.getItem("jwt") },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erro ao criar cupom");
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "adminCoupon/deleteCoupon",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${BASE_URL}/admin/delete/${id}`, {
        headers: { Authorization: localStorage.getItem("jwt") },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erro ao deletar cupom");
    }
  }
);

export const fetchCouponsByStatus = createAsyncThunk(
  "adminCoupon/fetchCouponsByStatus",
  async (status, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/admin/by-status`, {
        params: { status },
        headers: { Authorization: localStorage.getItem("jwt") },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Erro ao buscar cupons por status"
      );
    }
  }
);

export const activateCoupon = createAsyncThunk(
  "adminCoupon/activateCoupon",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `${BASE_URL}/admin/activate/${id}`,
        {},
        {
          headers: { Authorization: localStorage.getItem("jwt") },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erro ao ativar cupom");
    }
  }
);

export const deactivateCoupon = createAsyncThunk(
  "adminCoupon/deactivateCoupon",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `${BASE_URL}/admin/deactivate/${id}`,
        {},
        {
          headers: { Authorization: localStorage.getItem("jwt") },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erro ao desativar cupom");
    }
  }
);

const adminCouponSlice = createSlice({
  name: "adminCoupon",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(fetchAllCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons.push(action.payload);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = state.coupons.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCouponsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCouponsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(fetchCouponsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(activateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.coupons.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) state.coupons[index] = action.payload;
      })
      .addCase(deactivateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.coupons.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) state.coupons[index] = action.payload;
      });
  },
});

export default adminCouponSlice.reducer;
