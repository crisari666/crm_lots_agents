/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import { MenuItem, Select } from "@mui/material"
import { useEffect } from "react"
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice"
import { useNavigate } from "react-router-dom"

export default function CardListUserSelector({ userId = "" }: { userId?: string }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { users } = useAppSelector((state: RootState) => state.users)

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsersThunk({enable: true}))
    }
  }, [users])

  const chooseUSerEvent = (e: any) => {
    const userId = e.target.value
    if (userId !== "") {
      navigate(`/dashboard/cards-lists/${userId}`)
    }
  }
  return (
    <>
      {users.length > 0 && <Select
        placeholder="Usuario"
        fullWidth
        onChange={chooseUSerEvent}
        value={userId}
      >
        <MenuItem value={""}>-- USUARIO --</MenuItem>
        {users.map((el, i) => {
          return (
            <MenuItem key={`selectorCardsList${el._id}`} value={el._id}>
              {el.name}
            </MenuItem>
          )
        })}
      </Select>}
    </>
  )
}
