import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import {
  connectCoachCall,
  destroyCoachDevice,
  disconnectCoachCall,
  registerCoachDevice,
  setCoachMuted,
  type CoachConnectionPhase,
} from "../lib/twilio-coach-runtime"
import {
  fetchActiveLiveCalls,
  fetchCoachSession,
  fetchCoachVoipToken,
} from "../services/voip-live-calls.http"
import { sendVoiceCoachNote } from "../services/voice-coaching.http"
import type { ActiveLiveCallItem, CoachSessionResult } from "../services/voip-live-calls.types"

type LiveCallsState = {
  items: ActiveLiveCallItem[]
  loading: boolean
  error: string | null
  selectedCallSid: string | null
  coachSession: CoachSessionResult | null
  coachPhase: CoachConnectionPhase
  coachError: string | null
  coachMuted: boolean
  noteSending: boolean
  noteError: string | null
}

const initialState: LiveCallsState = {
  items: [],
  loading: false,
  error: null,
  selectedCallSid: null,
  coachSession: null,
  coachPhase: "idle",
  coachError: null,
  coachMuted: false,
  noteSending: false,
  noteError: null,
}

export const fetchActiveLiveCallsThunk = createAsyncThunk(
  "liveCalls/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchActiveLiveCalls()
    } catch (e: unknown) {
      const status = (e as { response?: { status?: number } })?.response?.status
      if (status === 401) {
        return rejectWithValue(
          "No autorizado: inicia sesión como admin y verifica OFFICE_BACKEND_URL en el servidor VoIP."
        )
      }
      const msg = e instanceof Error ? e.message : "Error al cargar llamadas activas"
      return rejectWithValue(msg)
    }
  }
)

export const joinCoachCallThunk = createAsyncThunk(
  "liveCalls/joinCoach",
  async (
    params: { callSid: string; supervisorUserId: string },
    { rejectWithValue }
  ) => {
    try {
      const session = await fetchCoachSession(params.callSid)
      const token = await fetchCoachVoipToken(params.supervisorUserId)
      await registerCoachDevice(token)
      await connectCoachCall({
        conferenceName: session.conferenceName,
        agentCallSid: session.agentCallSid,
        supervisorId: params.supervisorUserId,
        mode: "coach",
      })
      return session
    } catch (e) {
      await destroyCoachDevice()
      const msg = e instanceof Error ? e.message : "No se pudo unir al coaching"
      return rejectWithValue(msg)
    }
  }
)

export const leaveCoachCallThunk = createAsyncThunk("liveCalls/leaveCoach", async () => {
  disconnectCoachCall()
  await destroyCoachDevice()
})

export const sendCoachNoteThunk = createAsyncThunk(
  "liveCalls/sendNote",
  async (params: {
    callSid: string
    agentUserId: string
    message: string
    supervisorName?: string
  }) => {
    await sendVoiceCoachNote(params)
    return params.message
  }
)

const liveCallsSlice = createSlice({
  name: "liveCalls",
  initialState,
  reducers: {
    selectLiveCall(state, action: PayloadAction<string | null>) {
      state.selectedCallSid = action.payload
      state.coachSession = null
      state.coachError = null
    },
    setCoachPhase(state, action: PayloadAction<CoachConnectionPhase>) {
      state.coachPhase = action.payload
    },
    setCoachMutedState(state, action: PayloadAction<boolean>) {
      state.coachMuted = action.payload
      setCoachMuted(action.payload)
    },
    clearCoachErrors(state) {
      state.coachError = null
      state.noteError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveLiveCallsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchActiveLiveCallsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchActiveLiveCallsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = String(action.payload ?? action.error.message ?? "Error al cargar llamadas activas")
      })
      .addCase(joinCoachCallThunk.pending, (state) => {
        state.coachPhase = "connecting"
        state.coachError = null
      })
      .addCase(joinCoachCallThunk.fulfilled, (state, action) => {
        state.coachSession = action.payload
        state.coachPhase = "open"
      })
      .addCase(joinCoachCallThunk.rejected, (state, action) => {
        state.coachPhase = "error"
        state.coachError = String(action.payload ?? action.error.message ?? "Error")
      })
      .addCase(leaveCoachCallThunk.fulfilled, (state) => {
        state.coachPhase = "idle"
        state.coachSession = null
        state.coachMuted = false
      })
      .addCase(sendCoachNoteThunk.pending, (state) => {
        state.noteSending = true
        state.noteError = null
      })
      .addCase(sendCoachNoteThunk.fulfilled, (state) => {
        state.noteSending = false
      })
      .addCase(sendCoachNoteThunk.rejected, (state, action) => {
        state.noteSending = false
        state.noteError = action.error.message ?? "No se pudo enviar la nota"
      })
  },
})

export const { selectLiveCall, setCoachPhase, setCoachMutedState, clearCoachErrors } =
  liveCallsSlice.actions

export default liveCallsSlice.reducer
