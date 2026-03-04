import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { AlertPopupStateI } from "../models/alert-popup-interface"
import { removeAlertAction } from "../../features/dashboard/dashboard.slice"
import { useAppDispatch } from "../hooks"

export default function ModalAlertComponent(params: ModalAlertMoleculeParamsI) {
  const { description, index, onClose, title, modalAlertState } = params
  const dispatch = useAppDispatch()

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {" "}
        <DialogContentText>{description}</DialogContentText>{" "}
      </DialogContent>
      <DialogActions>
        <>
          {modalAlertState != undefined &&
            modalAlertState.actions?.map((el, i) => {
              return (
                <Button
                  key={"buttonAlert" + i}
                  color="primary"
                  onClick={() => {
                    if(params.modalAlertState?.closeOnAction) dispatch(removeAlertAction({ index }))
                    el.action(i)
                  }}
                >
                  {el.title}
                </Button>
              )
            })}
          <Button
            color="error"
            onClick={() => {
              dispatch(removeAlertAction({ index }))
            }}
          >
            Close
          </Button>
        </>
      </DialogActions>
    </Dialog>
  )
}

export interface ModalAlertMoleculeParamsI {
  title: string
  index: number
  description: string
  modalAlertState?: AlertPopupStateI
  onClose?: () => any
}
