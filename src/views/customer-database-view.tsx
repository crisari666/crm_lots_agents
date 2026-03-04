import { ThemeProvider } from "@emotion/react";
import CustomersDisabledList from "../features/customers-database/components/customers-disabled-list";
import CustomersDisabledOfficesCampaigns from "../features/customers-database/components/offices-campaigns";
import { customersDisabledtheme } from "../features/customers-database/components/customers-disabled-theme";
import CustomerResumeDialog from "../features/customers/customer-view/components/customer-resume-dialog";
import CustomerDatabaseFilter from "../features/customers-database/components/customer-database-filter";

export default function CustomerDatabaseView() {
  return (
    <ThemeProvider theme={customersDisabledtheme}>
      <CustomerResumeDialog />
      <CustomerDatabaseFilter />
      <CustomersDisabledList />
      <CustomersDisabledOfficesCampaigns/>
    </ThemeProvider>
  )
}