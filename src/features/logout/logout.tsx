/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react"
import LoadingIndicator from "../../app/components/loading-indicator"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { RootState } from "../../app/store"
import { useNavigate } from "react-router-dom"
import { logoutAction } from "../signin/signin.slice"

export default function LogoutView() {
  const dispatch = useAppDispatch()
  const { logout } = useAppSelector((state: RootState) => state.login)
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(logoutAction())
  }, [])

  useEffect(() => {
    console.log({ logout })
    if (logout === true) {
      navigate("/")
      window.location.reload()
    }
  }, [logout])

  return <LoadingIndicator open={true} />
}
