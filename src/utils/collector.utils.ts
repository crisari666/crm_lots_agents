import { SumPaidsCollector } from "../app/models/collector.type";

export function resolveTotalPaid (data: SumPaidsCollector[]) {
  if(!data || data.length === 0) return 0;
  return data[0].total
}

export function resolveColorColletor({percentage} :{percentage: number}): "success" | "warning" | "error" {
  if(percentage < 50) return "success"
  if(percentage < 80) return "warning"
  return "error"
}