import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

const BASE_URL = "/api/products";

const initialState = {
  reviews: [],
  loading: false,
  error: null,
};

export const getReviewsByProductId = createAsyncThunk(
  "reviews/getByProductId",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/${productId}/reviews`, {
        headers: { Authorization: localStorage.getItem("jwt") },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createReview = createAsyncThunk(
  "reviews/create",
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${BASE_URL}/${productId}/reviews`,
        reviewData,
        {
          headers: { Authorization: localStorage.getItem("jwt") },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/delete",
  async (reviewId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/reviews/${reviewId}`, {
        headers: { Authorization: localStorage.getItem("jwt") },
      });
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUserReviews = createAsyncThunk(
  "reviews/getUserReviews",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/reviews/user/${userId}`, {
        headers: { Authorization: localStorage.getItem("jwt") },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getReviewById = createAsyncThunk(
  "reviews/getById",
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/reviews/${reviewId}`, {
        headers: { Authorization: localStorage.getItem("jwt") },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviewsByProductId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviewsByProductId.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getReviewsByProductId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(
          (review) => review.id !== action.payload
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getUserReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;
