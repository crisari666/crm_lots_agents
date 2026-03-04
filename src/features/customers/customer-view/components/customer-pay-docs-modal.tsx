import { Close, FileUpload, Visibility } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { getCustomerPayDocsThunk, openModalPayDocsAct, uploadCustomerDocPayThunk } from "../customer-view.slice";
import { useEffect, useState } from "react";
import { MuiFileInput } from 'mui-file-input'
import { dateUTCToFriendly } from "../../../../utils/date.utils";
import AppSelector from "../../../../app/components/app-select";
import AppTextField from "../../../../app/components/app-textfield";
const urlUploads = import.meta.env.VITE_API_URL_UPLOADS
export default function CustomerPayDocsModal() {
  const { steps } = useAppSelector((state ) => state.steps)
  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<string>("")
  const [value, setValue] = useState<number>(0)
  const dispatch = useAppDispatch()
  const { openModalPayDocs, customerData, customerDocPays } = useAppSelector((state) => state.customer) 

  useEffect(() => {
    if(!openModalPayDocs){
      setFile(null)
    } else {
      dispatch(getCustomerPayDocsThunk(customerData?._id?? ""))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModalPayDocs])

  const handleChange = (newValue: File | null) => setFile(newValue)

  const uploadFile = () => {
    if(file !== null && value > 0 && step !== ""){
      console.log({file});
      dispatch(uploadCustomerDocPayThunk({
        file, 
        customerId: customerData?._id?? "",
        step,
        value
      }))
      // do something with the file
    }
  }

  


  return (
    <>
      <Dialog open={openModalPayDocs}>
        <IconButton onClick={() => dispatch(openModalPayDocsAct(false))}> <Close className="closeDialog" /></IconButton>
        <DialogTitle>Acuerdos de Pago</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AppSelector required options={steps.map((el) => ({_id: el._id, name: el.title}))} label="Paso" name="step" value={step} onChange={(d) => setStep(d.val)}/>
            </Grid>
            <Grid item xs={12}>
              <AppTextField value={value} onChange={(d) => setValue(d.val)} label="Valor" type="number"/>
            </Grid>
            <Grid item xs={12}>
              <MuiFileInput
                fullWidth
                size="small"
                InputProps={{
                  endAdornment: <IconButton color="primary" onClick={uploadFile} disabled={file == null}> <FileUpload/> </IconButton>
                }}
                placeholder="Selecionar archivo" value={file} onChange={handleChange}
                />
            </Grid>
          </Grid>
            <Divider sx={{marginY: 2}} />
            <List>
              {customerDocPays.map((doc) => {
                return (
                  <ListItem key={doc._id}
                    secondaryAction={
                      <IconButton LinkComponent={'a'} target="_blank" color="primary" href={`${urlUploads}uploads/customer-documents/${doc.document}`} disabled={doc.anulated}>
                        <Visibility/>
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={dateUTCToFriendly(doc.date)}
                      secondary={doc.step.title}
                    />
                    <ListItemButton  >

                    </ListItemButton  >
                  </ListItem>
                )
              })}
            </List>

        </DialogContent>
      </Dialog>
    </>
  )
}