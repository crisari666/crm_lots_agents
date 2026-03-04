import { Chip, Grid, IconButton, Paper } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import AppSelector from "../../../../app/components/app-select"
import { dateToInputDate } from "../../../../utils/date.utils"
import { addPartnerAct, changeCampaignPaysLogsAct, changeOfficePaysHistoryAct, changePercentageSinglePartnersAct, changeUserPaysHistoryAct, getCampaignInfoThunk, getOfficesGoalsResumeThunk, getPaymendDowloadedByCampaignThunk, getTotalExpensesByCampaignThunk, showResumeDialogAct } from "../../business-logic/download-payment-history.slice"
import { useEffect } from "react"
import AppAutoComplete, { AppAutocompleteOption } from "../../../../app/components/app-autocomplete"
import { fetchUsersThunk } from "../../../users-list/slice/user-list.slice"
import { numberToCurrency } from "../../../../utils/numbers.utils"
import { Person2 } from "@mui/icons-material"
import { getOfficesThunk } from "../../../offices/offices-list/offices-list.slice"


export default function DonwloadPaysLogsControl() {
  const dispatch = useAppDispatch()
  const { campaignsHistory, campaignPicked, userSearchTotal, userSearch, currentCampaign, officeSearch } = useAppSelector((state) => state.downloadPaysHistory) 
  const { usersOriginal, gotUsers } = useAppSelector((state) => state.users) 
  const { offices, gotOffices } = useAppSelector((state) => state.offices) 

  useEffect(() => {
    if(campaignPicked !== '')  {
      dispatch(getPaymendDowloadedByCampaignThunk({campaignId: campaignPicked}))
      dispatch(getTotalExpensesByCampaignThunk(campaignPicked))
      dispatch(getCampaignInfoThunk(campaignPicked))
    }
  }, [campaignPicked, dispatch])

  useEffect(() => {
    if(!gotUsers) {
      dispatch(fetchUsersThunk({enable: true}))
    }
    if(!gotOffices) {
      dispatch(getOfficesThunk())
    }
  }, [] )

  useEffect(()  => {
    const exec = async () => {
      if(currentCampaign !== undefined && currentCampaign.partners && currentCampaign.partners.userPercentageData) {
        let i = 0
        for await (const p of currentCampaign.partners.userPercentageData) {
            const indexUser = usersOriginal.findIndex((u) => u._id === p.user)
            if(indexUser !== -1) {
              const user = usersOriginal[indexUser]
              dispatch(addPartnerAct({_id: user._id!, name: usersOriginal[indexUser].email}))
              updatePartnersPercentage(i, p.percentage)
              i = i + 1
            }
        }
       
      }
    }
    exec()
  }, [currentCampaign]);

  const updatePartnersPercentage = (i: number, p:  number) => setTimeout(() => {
    dispatch(changePercentageSinglePartnersAct({index: i, percentage: p}))
  }, 1000)


  return (
    <>
      <Paper sx={{padding: 2}}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <AppSelector 
              options={campaignsHistory.slice(0, 15).map((e) => ({_id: e._id, name: `${dateToInputDate(e.dateStart)} / ${dateToInputDate(e.dateEnd)}`}))} 
              label="Campaign"
              value={campaignPicked}
              onChange={(d) => {
                dispatch(changeCampaignPaysLogsAct(d.val));
                dispatch(getOfficesGoalsResumeThunk(d.val))
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <AppAutoComplete 
              multiple={false}
              name="searchUser"
              value={userSearch !== '' ? {_id: userSearch, name: usersOriginal.filter((e) => e._id === userSearch)[0].email} : undefined}
              onChange={(d) => d.val !== null ? dispatch(changeUserPaysHistoryAct({userId: d.val._id})) : dispatch(changeUserPaysHistoryAct({userId: ''}))}
              label="Search User"
              options={usersOriginal.map((e) => ({_id: e._id, name: e.email}))as unknown as AppAutocompleteOption[]} 
            />
          </Grid>
          <Grid item xs={3}>
            <AppAutoComplete 
              multiple={false}
              name="searchOffice"
              value={officeSearch !== '' ? {_id: officeSearch, name: offices.filter((e) => e._id === officeSearch)[0].title} : undefined}
              onChange={(d) => d.val !== null ? dispatch(changeOfficePaysHistoryAct(d.val._id)) : dispatch(changeOfficePaysHistoryAct(''))}
              label="Search Office"
              options={offices.map((e) => ({_id: e._id, name: e.name}))as unknown as AppAutocompleteOption[]} 
            />
          </Grid>
          <Grid item>
            <Chip color="success" label={numberToCurrency(userSearchTotal)} />
          </Grid>
          <Grid item>
            <IconButton onClick={() => dispatch(showResumeDialogAct(true))}> <Person2/> </IconButton>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}