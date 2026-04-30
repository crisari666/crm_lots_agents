import { createBrowserRouter } from "react-router-dom"
import UsersList from "../features/users-list/users-list-view"
import SignInView from "../features/signin/signin"
import LogoutView from "../features/logout/logout"
import OfficesListView from "../features/offices/offices-list/offices-list-view"
import HandleOfficeView from "../features/offices/handle-office/handle-office-view"
import CustomerListView from "../features/customers/customers-list/customers-list-view"
import CustomerView from "../features/customers/customer-view/customer-view"
import ClientTypeUpdateView from "../features/customer-situations/client-situations/client-situations-view"
import CurrentCampaignView from "../features/campaigns/current-campaign/current-campaign-view"
import CampaignLeadView from "../features/campaigns/campaign-lead/campaign-lead-view"
import ImportNumbersView from "../features/customers/import-numbers/import-numbers-view"
import DashboardView from "../features/dashboard/dashboard-view"
import { HandleUserView } from "../features/handle-user/handle-user-view"
import ImportUsersPage from "../features/import-users/import-users-page"
import ReportsView from "../views/reports-view"
import EventGatewayView from "../views/event-gateway.view"
import CustomerCenterView from "../views/customer-center-view"
import LeadsAuditoryView from "../views/leads-auditory-view"
import OfficeDashboardView from "../views/office-dashboard-view"
import StepsView from "../views/steps-view"
import CustomerDatabaseView from "../views/customer-database-view"
import FaceAuthView from "../views/face-auth-view"
import FaceAuthFaceDetection from "../views/face-auth-face-detection"
import CustomerStepsLogView from "../views/customer-steps-log-view"
import AuditResumeView from "../views/auditory-resume-view"
import UserDocumentsView from "../views/user-documents-view"
import CustomersActivesSnapShotsView from "../views/customers-actives-snap-shot-view"
import UsersWithoutCustomersView from "../views/users-without-customers.view"
import DownloadPaymentView from "../views/download-payment-view"
import DownloadPayHistoryView from "../views/download-pays-history-view"
import HandleExpensesView from "../features/handle-expenses/handle-expenses"
import CalculatorMultiplePaysView from "../views/calculator-view"
import DashboardContent from "../views/dashboard-view"
import QrArriveView from "../views/qr-arrive-view"
import SettingsView from "../views/settings-view"
import TwilioNumbersView from "../views/twilio-numbers-view"
import OfficeLevelView from "../views/office-level-view"
import VerifyPaymentsView from "../views/verify-payments-view"
import HandlePlaymentView from "../views/handle-payment-view"
import StepByWeekReportsView from "../views/steps-by-weeks-report-view"
import UsersGoalsView from "../views/user-goals-view"
import AlertedPaymentsView from "../views/alerted-payments-view"
import CampaignCustomersView from "../views/campaign-customers-view"
import CustomersCheckView from "../views/customers-chek-view"
import ArrivalHistoryView from "../views/arrival-history-view"
import AuditsPage from "../views/audits-page"
import WorkerPaymentsView from "../views/worker-payments-view"
import ProjectListPage from "../features/project/pages/project-list-page"
import CreateProjectPage from "../features/project/pages/create-project-page"
import EditProjectPage from "../features/project/pages/edit-project-page"
import AlertsView from "../views/alerts-view"
import LeadAlertsView from "../views/lead-alerts-view"
import UsersOnboardingStatusView from "../features/users-onboarding-status/users-onboarding-status-view"
import TrainingTrakingPage from "../features/training-traking/pages/training-traking-page"
import CustomersPage from "../features/customer-v2/pages/customers-page"
import CustomersCallLogsPage from "../features/customer-v2/pages/customers-call-logs-page"
import CustomersEventsPage from "../features/customer-v2/pages/customers-events-page"
import StepsV2Page from "../features/steps-v2/pages/steps-v2-page"
import ProjectReleasesPage from "../features/project-release/pages/project-releases-page"
import SignedContractView from "../features/signed-contract/signed-contract-view"
import SignupCampaignView from "../features/signup-campaign/signup-campaign-view"
import CeoLeadsResumePage from "../features/ceo-operations-summary/pages/ceo-leads-resume-page"
import StaffPerformanceReportPage from "../features/staff-performance-report/pages/staff-performance-report-page"
import ReferralFollowUpPage from "../features/referral-follow-up/pages/referral-follow-up-page"


const router = createBrowserRouter([
  { path: "/", element: <SignInView /> },
  { path: "", element: <SignInView /> },
  { path: "/login", element: <SignInView /> },
  { path: "/logout", element: <LogoutView /> },
  {
    path: "/dashboard",
    element: <DashboardView />,
    children: [

    //Campaigns
    { path: "", element: <DashboardContent /> },
    { path: "campaign", element: <CurrentCampaignView /> },
    { path: "lead-campaign", element: <CampaignLeadView /> },

    //Reports
    { path: "reports", element: <ReportsView /> },
    { path: "handle-payment", element: <HandlePlaymentView /> },

    //Type Setup
    { path: "situations", element: <ClientTypeUpdateView /> },


    //Numbers / ClientesV2
    { path: "numbers", element: <CustomerListView /> },
    { path: "customers-v2", element: <CustomersPage /> },
    { path: "customers-v2/call-logs", element: <CustomersCallLogsPage /> },
    { path: "customers-v2/events", element: <CustomersEventsPage /> },
    { path: "steps-v2", element: <StepsV2Page /> },
    { path: "staff-performance", element: <StaffPerformanceReportPage /> },
    { path: "customer/:customerId", element: <CustomerView /> },
    { path: "imports-numbers", element: <ImportNumbersView /> },
    { path: "customers-center", element: <CustomerCenterView /> },
    { path: "leads-auditory", element: <LeadsAuditoryView /> },
    { path: "office-dashboard/:officeId", element: <OfficeDashboardView /> },
    { path: "customers-database", element: <CustomerDatabaseView /> },
    { path: "steps", element: <StepsView /> },
    { path: "step-logs", element: <CustomerStepsLogView /> },
    { path: "audit-resume", element: <AuditResumeView /> },
    { path: "documents", element: <UserDocumentsView /> },
    { path: "user-actives-snap-shot", element: <CustomersActivesSnapShotsView /> },
    { path: "twilio-numbers", element: <TwilioNumbersView/> },
    { path: "users-goal-view", element: <UsersGoalsView/> },
    { path: "alerted-payments", element: <AlertedPaymentsView/> },
    { path: "check-customers", element: <CustomersCheckView/> },
    { path: "projects", element: <ProjectListPage /> },
    { path: "project-releases", element: <ProjectReleasesPage /> },
    { path: "create-project", element: <CreateProjectPage /> },
    { path: "edit-project/:projectId", element: <EditProjectPage /> },
    { path: "traninng-traking", element: <TrainingTrakingPage /> },
    
    //Payments
    { path: "worker-payments", element: <WorkerPaymentsView/> },
    { path: "download-payment", element: <DownloadPaymentView/> },
    { path: "download-pays-history", element: <DownloadPayHistoryView/> },
    { path: "users-with-not-customer", element: <UsersWithoutCustomersView/> },
    
    //Offices
    { path: "offices-list", element: <OfficesListView /> },
    { path: "handle-office", element: <HandleOfficeView /> },
    { path: "handle-office/:officeId", element: <HandleOfficeView /> },
    { path: "office-levels", element: <OfficeLevelView /> },
    { path: "campaign-customers", element: <CampaignCustomersView /> },
    { path: "user-log-arrive", element: <ArrivalHistoryView /> },
    
    //Socket
    { path: "events-gateway", element: <EventGatewayView /> },
    { path: "face-auth", element: <FaceAuthView /> },
    { path: "face-auth-cam-face", element: <FaceAuthFaceDetection /> },
    { path: "log-arrive", element: <QrArriveView /> },
    { path: "settings", element: <SettingsView /> },
    { path: "steps-week-stats", element: <StepByWeekReportsView /> },

    
    //Raffles
    { path: "audits", element: <AuditsPage /> },
    { path: "alerts", element: <AlertsView /> },
    { path: "lead-alerts", element: <LeadAlertsView /> },
    { path: "ceo-leads-resume", element: <CeoLeadsResumePage /> },
    
    //User
    { path: "handle-user", element: <HandleUserView /> },
    { path: "handle-user/:userId", element: <HandleUserView /> },
    { path: "users", element: <UsersList /> },
    { path: "users/referral-follow-up", element: <ReferralFollowUpPage /> },
    { path: "import-users", element: <ImportUsersPage /> },
    { path: "users-onboarding-status", element: <UsersOnboardingStatusView /> },
    { path: "signed-contracts", element: <SignedContractView /> },
    { path: "signup-campaigns", element: <SignupCampaignView /> },


    { path: "expenses", element: <HandleExpensesView /> },
    { path: "calculator", element: <CalculatorMultiplePaysView /> },
    { path: "verify-payments", element: <VerifyPaymentsView /> },

      // { path: "create-card", element: <HandleCard /> },
      // { path: "cards-lists", element: <CardsList /> },
      // { path: "cards-lists/:userId", element: <CardsList /> },
      // { path: "cards-history", element: <HistoryCards /> },
      // { path: "closure", element: <ClosureView /> },
      // { path: "closure/:userId", element: <ClosureView /> },
      // { path: "capital-contribute", element: <CapitalContribute /> },
      // { path: "cards-lists/:userId", element: <CardsList /> },
      // { path: "handle-card/:cardId", element: <HandleCard /> },
    ],
  },
])

export default router
