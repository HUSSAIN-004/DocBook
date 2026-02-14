import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_URL = '/api/admin'

// Get all users
export const getAllUsers = createAsyncThunk(
  'admin/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
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

// Delete user
export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await response.json()
      if (!data.success) {
        return rejectWithValue(data.message)
      }
      return { id, ...data }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Get all doctors (admin view)
export const getAllDoctors = createAsyncThunk(
  'admin/getAllDoctors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/doctors`, {
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

// Approve doctor
export const approveDoctor = createAsyncThunk(
  'admin/approveDoctor',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/doctors/${id}/approve`, {
        method: 'PUT',
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

// Block doctor
export const blockDoctor = createAsyncThunk(
  'admin/blockDoctor',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/doctors/${id}/block`, {
        method: 'PUT',
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

// Unblock doctor
export const unblockDoctor = createAsyncThunk(
  'admin/unblockDoctor',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/doctors/${id}/unblock`, {
        method: 'PUT',
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

// Get dashboard stats
export const getStats = createAsyncThunk(
  'admin/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/stats`, {
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

const initialState = {
  users: [],
  doctors: [],
  stats: null,
  loading: false,
  error: null,
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload.users
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false
        state.users = state.users.filter((u) => u._id !== action.payload.id)
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get all doctors
      .addCase(getAllDoctors.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllDoctors.fulfilled, (state, action) => {
        state.loading = false
        state.doctors = action.payload.doctors
      })
      .addCase(getAllDoctors.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Approve doctor
      .addCase(approveDoctor.pending, (state) => {
        state.loading = true
      })
      .addCase(approveDoctor.fulfilled, (state, action) => {
        state.loading = false
        const index = state.doctors.findIndex(
          (d) => d._id === action.payload.doctor._id
        )
        if (index !== -1) {
          state.doctors[index] = action.payload.doctor
        }
      })
      .addCase(approveDoctor.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Block doctor
      .addCase(blockDoctor.pending, (state) => {
        state.loading = true
      })
      .addCase(blockDoctor.fulfilled, (state, action) => {
        state.loading = false
        const index = state.doctors.findIndex(
          (d) => d._id === action.payload.doctor._id
        )
        if (index !== -1) {
          state.doctors[index] = action.payload.doctor
        }
      })
      .addCase(blockDoctor.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Unblock doctor
      .addCase(unblockDoctor.pending, (state) => {
        state.loading = true
      })
      .addCase(unblockDoctor.fulfilled, (state, action) => {
        state.loading = false
        const index = state.doctors.findIndex(
          (d) => d._id === action.payload.doctor._id
        )
        if (index !== -1) {
          state.doctors[index] = action.payload.doctor
        }
      })
      .addCase(unblockDoctor.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get stats
      .addCase(getStats.pending, (state) => {
        state.loading = true
      })
      .addCase(getStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload.stats
      })
      .addCase(getStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = adminSlice.actions
export default adminSlice.reducer
