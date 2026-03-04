import { Typography } from "@mui/material"
import { useAppSelector } from "../../../../app/hooks"

export default function CustomerNotFoundCP() {

  const { userNotFound } = useAppSelector((state) => state.verifyCustomerPaymentsSlice) 
  return (
    <>
      {userNotFound && <Typography variant="h6" padding={4}> Registro no encontrado</Typography>}
    </>
  )
}