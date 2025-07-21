import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

const BASE_URL = "/api/seller/orders";

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const setLoadingState = (state) => {
  state.loading = true;
  state.error = null;
};

const handleFetchOrdersSuccess = (state, action) => {
  state.loading = false;
  state.orders = action.payload;
};

const handleUpdateOrderSuccess = (state, action) => {
  state.loading = false;
  const index = state.orders.findIndex(
    (order) => order.id === action.payload.id
  );
  if (index !== -1) {
    state.orders[index] = action.payload;
  }
};

const handleError = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

export const getAllOrders = createAsyncThunk(
  `${BASE_URL}/getAll`,
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(BASE_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      console.log("all order", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  `${BASE_URL}/updateStatus`,
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `${BASE_URL}/${orderId}/status/${status}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      console.log("update order status", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao atualizar status:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || "Erro desconhecido");
    }
  }
);

const sellerOrderSlice = createSlice({
  name: "sellerOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrders.pending, setLoadingState)
      .addCase(getAllOrders.fulfilled, handleFetchOrdersSuccess)
      .addCase(getAllOrders.rejected, handleError)
      .addCase(updateOrderStatus.pending, setLoadingState)
      .addCase(updateOrderStatus.fulfilled, handleUpdateOrderSuccess)
      .addCase(updateOrderStatus.rejected, handleError);
  },
});

export default sellerOrderSlice.reducer;
