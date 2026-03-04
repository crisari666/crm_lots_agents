import { Grid, Paper } from "@mui/material"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import AppSelector from "../../../app/components/app-select"
import AppTextField from "../../../app/components/app-textfield"
import { getOfficesThunk } from "../../offices/offices-list/offices-list.slice"
import { updateTwilioListFilterAct } from "../slice/twilio-numbers.slice"

export default function TwilioListFilter() {
  const dispatch = useAppDispatch()
  const { twilioListFilter } = useAppSelector((state) => state.twilioNumbers)
  const { offices, gotOffices } = useAppSelector((state) => state.offices)

  const { officeId, search } = twilioListFilter

  useEffect(() => {
    if (!gotOffices) dispatch(getOfficesThunk())
  }, [dispatch, gotOffices])

  const changeFilter = (key: "officeId" | "search", value: string) => {
    dispatch(updateTwilioListFilterAct({ key, value }))
  }

  const officeOptions = offices
    .filter((o) => o.enable)
    .map((o) => ({ _id: o._id ?? "", name: o.name ?? "" }))

  return (
    <Paper sx={{ padding: 1, marginBottom: 1 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4} md={3}>
          <AppSelector
            value={officeId}
            label="Office"
            name="officeId"
            onChange={({ val }) => changeFilter("officeId", val ?? "")}
            options={officeOptions}
          />
        </Grid>
        <Grid item xs={12} sm={8} md={6}>
          <AppTextField
            label="Search (user name, email, number, PNID, friendly number)"
            name="search"
            value={search}
            onChange={({ val }) => changeFilter("search", val)}
          />
        </Grid>
      </Grid>
    </Paper>
  )
}
