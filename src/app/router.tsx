import { createBrowserRouter } from "react-router-dom";
import UsersList from "../features/users-list/users-list-view";
import SignInView from "../features/signin/signin";
import LogoutView from "../features/logout/logout";
import OfficesListView from "../features/offices/offices-list/offices-list-view";
import HandleOfficeView from "../features/offices/handle-office/handle-office-view";
import DashboardView from "../features/dashboard/dashboard-view";
import { HandleUserView } from "../features/handle-user/handle-user-view";
import ImportUsersPage from "../features/import-users/import-users-page";
import ReportsView from "../views/reports-view";
import EventGatewayView from "../views/event-gateway.view";
import LeadsAuditoryView from "../views/leads-auditory-view";
import OfficeDashboardView from "../views/office-dashboard-view";
import FaceAuthView from "../views/face-auth-view";
import FaceAuthFaceDetection from "../views/face-auth-face-detection";
import UserDocumentsView from "../views/user-documents-view";
import UsersWithoutCustomersView from "../views/users-without-customers.view";
import DashboardContent from "../views/dashboard-view";
import QrArriveView from "../views/qr-arrive-view";
import SettingsView from "../views/settings-view";
import TwilioNumbersView from "../views/twilio-numbers-view";
import OfficeLevelView from "../views/office-level-view";
import StepByWeekReportsView from "../views/steps-by-weeks-report-view";
import UsersGoalsView from "../views/user-goals-view";
import ArrivalHistoryView from "../views/arrival-history-view";
import AuditsPage from "../views/audits-page";
import ProjectListPage from "../features/project/pages/project-list-page";
import CreateProjectPage from "../features/project/pages/create-project-page";
import EditProjectPage from "../features/project/pages/edit-project-page";
import UsersOnboardingStatusView from "../features/users-onboarding-status/users-onboarding-status-view";
import TrainingTrakingPage from "../features/training-traking/pages/training-traking-page";
import TrainingSessionsPage from "../features/training-sessions/pages/training-sessions-page";
import CustomersPage from "../features/customer-v2/pages/customers-page";
import CustomersCallLogsPage from "../features/customer-v2/pages/customers-call-logs-page";
import CustomersEventsPage from "../features/customer-v2/pages/customers-events-page";
import StepsV2Page from "../features/steps-v2/pages/steps-v2-page";
import ProjectReleasesPage from "../features/project-release/pages/project-releases-page";
import SignedContractView from "../features/signed-contract/signed-contract-view";
import SignupCampaignView from "../features/signup-campaign/signup-campaign-view";
import CeoLeadsResumePage from "../features/ceo-operations-summary/pages/ceo-leads-resume-page";
import StaffPerformanceReportPage from "../features/staff-performance-report/pages/staff-performance-report-page";
import ReferralFollowUpPage from "../features/referral-follow-up/pages/referral-follow-up-page";
import CustomerPaymentsAuditoryPage from "../features/customer-payment/pages/customer-payments-auditory-page";

const router = createBrowserRouter([
  { path: "/", element: <SignInView /> },
  { path: "", element: <SignInView /> },
  { path: "/login", element: <SignInView /> },
  { path: "/logout", element: <LogoutView /> },
  {
    path: "/dashboard",
    element: <DashboardView />,
    children: [
      { path: "", element: <DashboardContent /> },
      { path: "reports", element: <ReportsView /> },
      { path: "customers-v2", element: <CustomersPage /> },
      { path: "customers-v2/call-logs", element: <CustomersCallLogsPage /> },
      { path: "customers-v2/events", element: <CustomersEventsPage /> },
      { path: "steps-v2", element: <StepsV2Page /> },
      { path: "staff-performance", element: <StaffPerformanceReportPage /> },
      { path: "leads-auditory", element: <LeadsAuditoryView /> },
      { path: "office-dashboard/:officeId", element: <OfficeDashboardView /> },
      { path: "documents", element: <UserDocumentsView /> },
      { path: "twilio-numbers", element: <TwilioNumbersView /> },
      { path: "users-goal-view", element: <UsersGoalsView /> },
      { path: "projects", element: <ProjectListPage /> },
      { path: "project-releases", element: <ProjectReleasesPage /> },
      { path: "create-project", element: <CreateProjectPage /> },
      { path: "edit-project/:projectId", element: <EditProjectPage /> },
      { path: "traninng-traking", element: <TrainingTrakingPage /> },
      { path: "training-sessions", element: <TrainingSessionsPage /> },
      { path: "users-with-not-customer", element: <UsersWithoutCustomersView /> },
      { path: "offices-list", element: <OfficesListView /> },
      { path: "handle-office", element: <HandleOfficeView /> },
      { path: "handle-office/:officeId", element: <HandleOfficeView /> },
      { path: "office-levels", element: <OfficeLevelView /> },
      { path: "user-log-arrive", element: <ArrivalHistoryView /> },
      { path: "events-gateway", element: <EventGatewayView /> },
      { path: "face-auth", element: <FaceAuthView /> },
      { path: "face-auth-cam-face", element: <FaceAuthFaceDetection /> },
      { path: "log-arrive", element: <QrArriveView /> },
      { path: "settings", element: <SettingsView /> },
      { path: "steps-week-stats", element: <StepByWeekReportsView /> },
      { path: "audits", element: <AuditsPage /> },
      { path: "ceo-leads-resume", element: <CeoLeadsResumePage /> },
      { path: "handle-user", element: <HandleUserView /> },
      { path: "handle-user/:userId", element: <HandleUserView /> },
      { path: "users", element: <UsersList /> },
      { path: "users/referral-follow-up", element: <ReferralFollowUpPage /> },
      { path: "import-users", element: <ImportUsersPage /> },
      { path: "users-onboarding-status", element: <UsersOnboardingStatusView /> },
      { path: "signed-contracts", element: <SignedContractView /> },
      { path: "signup-campaigns", element: <SignupCampaignView /> },
      { path: "customer-payments-auditory", element: <CustomerPaymentsAuditoryPage /> },
    ],
  },
]);

export default router;
