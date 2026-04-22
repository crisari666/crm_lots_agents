import { Stack, Typography } from "@mui/material"
import { useEffect } from "react"
import { useAppDispatch } from "../../../app/hooks"
import SignedContractControls from "../components/signed-contract-controls"
import SignedContractList from "../components/signed-contract-list"
import { fetchSignedContractHistoryThunk } from "../slice/signed-contract.slice"

export default function SignedContractPage() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    void dispatch(fetchSignedContractHistoryThunk({}))
  }, [dispatch])
  return (
    <Stack spacing={2}>
      <Typography variant="h5" component="h1">
        Historial contratos enviados a firma
      </Typography>
      <SignedContractControls />
      <SignedContractList />
    </Stack>
  )
}
