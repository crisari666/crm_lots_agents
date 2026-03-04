/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect, useState } from "react"
import { useAppSelector } from "../hooks"
import { RootState } from "../store"

export function CheckUserAllowedComponent({
  children = <></>,
  checkIfAdmin = false,
  onCheckPermission = () => {},
}: {
  children?: ReactNode
  checkIfAdmin?: boolean
  onCheckPermission?: (allowed: boolean) => void
}) {
  const [allow, setAllow] = useState<boolean | null>(null)

  const { currentUser } = useAppSelector((state: RootState) => state.login)

  useEffect(() => {
    const allowed =
      currentUser !== undefined &&
      ((checkIfAdmin && currentUser!.level === 0) || !checkIfAdmin)
    setAllow(allowed)
  }, [])

  useEffect(() => {
    if (allow !== null) {
      onCheckPermission!(allowed)
    }
  }, [allow])

  const allowed =
    currentUser !== undefined &&
    ((checkIfAdmin && currentUser!.level === 0 || currentUser!.level === 1) || !checkIfAdmin)
  return allowed ? children : <></>
}
