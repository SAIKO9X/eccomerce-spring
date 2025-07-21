import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { createReview } from "./reviewSlice";

const BASE_URL = "/products";

const initialState = {
  product: null,
  products: [],
  totalPages: 1,
  similarProducts: [],
  error: null,
  loading: false,
  searchProducts: [],
};

const handleFetchSimilarProductsSuccess = (state, action) => {
  state.loading = false;
  state.similarProducts = action.payload;
};

const setLoadingState = (state) => {
  state.loading = true;
  state.error = null;
};

const handleFetchProductSuccess = (state, action) => {
  state.loading = false;
  state.product = action.payload;
};

const handleFetchProductsSuccess = (state, action) => {
  state.loading = false;
  state.products = action.payload.content || action.payload;
  state.totalPages = action.payload.totalPages || 1;
};

const handleSearchProductsSuccess = (state, action) => {
  state.loading = false;
  state.searchProducts = action.payload;
};

export const getSimilarProducts = createAsyncThunk(
  `${BASE_URL}/getSimilar`,
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/${productId}/similar`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const handleError = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

export const getProductById = createAsyncThunk(
  `${BASE_URL}/getById`,
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllProducts = createAsyncThunk(
  `${BASE_URL}/getAll`,
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(BASE_URL, {
        params: {
          ...params,
          pageNumber: params.pageNumber || 0,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const searchProducts = createAsyncThunk(
  `${BASE_URL}/search`,
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/search`, {
        params: { query },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductById.pending, setLoadingState)
      .addCase(getProductById.fulfilled, handleFetchProductSuccess)
      .addCase(getProductById.rejected, handleError)
      .addCase(getAllProducts.pending, setLoadingState)
      .addCase(getAllProducts.fulfilled, handleFetchProductsSuccess)
      .addCase(getAllProducts.rejected, handleError)
      .addCase(searchProducts.pending, setLoadingState)
      .addCase(searchProducts.fulfilled, handleSearchProductsSuccess)
      .addCase(searchProducts.rejected, handleError)
      .addCase(getSimilarProducts.pending, setLoadingState)
      .addCase(getSimilarProducts.fulfilled, handleFetchSimilarProductsSuccess)
      .addCase(getSimilarProducts.rejected, handleError)
      .addCase(createReview.fulfilled, (state, action) => {
        if (state.product && state.product.id === action.payload.product.id) {
          // Ajustar depois...
        }
      });
  },
});

export default productSlice.reducer;
