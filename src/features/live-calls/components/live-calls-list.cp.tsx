import LiveCallCoachPanelCP from "./live-call-coach-panel.cp"
import LiveCallsEffectsCP from "./live-calls-effects.cp"
import LiveCallsErrorAlertCP from "./live-calls-error-alert.cp"
import LiveCallsTableCP from "./live-calls-table.cp"
import LiveCallsToolbarCP from "./live-calls-toolbar.cp"

export default function LiveCallsListCP() {
  return (
    <>
      <LiveCallsEffectsCP />
      <LiveCallsErrorAlertCP />
      <LiveCallsToolbarCP />
      <LiveCallsTableCP />
      <LiveCallCoachPanelCP />
    </>
  )
}
