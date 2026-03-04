/* eslint-disable prettier/prettier */
import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material"
import { CardInterface } from "../../../app/models/card-interface"
import { dateSplitted } from "../../../utils/date.utils"

export default function CardHistoryPayments({ cardData }: { cardData: CardInterface}) {

  return ( 
    <>
      <Card>
        <CardHeader title="Historial de Pagos" />
        <Grid container spacing={2}>
          {cardData.payments!.map((el, i) => {
            const date = dateSplitted(el.date);
            return (
              <Grid key={el._id} item xs={12} md={4} lg={4}>
                <Card>
                  <CardHeader
                    sx={{paddingBottom: "0"}}
                    subheaderTypographyProps={{align: "left"}}
                    titleTypographyProps={{variant: "body1", align: "left"}}
                    title={`Fecha: ${date.date}` }
                    subheader={`Hora: ${date.time}`}
                   />
                  <CardContent sx={{paddingY: "0px"}}>
                    <Typography align="left">
                      ${el.value}
                    </Typography>
                  </CardContent>
                </Card>

              </Grid>
            )
          })}
        </Grid>
      </Card>
    </>
  )
}
