import { CollectorType } from "../../../app/models/collector.type"

export type CollectorsState = {
  loading: boolean,
  collectorToEdit?: string
  collectorForm: CollectorForm
  showCollectorForm: boolean
  collectors: CollectorType[]
  showCollectorOfficesDialgo: boolean
  collectorOfficesDialog: CollectorOfficesDialog
  showOnlyEnabled: boolean
}

export enum CollectorLocationEnum {
  co = 'co',
  us = 'us'
}

export type CollectorForm = {
  title: string
  user: string
  limitWeek: number
  limitMonth: number
  limitYear: number
  location: CollectorLocationEnum
  [key: string]: string | number
}

export type CollectorOfficesDialog = {
  offices: string[]
  collectorId: string
}