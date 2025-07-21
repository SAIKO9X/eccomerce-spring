import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

const BASE_URL = "/api/wishlist";

const initialState = {
  wishlist: [],
  loading: false,
  error: null,
};

const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

const handleFetchSuccess = (state, action) => {
  state.loading = false;
  state.wishlist = action.payload;
};

const handleError = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

export const getWishListByUserId = createAsyncThunk(
  "wishlist/getByUserId",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      console.log("wishlist data", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addToWishList = createAsyncThunk(
  "wishlist/addToWishList",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${BASE_URL}/add-product/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      console.log("add to wishlist", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWishListByUserId.pending, handlePending)
      .addCase(getWishListByUserId.fulfilled, handleFetchSuccess)
      .addCase(getWishListByUserId.rejected, handleError)
      .addCase(addToWishList.pending, handlePending)
      .addCase(addToWishList.fulfilled, handleFetchSuccess)
      .addCase(addToWishList.rejected, handleError);
  },
});

export default wishlistSlice.reducer;
