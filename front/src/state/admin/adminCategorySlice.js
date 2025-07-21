import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

const BASE_URL = "/admin/categories";

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const setLoadingState = (state) => {
  state.loading = true;
  state.error = null;
};

const handleFetchCategoriesSuccess = (state, action) => {
  state.loading = false;
  state.categories = action.payload;
};

const handleCreateCategorySuccess = (state, action) => {
  state.loading = false;
  state.categories.push(action.payload);
};

const handleUpdateCategorySuccess = (state, action) => {
  state.loading = false;
  const index = state.categories.findIndex(
    (category) => category.id === action.payload.id
  );
  if (index !== -1) {
    state.categories[index] = action.payload;
  }
};

const handleDeleteCategorySuccess = (state, action) => {
  state.loading = false;
  state.categories = state.categories.filter(
    (category) => category.id !== action.meta.arg
  );
};

const handleError = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(BASE_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erro ao buscar categorias"
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (category, { rejectWithValue }) => {
    try {
      const response = await api.post(BASE_URL, category, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erro ao criar categoria"
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, category }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${BASE_URL}/${id}`, category, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erro ao atualizar categoria"
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erro ao deletar categoria"
      );
    }
  }
);

const adminCategorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, setLoadingState)
      .addCase(fetchCategories.fulfilled, handleFetchCategoriesSuccess)
      .addCase(fetchCategories.rejected, handleError)
      .addCase(createCategory.pending, setLoadingState)
      .addCase(createCategory.fulfilled, handleCreateCategorySuccess)
      .addCase(createCategory.rejected, handleError)
      .addCase(updateCategory.pending, setLoadingState)
      .addCase(updateCategory.fulfilled, handleUpdateCategorySuccess)
      .addCase(updateCategory.rejected, handleError)
      .addCase(deleteCategory.pending, setLoadingState)
      .addCase(deleteCategory.fulfilled, handleDeleteCategorySuccess)
      .addCase(deleteCategory.rejected, handleError);
  },
});

export default adminCategorySlice.reducer;
