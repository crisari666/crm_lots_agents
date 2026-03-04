import { Card } from "@mui/material";
import TabHandler from "../../../../app/components/tab-handler";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import CustomersTableView from "./customers-list-table";
import CustomersTableResume from "./customers-table-resume";
import moment from "moment";
import ImageShowerCP from "../../../../app/components/image-shower.cp";
import { setImagePreviewerAct } from "../../../image-preview/image-preview.slice";
import { useEffect } from "react";
import { getActiveCustomerThunk } from "../customers.slice";

const recentsDate = moment.utc().startOf("day").toDate().getTime();
export default function CustomersSegmented() {
  const { customers } = useAppSelector((state) => state.customers)
  const { currentUser } = useAppSelector((state) => state.login)
  const { image: imageForPreview } = useAppSelector((state) => state.imagePreview)
  const dispatch = useAppDispatch()
  const recentsUsers = customers.filter(
    (c) =>
      {        
        return new Date (c.dateAssigned).getTime() >  recentsDate && c.userAssigned !== undefined && c.userAssigned !== null && (c.userAssigned as any).length > 0 && (c.userAssigned as any)[0]._id === currentUser!._id!
      }
  )
  useEffect(() => {
    dispatch(getActiveCustomerThunk({}))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  } , []) 
  return (
    <>
      <ImageShowerCP imgUrl={imageForPreview} onClose={() => dispatch(setImagePreviewerAct(undefined))}/>
      <Card sx={{marginBottom: 1}}>
        <CustomersTableResume customers={customers}/>
      </Card>
      {recentsUsers.length > 0 && <Card sx={{marginBottom: 1}}>
        <CustomersTableView maxHeight={270} currentUser={currentUser!} customers={recentsUsers}/>,
      </Card>}
      <Card>
        <TabHandler tabNames={["Activos", "Recientes", "Quemados"]} tabComponents={[
            <CustomersTableView currentUser={currentUser!} customers={customers.filter((c) => c.answered === true && c.status !== 2)}/>,
            <CustomersTableView currentUser={currentUser!} customers={customers.filter((c) => c.answered === false && c.status !== 2)}/>,           
            <CustomersTableView currentUser={currentUser!} customers={customers.filter((c) => c.status === 2)}/>,           
        ]}/> 
      </Card>
    </>
  )
}