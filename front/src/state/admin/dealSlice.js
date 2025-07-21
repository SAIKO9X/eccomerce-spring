import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

const BASE_URL = "/admin/deals";

const initialState = {
  deals: [],
  loading: false,
  error: null,
  dealCreated: false,
  dealUpdated: false,
};

const setLoadingState = (state) => {
  state.loading = true;
  state.error = null;
};

const handleFetchDealsSuccess = (state, action) => {
  state.loading = false;
  state.deals = action.payload || [];
  state.error = null;
};

const handleCreateDealSuccess = (state, action) => {
  state.loading = false;
  state.deals.push(action.payload);
  state.dealCreated = true;
};

const handleDeleteDealSuccess = (state, action) => {
  state.loading = false;
  state.deals = state.deals.filter((deal) => deal.id !== action.meta.arg);
  state.dealUpdated = true;
};

const handleError = (state, action) => {
  state.loading = false;
  state.error =
    action.payload?.message || action.payload || "Erro desconhecido"; // Melhorar o erro
  state.dealCreated = false;
  state.dealUpdated = false;
};

export const createDeal = createAsyncThunk(
  "deals/createDeal",
  async (formData, { rejectWithValue }) => {
    try {
      console.log("Dados enviados ao backend:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await api.post(BASE_URL, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Created deal:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro na requisição:", error);
      return rejectWithValue(error.response?.data?.message || "Unknown error");
    }
  }
);

export const getAllDeals = createAsyncThunk(
  "deals/getAllDeals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(BASE_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Unknown error");
    }
  }
);

export const updateDeal = createAsyncThunk(
  "deals/updateDeal",
  async ({ id, dealData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${BASE_URL}/${id}`, dealData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("updated deal", response.data);
      return response.data;
    } catch (error) {
      console.log("update deal error", error);
      return rejectWithValue(
        error.response?.data?.message || "Erro ao atualizar a promoção"
      );
    }
  }
);

export const deleteDeal = createAsyncThunk(
  "deals/deleteDeal",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      console.log("deleted deal", id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Unknown error");
    }
  }
);

const dealsSlice = createSlice({
  name: "deals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDeal.pending, setLoadingState)
      .addCase(createDeal.fulfilled, handleCreateDealSuccess)
      .addCase(createDeal.rejected, handleError)
      .addCase(getAllDeals.pending, setLoadingState)
      .addCase(getAllDeals.fulfilled, handleFetchDealsSuccess)
      .addCase(getAllDeals.rejected, handleError)
      .addCase(updateDeal.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.dealUpdated = false;
      })
      .addCase(updateDeal.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.deals.findIndex(
          (deal) => deal.id === action.payload.id
        );
        if (index !== -1) {
          state.deals[index] = action.payload;
        }
        state.dealUpdated = true;
      })
      .addCase(updateDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.dealUpdated = false;
      })
      .addCase(deleteDeal.pending, setLoadingState)
      .addCase(deleteDeal.fulfilled, handleDeleteDealSuccess)
      .addCase(deleteDeal.rejected, handleError);
  },
});

export default dealsSlice.reducer;
