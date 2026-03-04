import { SituationInterface } from "../../../app/models/situation-interface"

export interface ClientSituaionsState {
  loading: boolean
  showAddForm: boolean
  situations: SituationInterface[]
  situationForm: SituationFormI
  situationForEditId: string
  situationsGot: boolean
}

export interface SituationFormI {
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  order: number
  [key: string]: any
}
