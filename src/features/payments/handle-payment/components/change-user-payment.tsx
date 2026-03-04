import { Edit, Save, Cancel } from "@mui/icons-material"
import { Grid, Button, Box } from "@mui/material"
import AppAutoComplete, { AppAutocompleteOption } from "../../../../app/components/app-autocomplete"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { useEffect, useState } from "react"
import { fetchUsersThunk } from "../../../users-list/slice/user-list.slice"
import { PaymentSingleType } from "../slice/handle-payment.state"
import { changePaymentUserThunk } from "../slice/handle-payment.slice"

export default function ChangeUserPayment({payment} : {payment: PaymentSingleType}) {
  const dispatch = useAppDispatch()
  const {usersOriginal} = useAppSelector((state) => state.users) 
  const [ editUser, setEditUser] = useState<boolean>(false)  
  const [ userPayment, setUserPayment] = useState<AppAutocompleteOption>({_id: payment.user._id, name: payment.user.email}) 

  useEffect(() => {
    dispatch(fetchUsersThunk({enable: true}))
  }, [dispatch])

  const cancelEditUser = () => {
    setEditUser(false)
    setUserPayment({_id: payment.user._id, name: payment.user.email})
  }

  const savePaymentUser = () => {
    console.log({userPayment});

    if(userPayment._id !== payment.user._id) {
      // eslint-disable-next-line no-restricted-globals
      if(confirm("¿Está seguro de cambiar el usuario?")){
        dispatch(changePaymentUserThunk({payment: payment._id, user: userPayment._id}))
        setEditUser(false)
      }
    }
    
  }
  
  const options: AppAutocompleteOption[] = usersOriginal.map((u) => ({name: u.email, _id: u._id})) as AppAutocompleteOption[]
  return (
    <>
      <Box>
        <Grid container spacing={1}>
          <Grid
            item
            flexGrow={1}
            alignItems={'center'}
          >
            <AppAutoComplete
              name="user"
              disabled={!editUser}
              onChange={({val}) => setUserPayment(val)}
              value={userPayment} 
              options={options}
              label="Usuario"
            />
          </Grid>
          <Grid item display={'flex'} alignItems={'center'}>
            {!editUser && <Button onClick={() => setEditUser(true)} variant="outlined" size="small"> <Edit fontSize="small"/> </Button>}
            {editUser && <Button onClick={savePaymentUser} variant="outlined" size="small"> <Save fontSize="small"/> </Button>}
            {editUser && <Button onClick={cancelEditUser} variant="outlined" color="error" size="small"> <Cancel fontSize="small"/> </Button>}
          </Grid>
        </Grid>
      </Box>
    </>
  )
}