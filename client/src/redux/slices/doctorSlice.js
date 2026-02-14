import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_URL = '/api/doctors'

// Get all approved doctors
export const getDoctors = createAsyncThunk(
  'doctor/getDoctors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
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

// Get doctors by speciality
export const getDoctorsBySpeciality = createAsyncThunk(
  'doctor/getDoctorsBySpeciality',
  async (speciality, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/speciality/${speciality}`, {
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

// Get single doctor
export const getDoctor = createAsyncThunk(
  'doctor/getDoctor',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
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

// Apply to become doctor
export const applyDoctor = createAsyncThunk(
  'doctor/applyDoctor',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/apply`, {
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
      return rejectWithValue(error.message)
    }
  }
)

// Get doctor profile (for logged in doctor)
export const getDoctorProfile = createAsyncThunk(
  'doctor/getDoctorProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/profile/me`, {
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

// Update doctor profile
export const updateDoctorProfile = createAsyncThunk(
  'doctor/updateDoctorProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
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
      return rejectWithValue(error.message)
    }
  }
)

// Check application status
export const checkApplicationStatus = createAsyncThunk(
  'doctor/checkApplicationStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/application/status`, {
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
  doctors: [],
  doctor: null,
  doctorProfile: null,
  applicationStatus: null,
  loading: false,
  error: null,
}

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearDoctor: (state) => {
      state.doctor = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get doctors
      .addCase(getDoctors.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getDoctors.fulfilled, (state, action) => {
        state.loading = false
        state.doctors = action.payload.doctors
      })
      .addCase(getDoctors.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get doctors by speciality
      .addCase(getDoctorsBySpeciality.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getDoctorsBySpeciality.fulfilled, (state, action) => {
        state.loading = false
        state.doctors = action.payload.doctors
      })
      .addCase(getDoctorsBySpeciality.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get single doctor
      .addCase(getDoctor.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getDoctor.fulfilled, (state, action) => {
        state.loading = false
        state.doctor = action.payload.doctor
      })
      .addCase(getDoctor.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Apply doctor
      .addCase(applyDoctor.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(applyDoctor.fulfilled, (state, action) => {
        state.loading = false
        state.applicationStatus = {
          hasApplied: true,
          status: action.payload.doctor.status,
          doctor: action.payload.doctor,
        }
      })
      .addCase(applyDoctor.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get doctor profile
      .addCase(getDoctorProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getDoctorProfile.fulfilled, (state, action) => {
        state.loading = false
        state.doctorProfile = action.payload.doctor
      })
      .addCase(getDoctorProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update doctor profile
      .addCase(updateDoctorProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateDoctorProfile.fulfilled, (state, action) => {
        state.loading = false
        state.doctorProfile = action.payload.doctor
      })
      .addCase(updateDoctorProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Check application status
      .addCase(checkApplicationStatus.pending, (state) => {
        state.loading = true
      })
      .addCase(checkApplicationStatus.fulfilled, (state, action) => {
        state.loading = false
        state.applicationStatus = action.payload
      })
      .addCase(checkApplicationStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearDoctor } = doctorSlice.actions
export default doctorSlice.reducer
