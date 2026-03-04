import { createBrowserRouter } from "react-router-dom"
import UsersList from "../features/users-list/users-list-view"
import SignInView from "../features/signin/signin"
import LogoutView from "../features/logout/logout"
import HandleRaffleView from "../features/raffles/handle-raffle-view"
import RafflesView from "../features/raffles-list/raffles-list-view"
import OfficesListView from "../features/offices/offices-list/offices-list-view"
import HandleOfficeView from "../features/offices/handle-office/handle-office-view"
import CustomerListView from "../features/customers/customers-list/customers-list-view"
import CustomerView from "../features/customers/customer-view/customer-view"
import ClientTypeUpdateView from "../features/customer-situations/client-situations/client-situations-view"
import CurrentCampaignView from "../features/campaigns/current-campaign/current-campaign-view"
import CampaignLeadView from "../features/campaigns/campaign-lead/campaign-lead-view"
import ImportNumbersView from "../features/customers/import-numbers/import-numbers-view"
import DashboardView from "../features/dashboard/dashboard-view"
import UntrustedPaymentsView from "../features/payments/untrusted-payments/untrusted-payments-view"
import { HandleUserView } from "../features/handle-user/handle-user-view"
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
import CollectorsView from "../views/collectors-view"
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
import PenancesView from "../views/penances-view"
import ArrivalHistoryView from "../views/arrival-history-view"
import AuditsPage from "../views/audits-page"
import WorkerPaymentsView from "../views/worker-payments-view"
import ProjectsView from "../views/projects-view"
import AlertsView from "../views/alerts-view"
import LeadAlertsView from "../views/lead-alerts-view"


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
    { path: "unstrusted-payments", element: <UntrustedPaymentsView /> },
    { path: "handle-payment", element: <HandlePlaymentView /> },

    //Type Setup
    { path: "situations", element: <ClientTypeUpdateView /> },


    //Numbers
    { path: "numbers", element: <CustomerListView /> },
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
    { path: "projects", element: <ProjectsView/> },
    
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
    { path: "penances", element: <PenancesView /> },
    { path: "user-log-arrive", element: <ArrivalHistoryView /> },
    
    //Socket
    { path: "events-gateway", element: <EventGatewayView /> },
    { path: "face-auth", element: <FaceAuthView /> },
    { path: "face-auth-cam-face", element: <FaceAuthFaceDetection /> },
    { path: "log-arrive", element: <QrArriveView /> },
    { path: "settings", element: <SettingsView /> },
    { path: "steps-week-stats", element: <StepByWeekReportsView /> },

    
    //Raffles
    { path: "create-raffle", element: <HandleRaffleView /> },
    { path: "handel-raffle/:raffleId", element: <HandleRaffleView /> },
    { path: "raffles", element: <RafflesView /> },
    { path: "audits", element: <AuditsPage /> },
    { path: "alerts", element: <AlertsView /> },
    { path: "lead-alerts", element: <LeadAlertsView /> },
    
    //User
    { path: "handle-user", element: <HandleUserView /> },
    { path: "handle-user/:userId", element: <HandleUserView /> },
    { path: "users", element: <UsersList /> },
    { path: "collectors", element: <CollectorsView /> },


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
