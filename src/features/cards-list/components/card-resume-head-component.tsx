/* eslint-disable prettier/prettier */
import { Card, Grid, List } from "@mui/material"
import { CardInterface } from "../../../app/models/card-interface"
import { CardResumeHeadItemComponent } from "./card-resumt-head-item-component"
import { dateUTCToFriendly } from "../../../utils/date.utils"
import { CardHeadItemSimple } from "./card-head-item-simple"

export default function CardResumeHeadComponent({
  cardData,
}: {
  cardData: CardInterface
}) {
  return (
    <Card>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={6}>
          <Card>
            <List dense={true}>
              <CardHeadItemSimple label="Fecha: " value={dateUTCToFriendly(cardData.date!.toString())} />
              <CardResumeHeadItemComponent keyId="name" value={cardData.name} label="Nombre" />
              <CardResumeHeadItemComponent keyId="address" value={cardData.address} label="Direccion" />
              <CardResumeHeadItemComponent keyId="phone" value={cardData.phone} label="Telefono" />
              <CardResumeHeadItemComponent keyId="ocupation" value={cardData.ocupation} label="Ocupacion" />
              <CardHeadItemSimple label={`Prestamo ${cardData.value}`} value={ `>> Total: ${cardData.total}` } />
            </List>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Card>
            <List dense>
              <CardHeadItemSimple label={`Diario`} value={cardData.dailyPayment} />
              <CardHeadItemSimple label={`Nº de Pagos`} value={cardData.nPayments} />
              {cardData.cardResume !== undefined && <>
                <CardHeadItemSimple label={`Pagado`} value={cardData.cardResume!.payed} />
                <CardHeadItemSimple label={`Pago Nº`} value={cardData.cardResume!.nPayed} />
                <CardHeadItemSimple label={`Pagos pend.`} value={cardData.cardResume!.pendingPayments} />
                <CardHeadItemSimple label={`Restante`} value={cardData.cardResume!.remainingValue} />
              </>}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Card>
  )
}
