import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_URL = '/api/auth'

// Register
export const register = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const data = await response.json()
      if (!data.success) {
        return rejectWithValue(data.message)
      }
      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed')
    }
  }
)

// Login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
      })
      const data = await response.json()
      if (!data.success) {
        return rejectWithValue(data.message)
      }
      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

// Logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Check auth (get current user)
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        credentials: 'include',
      })
      const data = await response.json()
      if (!data.success) {
        return rejectWithValue(data.message)
      }
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Update profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      })
      const data = await response.json()
      if (!data.success) {
        return rejectWithValue(data.message)
      }
      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Update failed')
    }
  }
)

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  checkingAuth: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.loading = false
      })
      // Check auth
      .addCase(checkAuth.pending, (state) => {
        state.checkingAuth = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.checkingAuth = false
        state.isAuthenticated = true
        state.user = action.payload.user
      })
      .addCase(checkAuth.rejected, (state) => {
        state.checkingAuth = false
        state.isAuthenticated = false
        state.user = null
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
