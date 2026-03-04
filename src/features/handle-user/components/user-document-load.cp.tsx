import { ExpandMore, UploadFile, Visibility } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getUserDocsThunk, setDialogUploadUserDocAction } from "../handle-user.slice";
import DialogUploadUserDocument from "./dialog-upload-user-document";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
const urlApi = import.meta.env.VITE_API_URL_UPLOADS
export default function UserDocumentsLoad() {
  const dispatch = useAppDispatch()
  let { userId } = useParams()
  const { userDocs } = useAppSelector((state) => state.handleUser)
  
  const displayUploadDoc = ({documentType} : {documentType: string}) => {
    dispatch(setDialogUploadUserDocAction({documentType}))
  }
  useEffect(() => {
    if(userId !== undefined) {
      dispatch(getUserDocsThunk(userId))
    } 
  }, [dispatch, userId])

  const professionalCardLink = userDocs !== undefined && userDocs!.profesionalCard !== undefined ?  `${urlApi}uploads/user-documents/${userDocs!.profesionalCard!}` : "";
  const diplomaLink = userDocs !== undefined && userDocs!.diploma !== undefined ?  `${urlApi}uploads/user-documents/${userDocs!.diploma!}` : "";
  const signCertifiedLink = userDocs !== undefined && userDocs!.signCertified !== undefined ?  `${urlApi}uploads/user-documents/${userDocs!.signCertified!}` : "";
  return (<>
    <DialogUploadUserDocument />
    <Accordion sx={{marginTop: 2}}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
      >
        Documentos
      </AccordionSummary>
      <AccordionDetails>
        <List>
          <ListItem
            secondaryAction={
              <IconButton color="secondary" onClick={() => displayUploadDoc({documentType: 'profesionalCard'})}> 
                <UploadFile/> 
              </IconButton>
            }
          >
            <ListItemButton> <IconButton 
              LinkComponent={'a'} 
              target={'_blank'}
              href={professionalCardLink} 
              color="primary" 
              disabled={userDocs === undefined || !userDocs!.profesionalCard}><Visibility/>
            </IconButton> </ListItemButton>
            <ListItemText> Tarjeta Profesional</ListItemText>
          </ListItem>
          <ListItem
            secondaryAction={
              <IconButton color="secondary" onClick={() => displayUploadDoc({documentType: 'diploma'})}> 
                <UploadFile/> 
              </IconButton>
            }
          >
            <ListItemButton> <IconButton 
              color="primary" 
              LinkComponent={'a'} 
              target={'_blank'}
              href={diplomaLink} 
              disabled={userDocs === undefined || !userDocs!.diploma}><Visibility/>
            </IconButton> </ListItemButton>
            <ListItemText> Diploma</ListItemText>
          </ListItem>
          <ListItem
            secondaryAction={
              <IconButton color="secondary" onClick={() => displayUploadDoc({documentType: 'signCertified'})}> 
                <UploadFile/> 
              </IconButton>
            }
          >
            <ListItemButton> <IconButton 
              color="primary" 
              target={'_blank'}
              LinkComponent={'a'} 
              href={signCertifiedLink}
              disabled={userDocs === undefined || !userDocs!.signCertified}><Visibility/>
            </IconButton> </ListItemButton>
            <ListItemText> Certificado Firma Profesional</ListItemText>
          </ListItem>
        </List>
      </AccordionDetails>

    </Accordion>
  </>)
}