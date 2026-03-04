import { Card, CardHeader, Grid } from "@mui/material"
import { UnpaidInterface } from "../../../app/models/unpaid-interface"
import { dateSplitted } from "../../../utils/date.utils"

export default function CardHistoryUnpaids({
  unpaids,
}: {
  unpaids: UnpaidInterface[]
}) {
  return (
    <>
      <Card>
        <CardHeader title="Historal de pagos no realizados" />
        <Grid container>
          {unpaids.map((el, i) => {
            const date = dateSplitted(el.date)
            return (
              <Grid key={el._id} item xs={12} md={4} lg={4}>
                <Card>
                  <CardHeader
                    sx={{ paddingBottom: "0" }}
                    subheaderTypographyProps={{ align: "left" }}
                    titleTypographyProps={{ variant: "body1", align: "left" }}
                    title={`Fecha: ${date.date}`}
                    subheader={`Hora: ${date.time}`}
                  />
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Card>
    </>
  )
}
