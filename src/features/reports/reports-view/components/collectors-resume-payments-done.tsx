import { Close, Search } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { FeePaymentsResultI } from "../../../../app/models/fee-payment-result-inteface";
import { numberToCurrency } from "../../../../utils/numbers.utils";
import { setCollectorFilterAct } from "../reports.slice";
import { CollectorResumeRowType } from "../../reports.state";
import { useAppDispatch } from "../../../../app/hooks";
export default function CollectorsResumenPaymentsDone({open, onClose, payments} : {open: boolean, onClose: () => void, payments: FeePaymentsResultI[]}) {
  const dispatch = useAppDispatch()
  const buildResumeForCollector = (): CollectorResumeRowType[] => {
    const collector: {[key: string]: CollectorResumeRowType} = {}
    for(let payment of payments) {
      console.log({payment});
      if(payment.collector !== null && payment.collector !== undefined) {
        if(collector[payment.collector._id] === undefined){
          collector[payment.collector._id] = {_id: payment.collector._id, name: payment.collector.title, total: 0, payments: []}
        }
        if(!payment.retained && !payment.paymentRequest.anulated) {
          collector[payment.collector._id].total += payment.value
          collector[payment.collector._id].payments.push(payment)
        }
      }
    }
    const c = Object.keys(collector).map((key) => collector[key])
    return c.sort((a, b) => a.total - b.total)
  }

  const collectors = buildResumeForCollector()

  return (
    <>
      <Dialog open={open}>
        <IconButton onClick={() => onClose()}> <Close className="closeDialog" /></IconButton>
        <DialogTitle>Resumen por cobradores</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cobrador</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell> <Search/> </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {collectors.map((collector) => {
                  return (
                    <TableRow key={`collector_row${collector._id}`}>
                      <TableCell>{collector.name}</TableCell>
                      <TableCell align="right" sx={{paddingX: 2}}>{numberToCurrency(collector.total)}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => {
                          onClose();
                          dispatch(setCollectorFilterAct(collector))
                        }}> <Search  /> </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                }
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </>
  )
}