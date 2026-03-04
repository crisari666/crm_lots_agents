export type DateRegularFilterType = {
  startDate: string
  endDate: string
  office?: string
  user?: string
}

export type StepGraphWeekFilter = DateRegularFilterType & {
  step: string
}