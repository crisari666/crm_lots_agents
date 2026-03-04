/* eslint-disable prettier/prettier */
import ListItem from "@mui/material/ListItem"
import Typography from "@mui/material/Typography"

export function CardHeadItemSimple({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <ListItem>
      <Typography variant="body1">{label}</Typography>
      <Typography variant="body1" marginLeft={2}> {value} </Typography>
    </ListItem>
  )
}
