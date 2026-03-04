import { Cancel, Check, Edit } from "@mui/icons-material"
import { Button, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, ListItem, Typography } from "@mui/material"
import { useState }  from "react"

export function CardResumeHeadItemComponent({
  keyId,
  value,
  label,
}: {
  keyId: string
  value: any
  label: string
}) {
  const [showEdit, setShowEdit] = useState(false)
  const [editing, setEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  const onEdit = () => setShowEdit(true)
  const offEdit = () => setShowEdit(false)
  const turnOnEditing = () => setEditing(true)
  const turnOffEditing = () => setEditing(false)
  const changeInput = (e: any) => setInputValue(e.target.value)
  return (
    <ListItem onMouseOver={onEdit} onMouseLeave={offEdit}>
      <Grid container width={"100%"} justifyContent={"space-between"} alignItems={"center"}>
        <Grid display={"flex"} item xs={10}>
          {!editing && <>
            <Typography variant="body1">{label}</Typography>
            <Typography variant="body1" marginLeft={2}>
              {value.toString()}
            </Typography>
          </>}
          {editing && <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor={label}>{label}</InputLabel>
          <Input fullWidth size="small" id={label} value={inputValue} onChange={changeInput}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => {turnOffEditing(); offEdit()}}> <Check /> </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
          }
        </Grid>
        <Grid item xs={2}>
          {!editing && showEdit && <Button  size="small" sx={{ padding: "0" }} onClick={turnOnEditing}> <Edit fontSize="small"/> </Button>}
          {editing && <Button size="small" sx={{ padding: "0" }} onClick={turnOffEditing}> <Cancel fontSize="small"/> </Button>}
        </Grid>
      </Grid>
    </ListItem>
  )
}