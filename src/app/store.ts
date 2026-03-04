import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import counterReducer from "../features/counter/counterSlice"
import usersListReducer from "../features/users-list/slice/user-list.slice"
import handleUserSlice from "../features/handle-user/handle-user.slice"
import SigInReducer from "../features/signin/signin.slice"
import dashboardSlice from "../features/dashboard/dashboard.slice"
import handleCardSlice from "../features/handle-card/handle-card.slice"
import cardsListSlice from "../features/cards-list/cards-list.slice"
import handleExpensesSlice from "../features/handle-expenses/handle-expenses.slice"
import addPaymentSlice from "../features/payments/add-payment/add-payment.slice"
import historyCardsSlice from "../features/history-cards/history-cards.slice"
import capitalContributeSlice from "../features/capital-contribute/capital-contribute.slice"
import closureSlice from "../features/closure/closure.slice"
import handleRaffeSlice from "../features/raffles/handle-raffle.slice"
import rafflesListSlice  from "../features/raffles-list/rafles-list.slice"
import officesListSlice from "../features/offices/offices-list/offices-list.slice"
import handleOfficeSlice from "../features/offices/handle-office/handle-office.slice"
import customersSlice from "../features/customers/customers-list/customers.slice"
import customerViewSlice from "../features/customers/customer-view/customer-view.slice"
import clientSituationsSlice from "../features/customer-situations/client-situations/client-situations-slice"
import currentCampaignSlice from "../features/campaigns/current-campaign/current-campaign.slice"
import campaignLeadSlice from "../features/campaigns/campaign-lead/campaign-lead.slice"
import importNumbersSlice from "../features/customers/import-numbers/import-numbers.slice"
import reportsSlice from "../features/reports/reports-view/reports.slice"
import untrustedPaymentsSlice from "../features/payments/untrusted-payments/untrusted-payments.slice"
import eventsGatewaySlice from "../features/event-gateway/events-gateway.slice"
import userSessionsSlice from "../features/user-sessions-logs/slice/user-sessions.slice"
import userCustomerSlice from "../features/user-customers/user-customer.slice"
import customerCenterSlice from "../features/customers-center/customer-center.slice"
import leadsAuditorySlice from "../features/leads-auditory/leads-auditory.slice"
import officeDashboardSlice from "../features/office-dashboard/office-dashboard.slice"
import stepsSlice from "../features/steps/steps.slice"
import imagePreviewSlice from "../features/image-preview/image-preview.slice"
import authFaceSlice from "../features/auth-face/auth-face.slice"
import logArriveSlice from "../features/log-arrive/log-arrive.slice"
import customerStepsLogSlice from "../features/customer-steps-log/customer-steps-log.slice"
import auditResumeSlice from "../features/auditory-resume/audit-resume.slice"
import userActivesSnapShotSlice from "../features/users-actives-snap-shot/business-logic/customers-actives-snap-shot.slice"
import customersActivesSnapShotSlice from "../features/users-actives-snap-shot/business-logic/customers-actives-snap-shot.slice"
import usersWithoutCustomersSlice from "../features/users-without-customers/slice/users-without-customers.slice"
import downloadPaymentSlice from "../features/download-payment/business-logic/download-payment.slice"
import downloadedPaysLogsSlice from "../features/download-payment/business-logic/download-payment-history.slice"
import collectorsSlice from "../features/collectors/slice/collectors.slice"
import statisticsSlice from "../features/statistics/store/statistics.slice"
import qrArriveSlice from "../features/qr-arrived/slice/qr-arrive.slice"
import settingsSlice from "../features/settings/slice/settings.slice"
import twilioNumbersSlice from "../features/twilio-numbers/slice/twilio-numbers.slice"
import customersDatabaseSlice from "../features/customers-database/slice/customers-database.slice"
import OfficesLevelSlice from "../features/offices/office-levels/slice/office-level.slice"
import verifyCustomerPaymentsSlice from "../features/payments/verify-payments/slice/verify-customer-payments.slice"
import handlePaymentSlice from "../features/payments/handle-payment/slice/handle-payment.slice"
import campaignCustomersSlice from "../features/campaigns/campaign-customers/redux/campaign-customers-slice"
import penancesSlice from "../features/penance/slice/penances.slice"
import projectsSlice from "../features/projects/projects.slice"
import alertsSlice from "../features/alerts/alerts.slice"


export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    
    serializableCheck: {
      ignoredActions: ["eventsGatewaySlice/setSocketAct", "CustomersCenter/changeDateFilterAct", "UserCustomersSlice/changeDateRangeUserCustomerResumeAct","UserCustomersSlice/changeDateRangeUserPaymentsAct", "LeadsAuditory/changeDateRangeAct", 'OfficeDashboard/changeFilterCustomersResumeOfficeAct', 'OfficeDashboard/changeFilterPaymentsResumeOfficeAct', 'Statistics/getStepStatsThunk/fulfilled', 'UserList/updateUserConnectedAct', "dashboardSlice/pushAlertAction"],
      ignoredPaths: ["eventsGateway.socket", 'customerCenter.filter', 'userCustomer.customerFilter', 'userCustomer.userPaymentsFilter', 'payload.actions', 'leadsAuditory.filterDate', 'officeDashboard.customersResumeFilter', 'officeDashboard.paymentResumeFilter', 'authFace.descriptorFromBack', 'logArrive.userPickedDescriptor', 'dashboard.alerts', 'statistics.stepGraphData']
    }
  }),
  reducer: {
    counter: counterReducer,
    addPayment: addPaymentSlice,
    alerts: alertsSlice,
    auditResume: auditResumeSlice,
    authFace: authFaceSlice,
    collectors: collectorsSlice,
    campaignCustomers: campaignCustomersSlice,
    currentCampaign: currentCampaignSlice,
    customers: customersSlice,
    customer: customerViewSlice,
    customerActivesSnapShot: customersActivesSnapShotSlice,
    customerCenter: customerCenterSlice,
    customerDatabase: customersDatabaseSlice,
    customerStepsLog: customerStepsLogSlice,
    dashboard: dashboardSlice,
    downloadPayment: downloadPaymentSlice,
    downloadPaysHistory: downloadedPaysLogsSlice,
    eventsGateway: eventsGatewaySlice,
    expenses: handleExpensesSlice,
    //Offices
    handleOffice: handleOfficeSlice,
    handlePayment: handlePaymentSlice,
    handleUser: handleUserSlice,
    imagePreview: imagePreviewSlice,
    importNumbers: importNumbersSlice,
    leadsAuditory: leadsAuditorySlice,
    login: SigInReducer,
    logArrive: logArriveSlice,
    offices: officesListSlice,
    officeCampaign: campaignLeadSlice,
    officeDashboard: officeDashboardSlice,
    officesLevel: OfficesLevelSlice,
    penance: penancesSlice,
    projects: projectsSlice,
    qrArrive: qrArriveSlice,
    situations: clientSituationsSlice,
    statistics: statisticsSlice,
    settings: settingsSlice,
    steps: stepsSlice,
    twilioNumbers: twilioNumbersSlice,
    userCustomer: userCustomerSlice,
    userActivesSnapShot: userActivesSnapShotSlice,
    userSessionLogs: userSessionsSlice,
    users: usersListReducer,
    usersWithoutCustomers: usersWithoutCustomersSlice,
    verifyCustomerPaymentsSlice: verifyCustomerPaymentsSlice,
    
    //Raffle
  //Unused 
    raffle: handleRaffeSlice,
    raflesList: rafflesListSlice,
    untrusted: untrustedPaymentsSlice,
    handleCard: handleCardSlice,
    cardsList: cardsListSlice,
    historyCards: historyCardsSlice,
    capitalContribute: capitalContributeSlice,
    closure: closureSlice,
    
    reports: reportsSlice
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
