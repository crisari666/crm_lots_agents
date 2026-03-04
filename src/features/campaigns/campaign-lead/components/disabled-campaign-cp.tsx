import { Alert, Paper } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { StopCircle } from "@mui/icons-material";
import { useEffect } from "react";
import { getOfficeCampaignThunk } from "../campaign-lead.slice";

export default function DisabledCampaignCP() {
  const { campaigGot, officeCampaign } = useAppSelector((state: RootState) => state.officeCampaign)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if(campaigGot === false) dispatch(getOfficeCampaignThunk())
  }, [])
  return(
    <>
      {campaigGot === true && officeCampaign === undefined && <Paper sx={{padding: 2}} elevation={4}>
        <Alert variant="filled" severity="info" icon={<StopCircle/>}>
          No hay campaña disponible, contacta a tu supervisor  
        </Alert>
      </Paper>}
    </>
  )
}