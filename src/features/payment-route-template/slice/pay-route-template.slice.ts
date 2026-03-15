import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { TypePercentageEnum } from "../../user-percentage/slice/users-percentage.state"

type LabelOption = { label: string; value?: string }

export type PaymentRouteTemplateFormState = {
  title: string
  collector: LabelOption
  worker: LabelOption
  leadWorker: LabelOption
  officeLead: LabelOption
}

export type PaymentRouteTemplateState = {
  loading: boolean
  paymentRouteTemplateForm: PaymentRouteTemplateFormState
  showDialogPickPercentage: boolean
  typePercentageToPick: TypePercentageEnum
}

const initialForm: PaymentRouteTemplateFormState = {
  title: "",
  collector: { label: "" },
  worker: { label: "" },
  leadWorker: { label: "" },
  officeLead: { label: "" }
}

const initialState: PaymentRouteTemplateState = {
  loading: false,
  paymentRouteTemplateForm: initialForm,
  showDialogPickPercentage: false,
  typePercentageToPick: TypePercentageEnum.empty
}

const slice = createSlice({
  name: "paymentRouteTemplate",
  initialState,
  reducers: {
    changeTitleTemplateFormAct: (state, action: PayloadAction<string>) => {
      state.paymentRouteTemplateForm.title = action.payload
    },
    setTypePercentageToPickAct: (state, action: PayloadAction<TypePercentageEnum>) => {
      state.typePercentageToPick = action.payload
    },
    showDialogPickPercentageAct: (state, action: PayloadAction<boolean>) => {
      state.showDialogPickPercentage = action.payload
    }
  }
})

export const { changeTitleTemplateFormAct, setTypePercentageToPickAct, showDialogPickPercentageAct } = slice.actions
export default slice.reducer
