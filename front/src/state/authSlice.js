import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config/Api";

const initialState = {
  jwt: null,
  otpSent: false,
  isLoggedIn: false,
  user: null,
  loading: false,
};

export const sendLoginRegisterOtp = createAsyncThunk(
  "/auth/sent/otp",
  async ({ email, role }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/sent/otp", { email, role });
      console.log("login otp", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const login = createAsyncThunk(
  "/auth/login",
  async (loginRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/auth/login", loginRequest);
      console.log("login request", response.data);
      localStorage.setItem("jwt", response.data.jwt);
      localStorage.setItem("role", response.data.role);

      if (response.data.jwt) {
        dispatch(getUserProfile({ jwt: response.data.jwt }));
      }

      return { jwt: response.data.jwt, role: response.data.role };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const register = createAsyncThunk(
  "/auth/register",
  async (registerRequest, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", registerRequest);
      console.log("register request", response.data);
      localStorage.setItem("jwt", response.data.jwt);
      localStorage.setItem("role", response.data.role);
      return { jwt: response.data.jwt, role: response.data.role };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "/users/profile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addAddress = createAsyncThunk(
  "auth/addAddress",
  async ({ jwt, address }, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/address", address, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Erro ao adicionar endereço"
      );
    }
  }
);

export const updateUserAddress = createAsyncThunk(
  "users/updateAddress",
  async ({ addressId, addressData, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/users/address/${addressId}`,
        addressData,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Erro ao atualizar endereço"
      );
    }
  }
);

export const deleteUserAddress = createAsyncThunk(
  "users/deleteAddress",
  async ({ addressId, jwt }, { rejectWithValue }) => {
    try {
      await api.delete(`/users/address/${addressId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return addressId; // Retorna o ID do endereço removido para o reducer
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Erro ao remover endereço"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("jwt");
      localStorage.removeItem("role");
      console.log("logout success");
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "users/updateProfile",
  async ({ userData, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.put("/users/profile", userData, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateAdminProfile = createAsyncThunk(
  "admin/updateProfile",
  async ({ userData, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.put("/admin/profile", userData, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initializeAuth: (state) => {
      const jwt = localStorage.getItem("jwt");
      const role = localStorage.getItem("role");
      if (jwt && role) {
        state.jwt = jwt;
        state.role = role;
        state.isLoggedIn = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendLoginRegisterOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendLoginRegisterOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendLoginRegisterOtp.rejected, (state) => {
        state.loading = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.jwt = action.payload.jwt;
        state.role = action.payload.role;
        state.isLoggedIn = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.jwt = action.payload.jwt;
        state.role = action.payload.role;
        state.isLoggedIn = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.jwt = null;
        state.role = null;
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.user.addresses = [...state.user.addresses, action.payload]; // Atualiza localmente
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserAddress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.user.addresses.findIndex(
          (addr) => addr.id === action.payload.id
        );
        if (index !== -1) {
          state.user.addresses[index] = action.payload;
        }
      })
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.user.addresses = state.user.addresses.filter(
          (addr) => addr.id !== action.payload
        );
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { initializeAuth } = authSlice.actions;
export default authSlice.reducer;
