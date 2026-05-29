import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import { RootState } from "../../app/store"

export default function WhatsappMarketingView() {
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
  return <Outlet />
}
