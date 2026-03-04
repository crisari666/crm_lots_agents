import { SettingType } from "../../../app/models/setting.type"

export type SettingsSliceState = {
  settingsGot: boolean,
  loading: boolean,
  settings: SettingType[],
  settingForm: SettingForm,
  showDialog: boolean,
  settingForEdit: string
}

export type SettingForm = {
  title: string,
  type: string,
  value: any,
  [key: string]: any
}
