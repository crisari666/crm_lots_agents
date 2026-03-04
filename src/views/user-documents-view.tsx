import { Visibility } from "@mui/icons-material";
import { List, ListItem, IconButton, ListItemButton, ListItemText } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useEffect } from "react";
import { getUserDocsThunk } from "../features/handle-user/handle-user.slice";

const urlApi = import.meta.env.VITE_API_URL_UPLOADS
export default function UserDocumentsView() {
  const dispatch = useAppDispatch()
  const { userDocs } = useAppSelector((state) => state.handleUser)
  const { currentUser } = useAppSelector((state) => state.login)
  const professionalCardLink = userDocs !== undefined && userDocs!.profesionalCard !== undefined ?  `${urlApi}uploads/user-documents/${userDocs!.profesionalCard!}` : "";
  const diplomaLink = userDocs !== undefined && userDocs!.diploma !== undefined ?  `${urlApi}uploads/user-documents/${userDocs!.diploma!}` : "";
  const signCertifiedLink = userDocs !== undefined && userDocs!.signCertified !== undefined ?  `${urlApi}uploads/user-documents/${userDocs!.signCertified!}` : "";

  useEffect(() => {
    if(currentUser !== undefined) {
      dispatch(getUserDocsThunk(currentUser._id!))
    }
  }, [currentUser, dispatch])
  return (
    <>
      <List>
        <ListItem
          // secondaryAction={
          //   <IconButton color="secondary" onClick={() => displayUploadDoc({documentType: 'profesionalCard'})}> 
          //     <UploadFile/> 
          //   </IconButton>
          // }
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
          // secondaryAction={
          //   <IconButton color="secondary" onClick={() => displayUploadDoc({documentType: 'diploma'})}> 
          //     <UploadFile/> 
          //   </IconButton>
          // }
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
          // secondaryAction={
          //   <IconButton color="secondary" onClick={() => displayUploadDoc({documentType: 'signCertified'})}> 
          //     <UploadFile/> 
          //   </IconButton>
          // }
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
 
    </>
  )
}