import { Grid, Typography } from "@mui/material"

export default function ClosureItemComponent({
  label,
  value,
  isRed = false,
}: {
  label: string
  value: string | number
  isRed?: boolean
}) {
  return (
    <Grid container marginY={1}>
      <Grid item xs={6}>
        <Typography
          variant="h6"
          fontWeight={"bold"}
          color={isRed ? "red" : "inherit"}
        >
          {label}
        </Typography>
      </Grid>
      <Grid item xs={6} textAlign={"right"}>
        <Typography variant="h6">{value}</Typography>
      </Grid>
    </Grid>
  )
}
