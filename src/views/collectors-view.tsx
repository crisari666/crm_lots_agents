import CollectorFormDialog from "../features/collectors/components/collector-form-dialog"
import CollectorOfficesDialog from "../features/collectors/components/collector-offices-dialog"
import CollectorsControls from "../features/collectors/components/collectors-controls"
import CollectorsList from "../features/collectors/components/collectors-list"

export default function CollectorsView() {
  return (
    <>
      <CollectorsControls/>
      <CollectorFormDialog/>
      <CollectorsList/>
      <CollectorOfficesDialog/>
    </>
  )
}