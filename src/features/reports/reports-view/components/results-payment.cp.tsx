import { Button, Chip, Grid, IconButton, Switch, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, ThemeProvider, Typography } from "@mui/material"
import DialogConfirmImageFeePayment from "./dialog-confirm-image-fee-payment"
import DialogConfirmPayedFeePayment from "./dialog-confirm-payed-fee-payment"
import { Check, Close, Image, Info, MonetizationOn, Paid, Summarize } from "@mui/icons-material"
import ImagePreviewDialog from "../../../../app/components/image-preview-dialog"
import { useAppSelector, useAppDispatch } from "../../../../app/hooks"
import { FeePaymentsResultI, PaymentRequestI } from "../../../../app/models/fee-payment-result-inteface"
import { RootState } from "../../../../app/store"
import { dateUTCToFriendly } from "../../../../utils/date.utils"
import { numberToCurrency } from "../../../../utils/numbers.utils"
import { setPaymentImagePreviewAct, setFeePaymentConfirmImageDialogAct, setFeePaymentConfirmPayedDialogAct, setCollectorFilterAct } from "../reports.slice"
import { themeCondense } from "../../../../app/themes/theme-condense"
import { useState } from "react"
import CollectorsResumenPaymentsDone from "./collectors-resume-payments-done"

export default function ResultsPaymentsCP() {
  const {filter, feePayments, imagePreviewPayment} = useAppSelector((state: RootState) => state.reports)
  const [filterUnpayed, setFilterunPayed] = useState<Boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [filterUntrusted, setFilterUntrusted] = useState<Boolean>(false)
  const [filterRetained, setFilterRetained] = useState<Boolean>(false)
  const dispatch = useAppDispatch()
  const resolveCustomer = (customer: any): string => {
    if(customer.length === 0) return ""
    return `${customer[0].name} ${customer[0].phone}`
  }

  const resolveUser = (payment: PaymentRequestI): string => {
    if(!payment) return ""
    if(payment.user.length === 0) return ""
    const office = payment.user[0].office[0].name
    return `${payment.user[0].name} [${office}]`
  }

  const filteredPays = (feePayments?? []).filter((f) => {
    let show = true
    if(filterUntrusted && f.trusted) show = false
    if(filterUnpayed &&  f.downloaded) show = false
    if(filter.collector !== undefined && f.collector._id !== filter.collector._id) show = false
    if(filterRetained && !f.retained) show = false
    return show;
  })

  const pending = (filteredPays ?? []).reduce((a, el) => a + (!el.trusted && !el.paymentRequest.anulated ? el.value : 0)   , 0)
  const confirmed = (filteredPays ?? []).reduce((a, el) => a + (el.trusted && !el.paymentRequest.anulated ? el.value : 0)   , 0)
  const payed = (filteredPays ?? []).reduce((a, el) => a + (el.downloaded ? el.value : 0)   , 0)

  const copyToClipboard = (payment: FeePaymentsResultI) => {
    navigator.clipboard.writeText(payment.paymentRequest._id)
  }

  return(
      <ThemeProvider theme={themeCondense}>
        <CollectorsResumenPaymentsDone open={openModal} payments={filteredPays} onClose={() => setOpenModal(false)}/>
         {filter.type === "payments-made" && feePayments !== undefined && <>
        <ImagePreviewDialog image={imagePreviewPayment} onClose={() => dispatch(setPaymentImagePreviewAct(""))}/>
        <DialogConfirmImageFeePayment/>
        <DialogConfirmPayedFeePayment/>
        <Grid container justifyContent={'space-between'}>
          <Grid item>
            <Chip color={filterUntrusted ? 'success' : "default"} variant="outlined"  label="Pagos sin confirmar" onClick={() => setFilterUntrusted(!filterUntrusted)} icon={<Close/>}/>
            <Chip color={filterUnpayed ? 'success' : "default"} variant="outlined" label="Pagos sin cierre" clickable onClick={() => setFilterunPayed(!filterUnpayed)} icon={<Close/>} />
            <Chip color={filterRetained ? 'success' : "default"} variant="outlined" label="Retenidos" clickable onClick={() => setFilterRetained(!filterRetained)} icon={<Close/>} />

            {filter.collector !== undefined && <Chip color="primary" variant="outlined" label={`Cobrador: ${filter.collector?.name ?? "--"}`} icon={<Close/>} onClick={() => dispatch(setCollectorFilterAct(undefined))}/>}
          </Grid>
          <Grid item>
            <Button  onClick={() => setOpenModal(true)} variant="contained">Resumen por cobradores</Button>
          </Grid>
        </Grid>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Pagado</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Cobrador</TableCell>
                <TableCell><Image/></TableCell>
                <TableCell><Check/></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPays.map((pay, i) => (
                <TableRow key={i}>
                  <TableCell sx={{cursor: "pointer"}} onClick={() => copyToClipboard(pay)}> 
                    <Typography variant="body2" color={pay.downloaded ? "green" : "red"}> {pay.downloaded === true ? 'Cuadrado' : "Sin Cuadrar"} </Typography>  
                    <Typography variant="body2" color={pay.retained ? "purple" : ""}> {pay.retained === true ? 'Retenido' : ""} </Typography>  
                  </TableCell>
                  <TableCell sx={{cursor: "pointer"}} onClick={() => copyToClipboard(pay)}>{dateUTCToFriendly(pay.date)}</TableCell>
                  <TableCell>
                    {resolveCustomer(pay.customer)}{' '}
                    {[pay.paymentRequest.anulated ? <Chip size="small" color="secondary" label="Anulado" /> : <></>]}
                    {[pay.retained ? <Chip size="small" sx={{backgroundColor: "orange", color: "white"}} label="Retenido" /> : <></>]}
                  </TableCell>
                  <TableCell>{resolveUser(pay.paymentRequest)}</TableCell>
                  <TableCell>${numberToCurrency(pay.value)}</TableCell>
                  <TableCell>{pay.collector?.title ?? "--"}</TableCell>
                  <TableCell>
                    {!(pay.image == null || !pay.image) && <IconButton  onClick={() => dispatch(setPaymentImagePreviewAct(pay.image))}>
                    <Image color={pay.trusted ? "success" : "error"} /> 
                    </IconButton> }
                    <Switch checked={pay.trusted} disabled={pay.trusted} onClick={() =>dispatch(setFeePaymentConfirmImageDialogAct({feePaymentId: pay._id, value: pay.value, index: i}))} />
                  </TableCell>
                  <TableCell>
                    <Button 
                      onClick={() => dispatch(setFeePaymentConfirmPayedDialogAct({
                        index: i, feePaymentId: pay._id, value: pay.value, percentage: 0, remaining: pay.value
                      }))}
                      disabled={pay.trusted !== true || pay.confirmed === false} variant="outlined"> <Paid /> </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}><Info fontSize="small" color="secondary"/> {numberToCurrency(pending) }</TableCell>
                <TableCell colSpan={1}><MonetizationOn fontSize="small" color="warning"/> {numberToCurrency(confirmed)}</TableCell>
                <TableCell colSpan={2}><Summarize fontSize="small" color="warning"/> {numberToCurrency(confirmed + pending)}</TableCell>
                <TableCell colSpan={1}><Check fontSize="small" color="success"/> {numberToCurrency(payed)}</TableCell>
                <TableCell colSpan={1}></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

      </>}
      </ThemeProvider>
    )
}