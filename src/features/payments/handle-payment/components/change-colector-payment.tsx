import { useEffect, useState } from "react"
import AppAutoComplete, { AppAutocompleteOption } from "../../../../app/components/app-autocomplete"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { fetchCollectorsThunk } from "../../../collectors/slice/collectors.slice"
import { Check, Close, Edit } from "@mui/icons-material"
import { Button } from "@mui/material"
import { Grid } from "@mui/material"
import { changePaymentCollectorThunk } from "../slice/handle-payment.slice"
import { FeePaymentType } from "../slice/handle-payment.state"

export default function ChangePaymentColector({fee} : {fee: FeePaymentType}) {
  const dispatch = useAppDispatch()
  const [disabled, setDisabled] = useState<boolean>(true)
  const {collectors} = useAppSelector((state) => state.collectors) 
  const {payment} = useAppSelector((state) => state.handlePayment)
  const [collector, setCollector] = useState<AppAutocompleteOption>({name: "", _id: ""})

  useEffect(() => {
    dispatch(fetchCollectorsThunk())
  }, [])


  const options = collectors.map((collector) => ({
    name: `${collector.title} | ${collector.user.email}`,
    _id: collector._id
  }))

  useEffect(() => {
    if(fee !== undefined) {
      setDisabled(true)
      const collector = collectors.find((collector) => collector._id === fee.collector)
      if(collector !== undefined) {
        setCollector({name: `${collector.title} | ${collector.user.email}`, _id: collector._id})
      }
    }
  }, [fee, collectors])


  const changeCollector = () => {
    dispatch(changePaymentCollectorThunk({payment: fee._id, collector: collector._id}))
  }

  return (
    <Grid container marginBottom={2} spacing={1}>
      <Grid item flexGrow={1} alignItems={'center'} >
        <AppAutoComplete value={collector} disabled={disabled } options={options} label="Cobrador" name="collector" onChange={({name, val}) => setCollector(val)} />
      </Grid>
      <Grid item display={'flex'} alignItems={'center'}>
        {disabled && <Button variant="outlined" size="small" color="primary" onClick={() => setDisabled(false)}> <Edit fontSize="small"/> </Button>}
        {!disabled && 
          <>
            <Button variant="outlined" size="small" color="primary" onClick={changeCollector}> <Check fontSize="small"/> </Button>
            <Button variant="outlined" size="small" color="error" onClick={() => setDisabled(true)}> <Close fontSize="small"/> </Button>
          </>
        }
      </Grid>
    </Grid>
  )
}