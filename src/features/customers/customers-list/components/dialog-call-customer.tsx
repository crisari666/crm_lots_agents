import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Grid, IconButton, LinearProgress, Switch } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { changeInputCustomerCallDialogAct, logCustomerAnswerThuhk, logCustomerDontAnswerThuhk, setCustomerAsAnsweredThunk, setDialogCallUserAct } from "../customers.slice"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Image, ImageUploader } from "@martinmaffei95/image-uploader"
import { Close, Note } from "@mui/icons-material"
import AppTextField from "../../../../app/components/app-textfield"

export default function DialogCallCustomer() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const {dialogCallUser, userAnswered, customerCallDialogState: {answered, minutes, note, seconds}} = useAppSelector((state) => state.customers)
  const {currentUser} = useAppSelector((state) => state.login)

  useEffect(() => {
    if(userAnswered === true) {
      closeDialog()
      navigate(`/dashboard/customer/${dialogCallUser!.customerId}`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAnswered, dialogCallUser])

  const pushNotAnswered = () => {
    //console.log(values!["raffleImgs"]);
    if(values!["raffleImgs"].length > 0) {
      closeDialog()
      dispatch(logCustomerDontAnswerThuhk({customerId: dialogCallUser!.customerId, file: values!["raffleImgs"], note, time: `${minutes}:${seconds}` }))
    } else {
      showAlertAddImage()
    }
  }

  const closeDialog = () => dispatch(setDialogCallUserAct(undefined))
  
  const showAlertAddImage = () => alert("Debes agregar una imagen y tiempo de llamada, nota en caso de no contestar")
  
  const pushAnswered = () => {
    if(values!["raffleImgs"].length > 0) {
      dispatch(logCustomerAnswerThuhk({customerId: dialogCallUser!.customerId, file: values!["raffleImgs"], time: `${minutes}:${seconds}`}, ))
      dispatch(setCustomerAsAnsweredThunk({customerId: dialogCallUser!.customerId}))
    } else {
      showAlertAddImage()
    }
  }

  const [values, setValues] = useState<{ [name: string]: Image[] }>();

  const setFieldValue = (name: string, value: Image[]) => {
    setValues((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const changeInput = (d : {name: string, val: any}) => {
    console.log({d});
    
    dispatch(changeInputCustomerCallDialogAct({key: d.name, value: d.val}))
  }

  return(
    <>
      <Dialog open={dialogCallUser !== undefined}>
        {currentUser?.level === 0 &&  <IconButton onClick={closeDialog} size="small" className="closeDialog"> <Close fontSize="small"/></IconButton> }
        <DialogTitle> Llamar usuario </DialogTitle>
        <DialogContent sx={{minWidth: "500px"}}>
          <DialogContentText>
            Numero de telefono: {dialogCallUser?.phone} <br/>
            Correo: {dialogCallUser?.email} <br/>
            {dialogCallUser?.description && <>  <Note fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} /> Descripción: {dialogCallUser?.description}</>}
          </DialogContentText>
          <LinearProgress sx={{marginBlock: 2}} color="info" variant="indeterminate"/>
          <>
            <ImageUploader
              config={{
                colorScheme: "purple",
                inputConfig: {
                  multiple: false,
                  fieldName: "raffleImgs",
                  setFieldValue,
                }
              }}
            />
          </>
          <Grid container spacing={2} marginBottom={2}>
            <Grid item xs={4}>
              <FormControlLabel label="Contesto" labelPlacement="end" control= {
                <Switch checked={answered}  onChange={(e, checked) => changeInput({name: 'answered', val: checked})}/>} 
              />
            </Grid>
            {!answered && <Grid item xs={8}>
              <AppTextField label="Nota" name="note" onChange={changeInput} />
            </Grid>}
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <AppTextField label="Minutos" type="number" name="minutes" inputProps={{min: 0, max: 100}} onChange={changeInput}/>
            </Grid>
            <Grid item xs={6}>
              <AppTextField label="Segundo" type="number" name="seconds" inputProps={{min: 0, max: 60}} onChange={changeInput}/>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{marginRight: 2, marginBottom: 2, paddingLeft: 3, display: 'flex', justifyContent: 'space-between'}}>

          {answered && <Button variant="contained" color="success"onClick={pushAnswered}> CONTESTO </Button>}
          {!answered && <Button variant="contained" color="error" onClick={pushNotAnswered}> NO CONTESTO </Button>}

        </DialogActions>
      </Dialog>
    </>
  )
}