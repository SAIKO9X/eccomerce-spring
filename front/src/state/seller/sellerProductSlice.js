import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

const BASE_URL = "/api/sellers/products";

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const setLoadingState = (state) => {
  state.loading = true;
  state.error = null;
};

const handleFetchProductsSuccess = (state, action) => {
  state.loading = false;
  state.products = action.payload;
};

const handleCreateProductSuccess = (state, action) => {
  state.loading = false;
  state.products.push(action.payload);
};

const handleError = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

export const fetchSellerProducts = createAsyncThunk(
  `${BASE_URL}/fetch`,
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(BASE_URL, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("fetch products", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erro ao buscar produtos");
    }
  }
);

export const createProduct = createAsyncThunk(
  `${BASE_URL}/create`,
  async (productData, { rejectWithValue }) => {
    const { request, jwt } = productData;
    try {
      const response = await api.post(BASE_URL, request, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("create product", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erro ao criar produto");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "sellerProducts/update",
  async ({ productId, productData, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${BASE_URL}/${productId}`, productData, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Erro ao atualizar produto"
      );
    }
  }
);

const sellerProductSlice = createSlice({
  name: "sellerProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProducts.pending, setLoadingState)
      .addCase(fetchSellerProducts.fulfilled, handleFetchProductsSuccess)
      .addCase(fetchSellerProducts.rejected, handleError)
      .addCase(createProduct.pending, setLoadingState)
      .addCase(createProduct.fulfilled, handleCreateProductSuccess)
      .addCase(createProduct.rejected, handleError)
      .addCase(updateProduct.pending, setLoadingState)
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, handleError);
  },
});

export default sellerProductSlice.reducer;
