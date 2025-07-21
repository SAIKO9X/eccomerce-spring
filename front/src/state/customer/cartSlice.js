import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import {
  sumCartItemBasePrice,
  sumCartItemSellingPrice,
} from "../../utils/sumCartItem";
import { applyCoupon } from "./couponSlice";

const BASE_URL = "/api/cart";

const initialState = {
  cart: null,
  loading: false,
  error: null,
};

const setLoadingState = (state) => {
  state.loading = true;
  state.error = null;
};

const handleFetchCartSuccess = (state, action) => {
  state.loading = false;
  state.cart = action.payload;
};

const handleError = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

export const findUserCart = createAsyncThunk(
  "cart/fetchUserCart",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(BASE_URL, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("user cart", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erro ao buscar carrinho");
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (jwt, { rejectWithValue }) => {
    try {
      await api.delete(`${BASE_URL}/clear`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erro ao limpar carrinho");
    }
  }
);

export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ request }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${BASE_URL}/add`, request, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erro ao adicionar item");
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ jwt, cartItemId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${BASE_URL}/item/${cartItemId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao excluir item do carrinho"
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ jwt, cartItemId, cartItem }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `${BASE_URL}/item/${cartItemId}`,
        cartItem,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      console.log("cart item quantity updated", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao atualizar item do carrinho"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartState: (state) => {
      state.cart = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(findUserCart.pending, setLoadingState)
      .addCase(findUserCart.fulfilled, handleFetchCartSuccess)
      .addCase(findUserCart.rejected, handleError)
      .addCase(addItemToCart.pending, setLoadingState)
      .addCase(addItemToCart.fulfilled, handleFetchCartSuccess)
      .addCase(addItemToCart.rejected, handleError)
      .addCase(clearCart.pending, setLoadingState)
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = null;
        state.loading = false;
      })
      .addCase(clearCart.rejected, handleError)
      .addCase(deleteCartItem.pending, setLoadingState)
      .addCase(deleteCartItem.fulfilled, handleFetchCartSuccess)
      .addCase(deleteCartItem.rejected, handleError)
      .addCase(updateCartItem.rejected, handleError)
      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (state.cart) {
          const updatedItem = action.payload;
          state.cart.cartItems = state.cart.cartItems.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          );
          state.cart.totalSellingPrice = sumCartItemSellingPrice(
            state.cart.cartItems
          );
          state.cart.totalBasePrice = sumCartItemBasePrice(
            state.cart.cartItems
          );
        }
        state.loading = false;
      })
      .addCase(applyCoupon.fulfilled, handleFetchCartSuccess);
  },
});

export default cartSlice.reducer;
export const { resetCartState } = cartSlice.actions;
