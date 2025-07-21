import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

const BASE_URL = "/admin";

const initialState = {
  categories: [],
  loading: false,
  error: null,
  categoryUpdated: false,
};

export const updateHomeCategory = createAsyncThunk(
  "admin/updateHomeCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${BASE_URL}/home-category/${id}`, data);
      console.log("category update", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erro ao atualizar categoria"
      );
    }
  }
);

export const getHomeCategory = createAsyncThunk(
  "admin/getHomeCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/home-category`);
      console.log("home category", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erro ao carregar categorias"
      );
    }
  }
);

export const deleteHomeCategory = createAsyncThunk(
  "admin/deleteHomeCategory",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${BASE_URL}/home-category/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      console.log("Deleted category:", id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erro ao deletar categoria"
      );
    }
  }
);

export const adminSlice = createSlice({
  name: "adminSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateHomeCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.categoryUpdated = false;
      })
      .addCase(updateHomeCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryUpdated = true;
        const index = state.categories.findIndex(
          (category) => category.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        } else {
          state.categories.push(action.payload);
        }
      })
      .addCase(updateHomeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getHomeCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.categoryUpdated = false;
      })
      .addCase(getHomeCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getHomeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteHomeCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHomeCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (category) => category.id !== action.payload
        );
      })
      .addCase(deleteHomeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
