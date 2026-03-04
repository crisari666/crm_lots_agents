import { List, ListItem, ListItemText, ListSubheader } from "@mui/material";
import { UserSimpleType } from "../../../app/models/users-withnot-customer-by-week.type";

export default function UsersListsWithOrWithoutCustomers({users} : {users: UserSimpleType[]}) {
  return(<>
    <List dense sx={{maxHeight: 600, overflowY: 'scroll'}}>
      <ListSubheader>
        N: {users.length}
      </ListSubheader>
      {users.map(u => 
        <ListItem key={u._id}> 
          <ListItemText
            primary={`${u.name} [${u.email}]`}
            secondary={u.office.name}
          />
        </ListItem>
      )}
    </List>
  </>)

}