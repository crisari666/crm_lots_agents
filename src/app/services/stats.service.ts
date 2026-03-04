import moment from "moment";
import { StepByWeekGraph, StepMatrixType } from "../../features/statistics/store/statistics.state";
import Api from "../axios";
import { StepGraphWeekFilter } from "../models/date-regular-filter-type";
import { OfficeInterface } from "../models/office.inteface";

export async function getStepStatsReq({stepId, office, period, userId} : {stepId : string, userId: string, office: string, period: "day" | "week" | "month"}): Promise<StepMatrixType>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `steps/step-statistics/${stepId}`, data: { office, period, userId }})
    const { error } = response
    if(error == null) {
      const x = [], y = [];
      for (const el of response.result) {
        x.push(new Date(el.date))
        y.push(el.count)
      }
      return {x, y}
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON get');
    console.error({error});
    throw error;
  }
}

export async function graphPaymentsReq(p : {startDate: string, endDate: string, office: string, userId: string}): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `reports/graphic-payments`, data: {...p, user: p.userId}})
    const { error } = response
    if(error == null) {
      let projected = 0
      let projectedIrregular = 0
      let payed = 0
      let payedIrregular = 0
      let confirmed = 0
      let downloaded = 0
      for (const el of response.result) {
        if(el.paymentAlerted) {
          projectedIrregular += Number(el.valueExpected)
          payedIrregular += Number(el.valuePayed)
        }else {
          projected += Number(el.valueExpected)
          payed += Number(el.valuePayed)
        }
        confirmed += Number(el.fees.reduce((previous: any, current: any) => (current.trusted ? previous + Number(current.value) : previous), 0))
        downloaded += Number(el.fees.reduce((previous: any, current: any) =>   (current.downloaded ? previous + Number(current.value) : previous), 0))
      }
      return [{projected, payed, confirmed, downloaded, projectedIrregular, payedIrregular}]
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON graphPaymentsReq');
    console.error({error});
    throw error;
  }
}

export async function graphPayedReq(p : {startDate: string, endDate: string, office: string, userId: string}): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `reports/graphic-payed`, data: {...p, user: p.userId}})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON graphPaymentsReq');
    console.error({error});
    throw error;
  }
}

export async function stepsByWeeksGraphReq({endDate, office, step, startDate, offices} : StepGraphWeekFilter & {offices: OfficeInterface[]}): Promise<{groups: string[],   data: StepByWeekGraph[]}>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `steps/step-weeks-report`, data: {endDate, office, step, startDate}})
    const groups = []
    const officesData: any = [];
    for await(const el of response.result) {
      const {year, week, offices } = el
      const dMoment = moment().day('Monday').year(year).week(week);
      const officeGroup: any = {}      
      for await(const office of offices) {
        officeGroup[office.office] = office.count
      }
      groups.push(`${dMoment.format('YYYY-MM-DD')} - ${dMoment.add(6, 'days').format('YYYY-MM-DD')}`)
      officesData.push(officeGroup)
    }
    const { error } = response
    if(error == null) {
      return {groups, data: officesData}
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON stepsByWeeksGraph');
    console.error({error});
    throw error;
  }
}