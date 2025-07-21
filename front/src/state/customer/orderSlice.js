import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

const BASE_URL = "/api/orders";

const initialState = {
  orders: [],
  orderItem: null,
  currentOrder: null,
  paymentOrder: null,
  loading: false,
  error: null,
  orderCanceled: false,
};

const setLoadingState = (state) => {
  state.loading = true;
  state.error = null;
};

const handleFetchSuccess = (state, action) => {
  state.loading = false;
  return action.payload;
};

const handleError = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

export const getUsersOrderHistory = createAsyncThunk(
  "order/getUsersOrderHistory",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/user`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("get Users Order History", response.data);
      return response.data;
    } catch (error) {
      console.log("get Users Order History error", error);
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar histórico de pedidos"
      );
    }
  }
);

export const getOrderById = createAsyncThunk(
  "order/getOrderById",
  async ({ jwt, orderId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/${orderId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("get Order By Id", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar pedido"
      );
    }
  }
);

export const getOrderItemById = createAsyncThunk(
  "order/getOrderItemById",
  async ({ jwt, orderItemId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/item/${orderItemId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("get Order Item By Id", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar item do pedido"
      );
    }
  }
);

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async ({ address, jwt, paymentMethod, cartItemIds }, { rejectWithValue }) => {
    try {
      const response = await api.post(BASE_URL, address, {
        headers: { Authorization: `Bearer ${jwt}` },
        params: { paymentMethod, cartItemIds: cartItemIds.join(",") },
      });
      if (response.data.payment_link_url) {
        window.location.href = response.data.payment_link_url;
      }
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Falha ao criar pedido"
      );
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async ({ jwt, orderId }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `${BASE_URL}/${orderId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao cancelar pedido"
      );
    }
  }
);

export const paymentSuccess = createAsyncThunk(
  "order/paymentSuccess",
  async ({ orderId, paymentLinkId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/payment/${orderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        params: { paymentLinkId },
      });
      console.log("payment success", response.data);
      return response.data;
    } catch (error) {
      console.log("payment success error", error);
      return rejectWithValue(
        error.response?.data?.message || "Falha ao confirmar pagamento"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsersOrderHistory.pending, setLoadingState)
      .addCase(getUsersOrderHistory.fulfilled, (state, action) => {
        state.orders = handleFetchSuccess(state, action);
      })
      .addCase(getUsersOrderHistory.rejected, handleError)
      .addCase(getOrderById.pending, setLoadingState)
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.currentOrder = handleFetchSuccess(state, action);
      })
      .addCase(getOrderById.rejected, handleError)
      .addCase(getOrderItemById.pending, setLoadingState)
      .addCase(getOrderItemById.fulfilled, (state, action) => {
        state.orderItem = handleFetchSuccess(state, action);
      })
      .addCase(getOrderItemById.rejected, handleError)
      .addCase(createOrder.pending, setLoadingState)
      .addCase(createOrder.fulfilled, (state, action) => {
        state.paymentOrder = handleFetchSuccess(state, action);
      })
      .addCase(createOrder.rejected, handleError)
      .addCase(cancelOrder.pending, setLoadingState)
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.orderCanceled = true;
        state.currentOrder = handleFetchSuccess(state, action);
      })
      .addCase(cancelOrder.rejected, handleError)
      .addCase(paymentSuccess.pending, setLoadingState)
      .addCase(paymentSuccess.fulfilled, (state, action) => {
        state.paymentOrder = handleFetchSuccess(state, action);
      })
      .addCase(paymentSuccess.rejected, handleError);
  },
});

export default orderSlice.reducer;
