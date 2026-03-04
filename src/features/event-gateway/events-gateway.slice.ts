import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { EventsGatewayState } from "./events-gateway.state"

const initialState: EventsGatewayState = {
  socket: undefined,
  showSureHardOff: false
}

export const eventsGatewaySlice = createSlice({
  name: "eventsGatewaySlice",
  initialState,
  reducers: {
    setSocketAct: (state, action: PayloadAction<any>)  => {
     state.socket = action.payload
      //action.payload
    },
    setSureHardOffAct: (state, action: PayloadAction<boolean>) => {
      state.showSureHardOff = action.payload
    }

  },
})

export const { setSocketAct, setSureHardOffAct} = eventsGatewaySlice.actions

export default eventsGatewaySlice.reducer
