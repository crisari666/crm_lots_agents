import { Info } from "@mui/icons-material";
import { Alert } from "@mui/material";
import { useAppSelector } from "../../../../app/hooks";

export default function CustomerWasTreated() {
  const { customerWasTreated } = useAppSelector((state) => state.customer)
  return (
    <>
      {customerWasTreated !== undefined && customerWasTreated!.isFromDatabase && <Alert icon={<Info />} severity="warning" style={{marginBottom: 10}}>
        {customerWasTreated!.isFromDatabase === true && "Este cliente es asignado de base de datos"}
        {/* {customerWasTreated!.isFromDatabase === false && customerWasTreated!.calls === true && "Este cliente es reasignado por campaña"} */}
      </Alert>}
    </>
  )
}