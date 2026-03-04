import { Paper } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import CustomersTableView from "../../customers/customers-list/components/customers-list-table"
import CustomersTableResume from "../../customers/customers-list/components/customers-table-resume"
import ImageShowerCP from "../../../app/components/image-shower.cp"
import { setImagePreviewerAct } from "../../image-preview/image-preview.slice"

export default function CustomerCenterTableContent() {
  const dispatch = useAppDispatch()
  const {customers} = useAppSelector((state) => state.customerCenter)
  const {currentUser} = useAppSelector((state) => state.login)
  const {image} = useAppSelector((state) => state.imagePreview)
  return(
    <> 
      <ImageShowerCP imgUrl={image} onClose={() => dispatch(setImagePreviewerAct(undefined))}/>
      <Paper sx={{padding: 1}}>
        <CustomersTableResume customers={customers} />
        <CustomersTableView currentUser={currentUser!} customers={customers}/>
      </Paper>
    </>
  )
}