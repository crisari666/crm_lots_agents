import { CustomersActivesRowType } from "../../features/users-actives-snap-shot/business-logic/customers-actives-snap-shot.state";
import Api from "../axios";
import { UserWithNotCustomerResultType, WeekUserWithNotCustomersType } from "../models/users-withnot-customer-by-week.type";

export async function fetchSnapShotCustomersActivesByDateReq({date} : {date : string}): Promise<CustomersActivesRowType[]>{
  try {
    const api = Api.getInstance()
    console.log({date});
    
    const response = await api.get({path: `cron-jobs/snapshot-history/${date}`})
    console.log('fetchSnapShotCustomersActivesByDate', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON fetchSnapShotCustomersActivesByDate');
    console.error({error});
    throw error;
  }
}

export async function getUsersWithoutCustomersWeeksReq(): Promise<WeekUserWithNotCustomersType[]>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `cron-jobs/report-users-without-new-customers`})
    console.log('usersWithoutCustomersList', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON usersWithoutCustomersList');
    console.error({error});
    throw error;
  }
}

export async function getUsersWithoutCustomersByWeekReq(reportId: string): Promise<UserWithNotCustomerResultType | undefined>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `cron-jobs/get-report-users-without-new-customers/${reportId}`})
    console.log('getUsersWithoutCustomersByWeek', {response});
    const { error } = response
    if(error == null) {
      return response.result.length > 0 ? response.result[0] : undefined
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getUsersWithoutCustomersByWeek');
    console.error({error});
    throw error;
  }
}