import { Close, Image } from "@mui/icons-material";
import { Box, Button, Checkbox, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, IconButton, List, ListItem, ListItemText } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeSinglePercentageForPaymentStepAct, findPaymentsThunk, getLastUserPaymentDownloadedThunk, pickPaymentForDownloadAct, showDialogFindPaymentAct, updateInputFilterPaymentAct } from "../business-logic/download-payment.slice";
import AppDateRangeSelector from "../../../app/components/app-date-range-selector";
import moment from "moment";
import { dateToInputDate, dateUTCToFriendly } from "../../../utils/date.utils";
import AppSelector from "../../../app/components/app-select";
import { useEffect } from "react";
import { getOfficesThunk } from "../../offices/offices-list/offices-list.slice";
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice";
import { TypePercentageEnum } from "../../user-percentage/slice/users-percentage.state";
export default function SearchPaymentForDownloadDialog() {
  const dispatch = useAppDispatch()
  const { showFindPaymentDialog, filterPaymentForm, loading, foundPayments, pickedPayment } = useAppSelector((state) => state.downloadPayment) 
  const { offices, gotOffices } = useAppSelector((state) => state.offices) 
  const { usersOriginal, gotUsers } = useAppSelector((state) => state.users) 
  const {collector, dateEnd, dateInit, office, userId} = filterPaymentForm
  const closeDialog = () => dispatch(showDialogFindPaymentAct(false))

  const changeInput = ({ name: key, val: value } : {name: string, val: string}) => {
    dispatch(updateInputFilterPaymentAct({key, value}))
  }
  useEffect(() => {
    if(!gotOffices) {
      dispatch(getOfficesThunk())
    }
    
    if(!gotUsers) {
      dispatch(fetchUsersThunk({enable: true}))
    }
  }, [])

  const findPayments = () => dispatch(findPaymentsThunk(filterPaymentForm))


  const usersOptions = usersOriginal.filter((u) => u.office && (u.office as any)._id === office).map((u) => ({_id: u._id, name: `${u.name} / ${u.lastName} / ${u.email}`}))

  const resolveCollector = (collector: any) => {
    if (Array.isArray(collector)) {
      return collector[0].title;
    }
    return '--';
  }

  return (
    <>
      <Dialog open={showFindPaymentDialog} onKeyDown={closeDialog}>
        <IconButton onClick={closeDialog} className="closeDialog"> <Close  /></IconButton>
        <DialogTitle>buscador de pagos.</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <AppDateRangeSelector
                id="findPaymentDateDownloadPayment"
                dateStart={moment(dateInit).toDate()}
                dateEnd={moment(dateEnd).toDate()}
                onChange={({dateEnd, dateStart}) => {
                  changeInput({name: "dateInit", val: dateToInputDate(dateStart.toISOString())})
                  changeInput({name: "dateEnd", val: dateToInputDate(dateEnd.toISOString())})
                }}
              />
            </Grid>
            <Grid item xs={12}> <AppSelector value={office} label="Oficina" name="office" onChange={changeInput} options={offices}/> </Grid>
            <Grid item xs={12}> <AppSelector value={userId} label="Usuario" name="userId" onChange={changeInput} options={usersOptions}/> </Grid>
            <Grid item xs={12}> <AppSelector value={collector} label="Cobrador" name="collector" onChange={changeInput} options={usersOptions}/> </Grid>
            <Grid item xs={12}> <Button fullWidth size="small" variant="outlined" onClick={findPayments}> BUSCAR </Button> </Grid>
          </Grid>
          {loading && <CircularProgress/> }
          <Box>
            <List dense disablePadding>
              {foundPayments.map((el) => 
               (<ListItem key={el._id}
                  sx={{borderBottom: "1px solid #ccc"}}

                  secondaryAction={ 
                    <>
                      <Checkbox checked={pickedPayment !== undefined && pickedPayment!._id === el._id} onClick={() => {
                      //Set user for download payment
                      const percentage = el.customer.reassigned ? 30 : el.paymentRequest.user.percentage

                      dispatch(changeSinglePercentageForPaymentStepAct({type: TypePercentageEnum.worker, percentage: percentage, user: el.paymentRequest.user._id, userNick: `${percentage}% ${el.paymentRequest.user.email}`}))
                      dispatch(pickPaymentForDownloadAct(el))
                      dispatch(getLastUserPaymentDownloadedThunk(el.paymentRequest.user._id))
                      }} /> 
                      <IconButton LinkComponent={'a'} href={`${import.meta.env.VITE_API_URL_UPLOADS}uploads/fee-payments/${el.image}`} target="_blank" > <Image/> </IconButton>
                    </>
                }
                >
                  <ListItemText 

                    primary={<Box display={'flex'}>{el.customer.name} /  <Box color={'green'}>{el.value}</Box> /{dateUTCToFriendly(el.date)}`</Box>} 
                    secondary={`${el.paymentRequest.user.email} / ${el.paymentRequest.user.name} / ${el.paymentRequest.user.lastName} [${resolveCollector(el.collector)}]`} 
                  />
            </ListItem>)
              )}
            </List>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}