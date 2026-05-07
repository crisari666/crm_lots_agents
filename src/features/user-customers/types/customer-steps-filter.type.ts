export type CustomerStepsFormFilter = {
  dateStart: string;
  dateEnd: string;
  office?: string;
  step: string;
  excludeDate: boolean;
  [key: string]: unknown;
};
