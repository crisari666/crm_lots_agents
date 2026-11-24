import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { leadAssistantStrings as s } from "../../../i18n/locales/lead-assistant.strings"
import { getLeadAssistantErrorMessage, simulateLeadAgent } from "../services/lead-assistant.http"
import type {
  LeadSimulateResponse,
  LeadSimulatedMessageKind,
  LeadSimulatedOption,
  LeadSimulatedState,
  LeadSimulatorInsights,
} from "../types/lead-assistant.types"

export type SimulatorMessage = {
  readonly id: string
  readonly direction: "inbound" | "outbound"
  readonly kind: LeadSimulatedMessageKind
  readonly body?: string
  readonly options?: readonly LeadSimulatedOption[]
  readonly mediaUrl?: string
}

export type LeadAssistantSimulatorState = {
  open: boolean
  projectId: string
  conversationState: LeadSimulatedState | null
  messages: SimulatorMessage[]
  insights: LeadSimulatorInsights | null
  sending: boolean
  error: string | null
}

const initialState: LeadAssistantSimulatorState = {
  open: false,
  projectId: "",
  conversationState: null,
  messages: [],
  insights: null,
  sending: false,
  error: null,
}

type ThunkState = { leadAssistant: { simulator: LeadAssistantSimulatorState } }

type SendResult = { readonly response: LeadSimulateResponse; readonly requestId: string }

export const sendSimulatorMessageThunk = createAsyncThunk<
  SendResult,
  string,
  { rejectValue: string }
>("leadAssistant/simulator/send", async (message, { getState, requestId, rejectWithValue }) => {
  const { projectId, conversationState } = (getState() as ThunkState).leadAssistant.simulator
  try {
    const response = await simulateLeadAgent({
      message,
      ...(projectId.length > 0 ? { projectId } : {}),
      ...(conversationState != null ? { state: conversationState } : {}),
    })
    return { response, requestId }
  } catch (err) {
    return rejectWithValue(getLeadAssistantErrorMessage(err, s.simulatorError))
  }
})

function clearConversation(state: LeadAssistantSimulatorState): void {
  state.conversationState = null
  state.messages = []
  state.insights = null
  state.error = null
}

const simulatorSlice = createSlice({
  name: "leadAssistantSimulator",
  initialState,
  reducers: {
    openSimulatorAct(state, action: PayloadAction<string | undefined>) {
      state.open = true
      if (action.payload != null && state.projectId.length === 0) {
        state.projectId = action.payload
      }
    },
    closeSimulatorAct(state) {
      state.open = false
    },
    setSimulatorProjectAct(state, action: PayloadAction<string>) {
      state.projectId = action.payload
      clearConversation(state)
    },
    resetSimulatorAct(state) {
      clearConversation(state)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendSimulatorMessageThunk.pending, (state, action) => {
        state.sending = true
        state.error = null
        state.messages.push({
          id: `in-${action.meta.requestId}`,
          direction: "inbound",
          kind: "text",
          body: action.meta.arg,
        })
      })
      .addCase(sendSimulatorMessageThunk.fulfilled, (state, action) => {
        const { response, requestId } = action.payload
        state.sending = false
        state.conversationState = response.state
        state.insights = response.insights
        response.replies.forEach((reply, index) => {
          state.messages.push({
            id: `out-${requestId}-${index}`,
            direction: "outbound",
            kind: reply.kind,
            body: reply.body,
            options: reply.options,
            mediaUrl: reply.mediaUrl,
          })
        })
      })
      .addCase(sendSimulatorMessageThunk.rejected, (state, action) => {
        state.sending = false
        state.error = action.payload ?? s.simulatorError
        state.messages = state.messages.filter(
          (message) => message.id !== `in-${action.meta.requestId}`,
        )
      })
  },
})

export const { openSimulatorAct, closeSimulatorAct, setSimulatorProjectAct, resetSimulatorAct } =
  simulatorSlice.actions

export default simulatorSlice.reducer
