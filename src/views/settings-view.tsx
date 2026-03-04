import { useAppDispatch, useAppSelector } from "../app/hooks"
import SettingFormDialog from "../features/settings/components/setting-form-dialog"
import SettingsControls from "../features/settings/components/settings-controls"
import SettingsList from "../features/settings/components/settings-list"

export default function SettingsView() {
  const dispatch = useAppDispatch()
  const {} = useAppSelector((state) => state.settings) 
  return (
    <>
      <SettingsControls/>
      <SettingFormDialog/>
      <SettingsList/>
    </>
  )
}