import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, FormControlLabel, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Switch } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from "react";
import { getOfficesThunk } from "../../offices/offices-list/offices-list.slice";
import { addOfficeToCollectorThunk, displayCollectorOfficesDialogAct, removeOfficeFromCollectorThunk } from "../slice/collectors.slice";
export default function CollectorOfficesDialog() {
  const dispatch = useAppDispatch()
  const { offices, gotOffices } = useAppSelector((state) => state.offices) 
  const { showCollectorOfficesDialgo, collectorOfficesDialog } = useAppSelector((state) => state.collectors) 

  const {offices: addedOffices = [], collectorId} = collectorOfficesDialog
  

  useEffect(() => {
    if(!gotOffices) dispatch(getOfficesThunk())
  },[])

  const officeOptions = offices.filter((o) => o.enable === true);

  const closeDialog = () => dispatch(displayCollectorOfficesDialogAct(false))

const toggleCollectorOffice = ({add, officeId} : {officeId: string, add: boolean}) => {
    if(add) {
      dispatch(addOfficeToCollectorThunk({officeId, collectorId}))
    } else {
      dispatch(removeOfficeFromCollectorThunk({officeId, collectorId}))
    }
  }
  return (
    <>
      <Dialog open={showCollectorOfficesDialgo}>
        <IconButton onClick={closeDialog} className="closeDialog"> <Close  /></IconButton>
        <DialogTitle> Asignar oficinas a cobrador </DialogTitle>
        <DialogContent sx={{minWidth: 500}}>
            <List>
              {officeOptions.map((o, i) => (
                <ListItem key={`officeList${o._id!}`}>
                  <ListItemText> {o.name} </ListItemText>
                  <ListItemSecondaryAction >
                    <FormControlLabel control={<Switch checked={addedOffices.includes(o._id!)} onChange={(e, c) => toggleCollectorOffice({add: c, officeId: o._id!}) }/>} label="Off/On"/>
                  </ListItemSecondaryAction >
              </ListItem>
              ))}
            </List>
        </DialogContent>
      </Dialog>
    </>
  )
}