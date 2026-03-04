import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface SliceNameState {
  property: string
}

const initialState: SliceNameState = {
  property: "",
}

export const SliceNameSlice = createSlice({
  name: "SliceName",
  initialState,
  reducers: {
    reducerName: (state, action: PayloadAction<string>) => {
      state.property = action.payload
    },
  },
})

export const { reducerName } = SliceNameSlice.actions

export default SliceNameSlice.reducer
