import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AlertInterface,
  CreateAlertPayload,
  LeadTeamAlertsItem,
  RespondToAlertPayload,
  VerifyAlertPayload,
  createAlertReq,
  getAgentAlertsReq,
  getAuditorAlertsReq,
  getLeadTeamAlertsReq,
  respondToAlertReq,
  verifyAlertReq,
} from "../../app/services/alerts.service";

export type AlertsPanelData = {
  allAlerts: AlertInterface[]
  pendingAlerts: AlertInterface[]
  resolvedAlerts: AlertInterface[]
  verifiedAlerts: AlertInterface[]
  rejectedAlerts: AlertInterface[]
  alertsPanelOfficeId?: string
}

export interface AlertsState {
  loading: boolean;
  agentAlerts: AlertInterface[];
  leadTeamAlerts: LeadTeamAlertsItem[];
  alertForm: CreateAlertForm;
  alertsPanelOfficeId: string;
  allAlerts: AlertInterface[];
  pendingAlerts: AlertInterface[];
  resolvedAlerts: AlertInterface[];
  verifiedAlerts: AlertInterface[];
  rejectedAlerts: AlertInterface[];
}

export interface CreateAlertForm {
  reason: string;
  description: string;
}

const initialAlertForm: CreateAlertForm = {
  reason: "",
  description: "",
};

const initialState: AlertsState = {
  loading: false,
  agentAlerts: [],
  leadTeamAlerts: [],
  alertForm: initialAlertForm,
  alertsPanelOfficeId: "",
  allAlerts: [],
  pendingAlerts: [],
  resolvedAlerts: [],
  verifiedAlerts: [],
  rejectedAlerts: [],
}

function filterByOffice(
  list: AlertInterface[],
  officeId: string
): AlertInterface[] {
  return officeId ? list.filter((a) => a.agentId.office === officeId) : list
}

export const createAlertThunk = createAsyncThunk(
  "AlertsSlice/createAlertThunk",
  async ({
    clientId,
    data,
  }: {
    clientId: string;
    data: CreateAlertPayload;
  }) => await createAlertReq({ clientId, data })
);

export const getAgentAlertsThunk = createAsyncThunk(
  "AlertsSlice/getAgentAlertsThunk",
  async () => await getAgentAlertsReq()
);

export const getLeadTeamAlertsThunk = createAsyncThunk(
  "AlertsSlice/getLeadTeamAlertsThunk",
  async () => await getLeadTeamAlertsReq()
);

export const respondToAlertThunk = createAsyncThunk(
  "AlertsSlice/respondToAlertThunk",
  async ({
    alertId,
    data,
  }: {
    alertId: string;
    data: RespondToAlertPayload;
  }) => await respondToAlertReq({ alertId, data })
);

export const verifyAlertThunk = createAsyncThunk(
  "AlertsSlice/verifyAlertThunk",
  async ({
    alertId,
    data,
  }: {
    alertId: string;
    data: VerifyAlertPayload;
  }) => await verifyAlertReq({ alertId, data })
)

export const getAuditorAlertsPanelThunk = createAsyncThunk(
  "AlertsSlice/getAuditorAlertsPanelThunk",
  async (_, { getState }): Promise<AlertsPanelData> => {
    const { alertsPanelOfficeId: officeId } = (getState() as { alerts: AlertsState }).alerts
    const all = await getAuditorAlertsReq({})
    const firstOfficeInAlerts =
      all.length > 0
        ? all.find((a) => a.officeId)?.officeId ?? all[0].officeId
        : undefined
    const alertsPanelOfficeId =
      firstOfficeInAlerts && !officeId ? firstOfficeInAlerts : undefined
    const [pending, resolved, verified, rejected] = await Promise.all([
      getAuditorAlertsReq({ status: "PENDING,IN_PROGRESS" }),
      getAuditorAlertsReq({ status: "RESOLVED" }),
      getAuditorAlertsReq({ status: "VERIFIED" }),
      getAuditorAlertsReq({ status: "REJECTED" }),
    ])
    return {
      allAlerts: all,
      pendingAlerts: pending,
      resolvedAlerts: resolved,
      verifiedAlerts: verified,
      rejectedAlerts: rejected,
      ...(alertsPanelOfficeId && { alertsPanelOfficeId }),
    }
  }
)

export const alertsSlice = createSlice({
  name: "AlertsSlice",
  initialState,
  reducers: {
    updateAlertFormAct: (
      state,
      action: PayloadAction<{ key: keyof CreateAlertForm; value: string }>
    ) => {
      state.alertForm[action.payload.key] = action.payload.value;
    },
    resetAlertFormAct: (state) => {
      state.alertForm = initialAlertForm;
    },
    setAlertsPanelOfficeIdAct: (state, action: PayloadAction<string>) => {
      state.alertsPanelOfficeId = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createAlertThunk.fulfilled, (state) => {
        state.alertForm = initialAlertForm;
      })
      .addCase(getAgentAlertsThunk.fulfilled, (state, action) => {
        state.agentAlerts = action.payload;
      })
      .addCase(getLeadTeamAlertsThunk.fulfilled, (state, action) => {
        state.leadTeamAlerts = action.payload;
      })
      .addCase(respondToAlertThunk.fulfilled, (state, action) => {
        const index = state.agentAlerts.findIndex(
          (alert) => alert._id === action.payload._id
        );
        if (index !== -1) {
          state.agentAlerts[index] = action.payload;
        }
      })
      .addCase(verifyAlertThunk.fulfilled, (state, action) => {
        const index = state.agentAlerts.findIndex(
          (alert) => alert._id === action.payload._id
        );
        if (index !== -1) {
          state.agentAlerts[index] = action.payload;
        }
      })
      .addCase(getAuditorAlertsPanelThunk.fulfilled, (state, action) => {
        state.allAlerts = action.payload.allAlerts
        state.pendingAlerts = action.payload.pendingAlerts
        state.resolvedAlerts = action.payload.resolvedAlerts
        state.verifiedAlerts = action.payload.verifiedAlerts
        state.rejectedAlerts = action.payload.rejectedAlerts
        if (action.payload.alertsPanelOfficeId != null) {
          state.alertsPanelOfficeId = action.payload.alertsPanelOfficeId
        }
      })

    builder
      .addMatcher(
        (action) =>
          action.type.endsWith("/pending") &&
          action.type.includes("AlertsSlice"),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/fulfilled") &&
          action.type.includes("AlertsSlice"),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export const {
  updateAlertFormAct,
  resetAlertFormAct,
  setAlertsPanelOfficeIdAct,
} = alertsSlice.actions

export function selectAlertsPanelAllAlerts(state: { alerts: AlertsState }) {
  return filterByOffice(state.alerts.allAlerts, state.alerts.alertsPanelOfficeId)
}

export function selectAlertsPanelPendingAlerts(state: { alerts: AlertsState }) {
  return filterByOffice(state.alerts.pendingAlerts, state.alerts.alertsPanelOfficeId)
}

export function selectAlertsPanelResolvedAlerts(state: { alerts: AlertsState }) {
  return filterByOffice(state.alerts.resolvedAlerts, state.alerts.alertsPanelOfficeId)
}

export function selectAlertsPanelVerifiedAlerts(state: { alerts: AlertsState }) {
  return filterByOffice(state.alerts.verifiedAlerts, state.alerts.alertsPanelOfficeId)
}

export function selectAlertsPanelRejectedAlerts(state: { alerts: AlertsState }) {
  return filterByOffice(state.alerts.rejectedAlerts, state.alerts.alertsPanelOfficeId)
}

export default alertsSlice.reducer
