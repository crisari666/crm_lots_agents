import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { getCurrentCampaignThunk } from "../../current-campaign/current-campaign.slice"
import { getCustomersCampaignDataThunk } from "../redux/campaign-customers-slice"
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider } from "@mui/material"
import { themeCondense } from "../../../../app/themes/theme-condense"
import LoadingIndicator from "../../../../app/components/loading-indicator"

export default function CustomersCampaignList() {
  const dispatch = useAppDispatch()
  const { currentCampaignGot, currentCampaign } = useAppSelector((state) => state.currentCampaign) 
  const { usersCampaignData, loading, listUpdated } = useAppSelector((state) => state.campaignCustomers) 

  useEffect(() => {
    if(listUpdated === true) {
      dispatch(getCustomersCampaignDataThunk(currentCampaign!._id))
    }
  }, [listUpdated])


  useEffect(() => {    
    if(!currentCampaignGot) {
      dispatch(getCurrentCampaignThunk())
     } else if(currentCampaignGot && currentCampaign) {
      dispatch(getCustomersCampaignDataThunk(currentCampaign!._id))
     }
  }, [currentCampaignGot])
  return (
    <ThemeProvider theme={themeCondense}>
      <LoadingIndicator open={loading}/>
      <Paper sx={{p: 2, marginBottom: 1}}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>i</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Asignados semana</TableCell>
                <TableCell>Rank</TableCell>
                <TableCell>Sede</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersCampaignData.map((userCampaignData, index) => (
                <TableRow key={userCampaignData._id}>
                  <TableCell>{index}</TableCell>
                  <TableCell>{userCampaignData.user.email}</TableCell>
                  <TableCell>{userCampaignData.customers.length}</TableCell>
                  <TableCell>{userCampaignData.user.rank?.title ?? "Sin rank"}</TableCell>
                  <TableCell>{userCampaignData.user.office.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </ThemeProvider>
  )
}