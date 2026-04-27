import { ProjectLotOption } from "../types/project.types"

/** Keeps only valid purchasable rows (positive area and COP price) for API payloads */
export function projectLotOptionsForApi(rows: ProjectLotOption[]): ProjectLotOption[] {
  return rows
    .map((o) => ({
      area: Math.max(0, Number(o.area) || 0),
      price: Math.max(0, Number(o.price) || 0),
      priceUsd: Math.max(0, Number(o.priceUsd) || 0)
    }))
    .filter((o) => o.area > 0 && o.price > 0)
}
