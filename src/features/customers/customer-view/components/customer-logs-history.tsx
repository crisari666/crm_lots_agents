import { Button, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from "@mui/material";
import React from "react";
import { SituationInterface } from "../../../../app/models/situation-interface";
import { CustomerLogSituationsI } from "../../../../app/models/customer-logs.inteface";
import { dateUTCToFriendly } from "../../../../utils/date.utils";
import { useAppDispatch } from "../../../../app/hooks";
import { zoomImageCustomerAct } from "../customer-view.slice";
import { Image } from "@mui/icons-material";

export default function CustomerLogsHistory({customerLogs} : {customerLogs: CustomerLogSituationsI[]}) {
  const dispatch = useAppDispatch()
 
  return(
    <>
      <Typography variant="h6">Historial</Typography>
      <List>
        {customerLogs.map((log, index) => (
          <ListItem key={log._id}>
            <ListItemText
              primary={(log.situation as SituationInterface).title}
              secondary={<React.Fragment>
                <strong>{log.note}</strong>
                {` | ${dateUTCToFriendly( log.date)}`}
              </React.Fragment>}
            />
            <ListItemSecondaryAction>
              <Button variant="outlined" disabled={!log.image} onClick={() => dispatch(zoomImageCustomerAct(log.image!))}> <Image/> </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </>
  )
}