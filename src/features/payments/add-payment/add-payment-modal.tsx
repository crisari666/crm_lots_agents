/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import {
  Box, CircularProgress, Dialog, DialogContent, DialogTitle, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, List, ListItem, ListItemText, Typography,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import { addPaymentThunk, resetSuccessPaymentAction, showPaymentModalAction, updateInputAddPaymentAction } from "./add-payment.slice"
import { Add } from "@mui/icons-material"
import { useEffect } from "react"
import { updateCardWithPaymentAdded } from "../../cards-list/cards-list.slice"

export default function AddPaymentModal() {
  const dispatch = useAppDispatch()
  const { showPaymentModal, currentCard, inputValue, loading, disabledInput, successPayment} = useAppSelector(
    (state: RootState) => state.addPayment,
  )

  useEffect(() => {
    if(successPayment === true){
      dispatch(updateCardWithPaymentAdded({cardId: currentCard!._id!, valuePayed: inputValue}))
      dispatch(resetSuccessPaymentAction())
    }
  }, [successPayment])

  const changeInputAddPayment = (e: any) => {
    dispatch(updateInputAddPaymentAction(e.target.value))
  }

  const addPayment = () => {
    if(inputValue > 0){
      dispatch(addPaymentThunk({cardId: currentCard?._id!, value: inputValue}))
      
    }
  }

  return (
    <>
      <Dialog
        open={showPaymentModal}
        onClose={() => dispatch(showPaymentModalAction(false))}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Agregar pago</DialogTitle>
        <DialogContent>
          <Box minWidth={"480px"}>
            <Typography sx={{cursor: "none"}}  variant="caption">ID: {currentCard?._id}</Typography>
            <Grid container>
              <Grid item xs={3}>
                {currentCard !== undefined && (
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Nombre"
                        secondary={currentCard!.name}
                      ></ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Direccion"
                        secondary={currentCard!.address}
                      ></ListItemText>
                    </ListItem>
                  </List>
                )}
              </Grid>
              <Grid container item xs={9} display={"flex"} direction={"column"} justifyContent={"center"}>
                
                <List dense={true}>
                  <ListItem dense><ListItemText secondary={`Pagado hoy: $ ${currentCard?.todayPaymentsTotal ?? 0}`}></ListItemText></ListItem>
                </List>
                <FormControl variant="outlined" fullWidth disabled={disabledInput}>
                  <InputLabel>VALOR</InputLabel>
                  <Input type="number" inputProps={{style: {textAlign: "center"}}} onChange={changeInputAddPayment} slotProps={{input: {step: 1, min: 0}}} value={inputValue} endAdornment={
                      <InputAdornment position="end">
                        {!loading &&<IconButton disabled={inputValue === 0} size="large" color="success" onClick={addPayment} > <Add fontSize={"large"} /> </IconButton>}
                        {loading === true && <CircularProgress size={20} />}
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}
