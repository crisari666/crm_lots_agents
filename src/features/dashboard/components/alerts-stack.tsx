import ModalAlertComponent from "../../../app/components/modal-alert-component"
import { useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"

export default function AlertsStack() {
  const { alerts } = useAppSelector((state: RootState) => state.dashboard)
  return (
    <>
       {alerts.map((el, i) => {
          return (
            <ModalAlertComponent
              key={"Alert999" + i}
              title={el.title}
              description={el.message}
              index={i}
              modalAlertState={el}
            />
          )
        })}
    </>
  )
}