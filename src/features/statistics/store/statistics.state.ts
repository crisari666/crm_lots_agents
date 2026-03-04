export type StatisticsState = {
  loading: boolean,
  loadingStepStats: boolean,
  stepGraphData: StepMatrixType,
  graphPayments: {projected: number, payed: number, confirmed: number, downloaded: number, projectedIrregular: number, payedIrregular: number}[],
  graphPayed: {totalTrusted: number, totalUntrusted: number, totalPayments: number, totalDownloaded: number}[],
  formStepStats: {
    stepId: string,
    office: string,
    period: "day" | "week" | "month",
    userId: string,
    [key: string]: any,
  },
  stepsByWeeksGraph: any[],
  groupsStepwByWeekGraph: string[]
}


export type StepMatrixType = {
  x: Date[],
  y: number[],
}

export type StepByWeekGraph = {
  "offices": {office: string, count: number}[],
  "year": number,
  "week": number
}