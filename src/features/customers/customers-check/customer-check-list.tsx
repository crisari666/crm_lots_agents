import { useAppDispatch, useAppSelector } from "../../../app/hooks";
export default function CustomerCheckList() {
  const dispatch = useAppDispatch()
  const {} = useAppSelector((state) => state.users) 
  return (
    <>
      New view
    </>
  )
}