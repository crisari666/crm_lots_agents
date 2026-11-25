import SettingFormDialog from "../features/settings/components/setting-form-dialog"
import SettingsChangeHistory from "../features/settings/components/settings-change-history"
import SettingsControls from "../features/settings/components/settings-controls"
import SettingsList from "../features/settings/components/settings-list"

export default function SettingsView() {
  return (
    <>
      <SettingsControls />
      <SettingFormDialog />
      <SettingsList />
      <SettingsChangeHistory />
    </>
  )
}
