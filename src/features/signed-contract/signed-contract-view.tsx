import { Divider } from "@mui/material"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import { RootState } from "../../app/store"
import SignedContractPage from "./pages/signed-contract-page"

export default function SignedContractView() {
  const navigate = useNavigate()
  const { currentUser } = useAppSelector((state: RootState) => state.login)
  useEffect(() => {
    const ok =
      currentUser !== undefined &&
      (currentUser.level === 0 || currentUser.level === 1)
    if (currentUser !== undefined && !ok) {
      navigate("/dashboard")
    }
  }, [currentUser, navigate])
  if (
    currentUser === undefined ||
    (currentUser.level !== 0 && currentUser.level !== 1)
  ) {
    return null
  }
  return (
    <>
      <SignedContractPage />
      <Divider sx={{ marginBlock: 2 }} />
    </>
  )
}
