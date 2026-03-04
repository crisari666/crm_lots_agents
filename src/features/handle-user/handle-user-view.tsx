/* eslint-disable react-hooks/exhaustive-deps */


import { useEffect } from "react"
import LoadingIndicator from "../../app/components/loading-indicator"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { RootState } from "../../app/store"
import { resetHandleUserStateAction } from "./handle-user.slice"
import { useNavigate, useParams } from "react-router-dom"
import UserForm from "./components/user-form"
import { CheckUserAllowedComponent } from "../../app/components/check-user-allowed-component"
import UserResumeComponent from "../user-customers/components/user-resume-component"
import CtrlsUserCP from "./components/ctrls-user"
import UserDocumentsLoad from "./components/user-document-load.cp"
import UserTools from "./components/user-tools"



export function HandleUserView() {
  const navigate = useNavigate()
  let { userId } = useParams()
  const dispatch = useAppDispatch()
  const { loading, created, currentUser: userBeingEdited } = useAppSelector((state: RootState) => state.handleUser,)
  const { currentUser: sessionUser } = useAppSelector((state: RootState) => state.login)

  useEffect(() => {
    if (created === true) {
      navigate("/dashboard/users")
      dispatch(resetHandleUserStateAction())
    }
  }, [created])

  useEffect(() => {
    if (userId && userBeingEdited?._id === userId && userBeingEdited?.root === true && sessionUser?.root !== true) {
      navigate("/dashboard", { replace: true })
    }
  }, [userId, userBeingEdited?._id, userBeingEdited?.root, sessionUser?.root, navigate])

  const notAllowed = (allowed: boolean) => {
    if(!allowed){
      navigate("/dashboard")
    }
  }

  return (
    <>
      <CheckUserAllowedComponent checkIfAdmin={true} onCheckPermission={notAllowed}>
        <LoadingIndicator open={loading} onClose={() => {}} />
        <CtrlsUserCP/>
        <UserResumeComponent/>
        <UserForm />
        <UserDocumentsLoad />
        <UserTools />
      </CheckUserAllowedComponent>
    </>
  )
}
