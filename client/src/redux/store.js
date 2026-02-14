import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import doctorReducer from './slices/doctorSlice'
import appointmentReducer from './slices/appointmentSlice'
import adminReducer from './slices/adminSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    doctor: doctorReducer,
    appointment: appointmentReducer,
    admin: adminReducer,
  },
})
