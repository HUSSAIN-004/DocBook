import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_URL = '/api/appointments'

// Book appointment
export const bookAppointment = createAsyncThunk(
  'appointment/bookAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(appointmentData),
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

// Get user's appointments
export const getMyAppointments = createAsyncThunk(
  'appointment/getMyAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/my-appointments`, {
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

// Get doctor's appointments
export const getDoctorAppointments = createAsyncThunk(
  'appointment/getDoctorAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/doctor-appointments`, {
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

// Update appointment status
export const updateAppointmentStatus = createAsyncThunk(
  'appointment/updateAppointmentStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
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

// Cancel appointment
export const cancelAppointment = createAsyncThunk(
  'appointment/cancelAppointment',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}/cancel`, {
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

const initialState = {
  appointments: [],
  doctorAppointments: [],
  loading: false,
  error: null,
  bookingSuccess: false,
}

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetBookingSuccess: (state) => {
      state.bookingSuccess = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Book appointment
      .addCase(bookAppointment.pending, (state) => {
        state.loading = true
        state.error = null
        state.bookingSuccess = false
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.loading = false
        state.bookingSuccess = true
        state.appointments.unshift(action.payload.appointment)
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.bookingSuccess = false
      })
      // Get my appointments
      .addCase(getMyAppointments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getMyAppointments.fulfilled, (state, action) => {
        state.loading = false
        state.appointments = action.payload.appointments
      })
      .addCase(getMyAppointments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get doctor appointments
      .addCase(getDoctorAppointments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getDoctorAppointments.fulfilled, (state, action) => {
        state.loading = false
        state.doctorAppointments = action.payload.appointments
      })
      .addCase(getDoctorAppointments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update appointment status
      .addCase(updateAppointmentStatus.pending, (state) => {
        state.loading = true
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        state.loading = false
        const index = state.doctorAppointments.findIndex(
          (a) => a._id === action.payload.appointment._id
        )
        if (index !== -1) {
          state.doctorAppointments[index] = action.payload.appointment
        }
      })
      .addCase(updateAppointmentStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Cancel appointment
      .addCase(cancelAppointment.pending, (state) => {
        state.loading = true
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.loading = false
        const index = state.appointments.findIndex(
          (a) => a._id === action.payload.appointment._id
        )
        if (index !== -1) {
          state.appointments[index] = action.payload.appointment
        }
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, resetBookingSuccess } = appointmentSlice.actions
export default appointmentSlice.reducer
