import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { CustomerResumeHistorialDisabled } from "../../../../../app/models/customer-resume-model";
import { dateUTCToFriendly } from "../../../../../utils/date.utils";

export default function CustomerShutDownHistory({history} : {history: CustomerResumeHistorialDisabled[]}) {
  return (
    <>
      <List>
        {history.map((historyItem) => {
          return (
            <ListItem key={historyItem._id}>
              <ListItemText>
                {historyItem.motive}
                <Typography variant="h6">
                  {dateUTCToFriendly(historyItem.date)}
                </Typography>
              </ListItemText>
            </ListItem>
          )
        })}
      </List>
    </>
  );
}