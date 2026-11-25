import { SettingChangeLogType } from "../../../app/models/setting-change-log.type"
import { SettingType } from "../../../app/models/setting.type"

export type SettingsSliceState = {
  settingsGot: boolean
  loading: boolean
  settings: SettingType[]
  settingForm: SettingForm
  showDialog: boolean
  settingForEdit: string
  history: SettingChangeLogType[]
  historyLoading: boolean
  historyError: string | null
}

export type SettingForm = {
  title: string
  type: string
  value: any
  [key: string]: any
}
