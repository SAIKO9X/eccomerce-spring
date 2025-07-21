import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

const BASE_URL = "/sellers";
const ADMIN_URL = "/admin";

const initialState = {
  sellers: [],
  selectedSeller: null,
  profile: null,
  report: null,
  loading: false,
  error: null,
};

const setLoadingState = (state) => {
  state.loading = true;
  state.error = null;
};

const handleProfileSuccess = (state, action) => {
  state.loading = false;
  state.profile = action.payload;
};

const handleError = (state, action) => {
  state.loading = false;
  state.error = action.payload || "Erro ao carregar dados do vendedor";
};

export const fetchSellerProfile = createAsyncThunk(
  "/sellers/profile",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erro ao buscar perfil");
    }
  }
);

export const fetchSellersByStatus = createAsyncThunk(
  "sellers/fetchByStatus",
  async (status, { rejectWithValue }) => {
    try {
      const response = await api.get(BASE_URL, {
        params: { status },
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Erro ao buscar vendedores"
      );
    }
  }
);

export const updateSellerStatus = createAsyncThunk(
  "sellers/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `${ADMIN_URL}/sellers/${id}/status/${status}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Erro ao atualizar status"
      );
    }
  }
);

export const updateSellerProfile = createAsyncThunk(
  "sellers/updateProfile",
  async ({ sellerData, jwt }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.patch(`${BASE_URL}`, sellerData, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      dispatch(fetchSellerProfile(jwt));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Erro ao atualizar perfil"
      );
    }
  }
);

const sellerSlice = createSlice({
  name: "sellers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProfile.pending, setLoadingState)
      .addCase(fetchSellerProfile.fulfilled, handleProfileSuccess)
      .addCase(fetchSellerProfile.rejected, handleError)
      .addCase(fetchSellersByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellersByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.sellers = action.payload;
      })
      .addCase(fetchSellersByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSellerStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSellerStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.sellers.findIndex(
          (seller) => seller.id === action.payload.id
        );
        if (index !== -1) {
          state.sellers[index] = action.payload;
        }
      })
      .addCase(updateSellerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSellerProfile.pending, setLoadingState)
      .addCase(updateSellerProfile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateSellerProfile.rejected, handleError);
  },
});

export default sellerSlice.reducer;
