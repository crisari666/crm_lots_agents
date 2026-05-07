import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAuditResumeReq, getUserAuditResumeReq } from "../../app/services/reports.service";
import {
  customerResumeMonolithReq,
  getCustomerCallActionsLogsMonolithReq,
} from "../../app/services/legacy-customer-monolith.service";
import { getCurrenDateUtil } from "../../utils/date.utils";
import { AuditResumeFilter, AuditResumeState } from "./audit-resume.state";

const initialState: AuditResumeState = {
  loading: false,
  auditResume: [],
  currentResumeDate: { endDate: "", startDate: "" },
  auditFormFilter: {
    excludeDate: false,
    startDate: getCurrenDateUtil(),
    endDate: getCurrenDateUtil(),
    officeId: "",
    userId: "",
  },
  auditCustomerCallActions: [],
  auditCustomerResume: undefined,
};

export const fetchAuditCustomerCallActionsThunk = createAsyncThunk(
  "AuditResume/fetchAuditCustomerCallActionsThunk",
  async (params: { readonly customerId: string }) =>
    await getCustomerCallActionsLogsMonolithReq({ customerId: params.customerId }),
);

export const fetchAuditCustomerResumeThunk = createAsyncThunk(
  "AuditResume/fetchAuditCustomerResumeThunk",
  async (params: { readonly customerId: string }) =>
    await customerResumeMonolithReq({ customerId: params.customerId }),
);
export const getAuditResumeThunk = createAsyncThunk( "AuditResume/getAuditResumeThunk", async (params: AuditResumeFilter) =>  await getAuditResumeReq({param: params}))

export const getUserAuditResumeThunk = createAsyncThunk( "AuditResume/getUserAuditResumeThunk", async (params: {userId: string, startDate: string, endDate: string}) => await getUserAuditResumeReq(params))

export const AuditResumeSlice = createSlice({
  name: "AuditResume",
  initialState,
  reducers: {
    changeAuditFormInputAct: (state, action: PayloadAction<{name: string, val: string}>) => {
      state.auditFormFilter[action.payload.name] = action.payload.val
    },
    setCurrentResumeDatesAct: (state, action: PayloadAction<{startDate: string, endDate: string}>) => {
      state.currentResumeDate = action.payload
    },
    closeDialogUserAuditResumeAct: (state) => {
      state.auditUserResume = undefined;
    },
    clearAuditCustomerCallActionsAct: (state) => {
      state.auditCustomerCallActions = [];
    },
    closeAuditCustomerResumeDialogAct: (state) => {
      state.auditCustomerResume = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAuditResumeThunk.fulfilled, (state, action) => {
        state.auditResume = action.payload;
      })
      .addCase(getUserAuditResumeThunk.fulfilled, (state, action) => {
        state.auditUserResume = action.payload;
      })
      .addCase(fetchAuditCustomerCallActionsThunk.fulfilled, (state, action) => {
        state.auditCustomerCallActions = action.payload;
      })
      .addCase(fetchAuditCustomerResumeThunk.fulfilled, (state, action) => {
        state.auditCustomerResume = action.payload;
      });

    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("AuditResume"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("AuditResume"), (state) => {
      state.loading = false
    })
  },
})
export const {
  changeAuditFormInputAct,
  setCurrentResumeDatesAct,
  closeDialogUserAuditResumeAct,
  clearAuditCustomerCallActionsAct,
  closeAuditCustomerResumeDialogAct,
} = AuditResumeSlice.actions;
export default AuditResumeSlice.reducer