import { useCallback, useEffect, useState } from "react"
import AppDateRangeSelector from "../../../app/components/app-date-range-selector"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { dateToInputDate, getCurrenDateUtil } from "../../../utils/date.utils"
import moment from "moment";
import { Button, Grid, Paper, TextField } from "@mui/material";
import { getDisabledCustomersThunk } from "../slice/customers-database.slice";
import { Download } from "@mui/icons-material";

export default function CustomerDatabaseFilter() {
  const { customersAssigned, expectedNumbers } = useAppSelector((state)  => state.customerDatabase)
  const dispatch = useAppDispatch()
  const [dateInit, setDateInit] = useState<string>(dateToInputDate(moment(getCurrenDateUtil()).subtract('30', 'days').toDate().toISOString()))
  const [dateEnd, setDateEnd] = useState<string>(getCurrenDateUtil())
  const [searchTerm, setSearchTerm] = useState<string>('')
  
  const loadCustomers = useCallback(() => {
    dispatch(getDisabledCustomersThunk({
      endDate: dateEnd,
      fromDate: dateInit,
      limit: Number(expectedNumbers) + 500,
      term: searchTerm.trim() || undefined
    }))
  }, [dispatch, dateEnd, dateInit, expectedNumbers, searchTerm])

  useEffect(() => {
    // if(customersAssigned === true) {
    //   loadCustomers()
    // }
  },[customersAssigned, loadCustomers])
  

  //const {} = useAppSelector((state) => state.users) 
  return (
    <Paper sx={{padding: 1, marginBottom: 2}}>
        <Grid container spacing={2}>
          <Grid item xs={10} md={4}>
            <AppDateRangeSelector
              id="findPaymentDateDownloadPayment"
              dateStart={moment(dateInit).toDate()}
              dateEnd={moment(dateEnd).toDate()}
              onChange={({dateEnd, dateStart}) => {                
                setDateInit(dateToInputDate(dateStart.toISOString()))
                setDateEnd(dateToInputDate(dateEnd.toISOString()))
              }}
            />
          </Grid>
          <Grid item xs={10} md={6}>
            <TextField
              fullWidth
              size="small"
              label="Buscar cliente"
              placeholder="Nombre, teléfono o email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  loadCustomers()
                }
              }}
            />
          </Grid>
          <Grid item xs={2} md={2}>
            <Button variant="contained" size="small" onClick={loadCustomers}> <Download/> </Button>
          </Grid>
        </Grid>
    </Paper>
  )
}


