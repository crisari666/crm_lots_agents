import { List, ListItem, ListItemText } from "@mui/material";
import { CustomerResume } from "../../../../../app/models/customer-resume-model";

export default function CustomerResumeData({customerResume} : {customerResume: CustomerResume}) {
  return (
    <>
      {customerResume.customer.length > 0 && <>
        <List>
          <ListItem> <ListItemText primary="Nombre" secondary={customerResume.customer[0].name}/> </ListItem>
          <ListItem> <ListItemText primary="Telefono" secondary={customerResume.customer[0].phone}/> </ListItem>
          <ListItem> <ListItemText primary="Correo" secondary={customerResume.customer[0].email}/> </ListItem>
        </List>
      
      </>}
    </>
  )
}