import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AlertPopupStateI } from "../../app/models/alert-popup-interface"

export interface DashboardState {
  alerts: AlertPopupStateI[]
}

const initialState: DashboardState = {
  alerts: [],
}

export const DashboardSlice = createSlice({
  name: "dashboardSlice",
  initialState,
  reducers: {
    pushAlertAction: (state, action: PayloadAction<AlertPopupStateI>) => {
      state.alerts.push(action.payload)
    },
    removeAlertAction: (state, action: PayloadAction<{ index: number }>) => {
      state.alerts.splice(action.payload.index, 1)
    },
  },
})

export const { pushAlertAction, removeAlertAction } = DashboardSlice.actions

export default DashboardSlice.reducer
