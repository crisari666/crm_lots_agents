import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import usersListReducer from "../features/users-list/slice/user-list.slice";
import handleUserSlice from "../features/handle-user/handle-user.slice";
import SigInReducer from "../features/signin/signin.slice";
import dashboardSlice from "../features/dashboard/dashboard.slice";
import officesListSlice from "../features/offices/offices-list/offices-list.slice";
import handleOfficeSlice from "../features/offices/handle-office/handle-office.slice";
import eventsGatewaySlice from "../features/event-gateway/events-gateway.slice";
import userSessionsSlice from "../features/user-sessions-logs/slice/user-sessions.slice";
import userCustomerSlice from "../features/user-customers/user-customer.slice";
import officeDashboardSlice from "../features/office-dashboard/office-dashboard.slice";
import stepMetadataReducer from "../features/step-metadata/step-metadata.slice";
import imagePreviewSlice from "../features/image-preview/image-preview.slice";
import authFaceSlice from "../features/auth-face/auth-face.slice";
import logArriveSlice from "../features/log-arrive/log-arrive.slice";
import statisticsSlice from "../features/statistics/store/statistics.slice";
import qrArriveSlice from "../features/qr-arrived/slice/qr-arrive.slice";
import settingsSlice from "../features/settings/slice/settings.slice";
import twilioNumbersSlice from "../features/twilio-numbers/slice/twilio-numbers.slice";
import OfficesLevelSlice from "../features/offices/office-levels/slice/office-level.slice";
import projectsSlice from "../features/project/slice/projects.slice";
import amenitiesSlice from "../features/project/slice/amenities.slice";
import importUsersSlice from "../features/import-users/import-users.slice";
import importCustomersSlice from "../features/import-customers/import-customers.slice";
import usersOnboardingStatusSlice from "../features/users-onboarding-status/slice/users-onboarding-status.slice";
import trainingTrakingSlice from "../features/training-traking/slice/training-traking.slice";
import trainingSessionsReducer from "../features/training-sessions/slice/training-sessions.slice";
import customerV2Reducer from "../features/customer-v2/redux/customer-v2.slice";
import customerCallLogsReducer from "../features/customer-v2/redux/customer-call-logs.slice";
import customerCallAuditReducer from "../features/customer-v2/redux/customer-call-audit.slice";
import customerConversationsReducer from "../features/customer-v2/redux/customer-conversations.slice";
import customerEventsReducer from "../features/customer-v2/redux/customer-events.slice";
import customerAssignmentAuditReducer from "../features/customer-assignment-audit/slice/customer-assignment-audit.slice";
import customerMetaLeadReducer from "../features/customer-v2/redux/customer-meta-lead.slice";
import customerSearchReducer from "../features/customer-v2/redux/customer-search.slice";
import projectReleasesReducer from "../features/project-release/slice/project-releases.slice";
import signedContractReducer from "../features/signed-contract/slice/signed-contract.slice";
import signupCampaignReducer from "../features/signup-campaign/slice/signup-campaign.slice";
import ceoOperationsSummaryReducer from "../features/ceo-operations-summary/slice/ceo-operations-summary.slice";
import onboardingVoiceCallAuditReducer from "../features/onboarding-voice-call-audit/slice/onboarding-voice-call-audit.slice";
import staffPerformanceReportReducer from "../features/staff-performance-report/redux/staff-performance-report.slice";
import referralFollowUpReducer from "../features/referral-follow-up/slice/referral-follow-up.slice";
import leadCandidatesReducer from "../features/lead-candidates/slice/lead-candidates.slice";
import customerPaymentsReducer from "../features/customer-payment/slice/customer-payments.slice";
import userProfileReducer from "../features/user-profile/slice/user-profile.slice";
import whatsappMarketingReducer from "../features/whatsapp-marketing/slice/whatsapp-marketing.slice";

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "eventsGatewaySlice/setSocketAct",
          "UserCustomersSlice/changeDateRangeUserCustomerResumeAct",
          "UserCustomersSlice/changeDateRangeUserPaymentsAct",
          "OfficeDashboard/changeFilterCustomersResumeOfficeAct",
          "OfficeDashboard/changeFilterPaymentsResumeOfficeAct",
          "Statistics/getStepStatsThunk/fulfilled",
          "UserList/updateUserConnectedAct",
          "dashboardSlice/pushAlertAction",
          "referralFollowUp/fetchSituations/pending",
          "customerPayments/create/pending",
          "customerPayments/create/fulfilled",
          "customerPayments/create/rejected",
        ],
        ignoredPaths: [
          "eventsGateway.socket",
          "userCustomer.customerFilter",
          "userCustomer.userPaymentsFilter",
          "payload.actions",
          "officeDashboard.customersResumeFilter",
          "officeDashboard.paymentResumeFilter",
          "authFace.descriptorFromBack",
          "logArrive.userPickedDescriptor",
          "dashboard.alerts",
          "statistics.stepGraphData",
        ],
      },
    }),
  reducer: {
    authFace: authFaceSlice,
    dashboard: dashboardSlice,
    eventsGateway: eventsGatewaySlice,
    handleOffice: handleOfficeSlice,
    handleUser: handleUserSlice,
    imagePreview: imagePreviewSlice,
    importUsers: importUsersSlice,
    importCustomers: importCustomersSlice,
    login: SigInReducer,
    logArrive: logArriveSlice,
    offices: officesListSlice,
    officeDashboard: officeDashboardSlice,
    officesLevel: OfficesLevelSlice,
    projects: projectsSlice,
    projectReleases: projectReleasesReducer,
    amenities: amenitiesSlice,
    qrArrive: qrArriveSlice,
    statistics: statisticsSlice,
    settings: settingsSlice,
    steps: stepMetadataReducer,
    twilioNumbers: twilioNumbersSlice,
    userCustomer: userCustomerSlice,
    userSessionLogs: userSessionsSlice,
    users: usersListReducer,
    usersOnboardingStatus: usersOnboardingStatusSlice,
    trainingTraking: trainingTrakingSlice,
    trainingSessions: trainingSessionsReducer,
    customerV2: customerV2Reducer,
    customerCallLogs: customerCallLogsReducer,
    customerCallAudit: customerCallAuditReducer,
    customerConversations: customerConversationsReducer,
    customerEvents: customerEventsReducer,
    customerAssignmentAudit: customerAssignmentAuditReducer,
    customerMetaLead: customerMetaLeadReducer,
    customerSearch: customerSearchReducer,
    signedContract: signedContractReducer,
    signupCampaign: signupCampaignReducer,
    ceoOperationsSummary: ceoOperationsSummaryReducer,
    onboardingVoiceCallAudit: onboardingVoiceCallAuditReducer,
    staffPerformanceReport: staffPerformanceReportReducer,
    referralFollowUp: referralFollowUpReducer,
    leadCandidates: leadCandidatesReducer,
    customerPayments: customerPaymentsReducer,
    userProfile: userProfileReducer,
    whatsappMarketing: whatsappMarketingReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
