import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

const initialState = {
  homePageData: null,
  homeCategories: [],
  loading: false,
  error: null,
};

export const createHomeCategories = createAsyncThunk(
  "home/createHomeCategory",
  async ({ homeCategories }, { rejectWithValue }) => {
    try {
      const response = await api.post("/home/categories", homeCategories);
      console.log("Response from server:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error response:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Unknown error");
    }
  }
);

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createHomeCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHomeCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.homePageData = action.payload;
        state.homeCategories = action.payload.carousel.concat(
          action.payload.shopCategories,
          action.payload.dealCategories || []
        );
      })
      .addCase(createHomeCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default homeSlice.reducer;
