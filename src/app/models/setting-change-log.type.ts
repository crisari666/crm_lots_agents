export type SettingChangeLogAction = "create" | "update"

export type SettingChangeLogType = {
  _id: string
  settingId: string
  action: SettingChangeLogAction
  title: string
  previousType?: string
  previousValue?: unknown
  nextType: string
  nextValue: unknown
  actorUserId: string
  actorEmail: string
  createdAt: string
  updatedAt: string
}
