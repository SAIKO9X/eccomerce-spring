import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

const BASE_URL = "/api/transactions";

const initialState = {
  transactions: [],
  transaction: null,
  metrics: null,
  chartData: {},
  loading: false,
  error: null,
};

const setLoadingState = (state) => {
  state.loading = true;
  state.error = null;
};

const handleFetchTransactionsSuccess = (state, action) => {
  state.loading = false;
  state.transactions = action.payload;
};

const handleError = (state, action) => {
  state.loading = false;
  state.error = action.payload || "Erro desconhecido";
  console.error("Erro transações:", action.payload);
};

export const getTransactionBySeller = createAsyncThunk(
  "transactions/getTransactionBySeller",
  async ({ jwt }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/seller`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllTransactions = createAsyncThunk(
  "transactions/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(BASE_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      console.log("all transaction", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${BASE_URL}/add`, transactionData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDashboardMetrics = createAsyncThunk(
  "dashboard/fetchMetrics",
  async ({ jwt, start, end }, { rejectWithValue }) => {
    try {
      const response = await api.get("/sellers/dashboard/metrics", {
        headers: { Authorization: `Bearer ${jwt}` },
        params: { start, end },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAnnualEarningsChart = createAsyncThunk(
  "dashboard/fetchAnnualEarningsChart",
  async ({ jwt, year }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        "/sellers/dashboard/earnings-chart/annual",
        {
          headers: { Authorization: `Bearer ${jwt}` },
          params: { year },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMonthlyEarningsChart = createAsyncThunk(
  "dashboard/fetchMonthlyEarningsChart",
  async ({ jwt, year, month }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        "/sellers/dashboard/earnings-chart/monthly",
        {
          headers: { Authorization: `Bearer ${jwt}` },
          params: { year, month },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDailyEarningsChart = createAsyncThunk(
  "dashboard/fetchDailyEarningsChart",
  async ({ jwt, date }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        "/sellers/dashboard/earnings-chart/daily",
        {
          headers: { Authorization: `Bearer ${jwt}` },
          params: { date },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Transações
      .addCase(getTransactionBySeller.pending, setLoadingState)
      .addCase(getTransactionBySeller.fulfilled, handleFetchTransactionsSuccess)
      .addCase(getTransactionBySeller.rejected, handleError)
      .addCase(getAllTransactions.pending, setLoadingState)
      .addCase(getAllTransactions.fulfilled, handleFetchTransactionsSuccess)
      .addCase(getAllTransactions.rejected, handleError)
      .addCase(createTransaction.pending, setLoadingState)
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.push(action.payload);
      })
      .addCase(createTransaction.rejected, handleError)
      // Dashboard Metrics
      .addCase(fetchDashboardMetrics.pending, setLoadingState)
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchDashboardMetrics.rejected, handleError)
      // Gráficos do Dashboard
      .addCase(fetchAnnualEarningsChart.pending, setLoadingState)
      .addCase(fetchAnnualEarningsChart.fulfilled, (state, action) => {
        state.loading = false;
        state.chartData = action.payload;
      })
      .addCase(fetchAnnualEarningsChart.rejected, handleError)
      .addCase(fetchMonthlyEarningsChart.pending, setLoadingState)
      .addCase(fetchMonthlyEarningsChart.fulfilled, (state, action) => {
        state.loading = false;
        state.chartData = action.payload;
      })
      .addCase(fetchMonthlyEarningsChart.rejected, handleError)
      .addCase(fetchDailyEarningsChart.pending, setLoadingState)
      .addCase(fetchDailyEarningsChart.fulfilled, (state, action) => {
        state.loading = false;
        state.chartData = action.payload;
      })
      .addCase(fetchDailyEarningsChart.rejected, handleError);
  },
});

export default transactionSlice.reducer;
