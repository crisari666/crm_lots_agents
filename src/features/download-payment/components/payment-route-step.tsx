import {  Checkbox, Chip, Grid, IconButton, ListItemIcon, Typography } from "@mui/material";
import { useAppDispatch } from "../../../app/hooks";
import { TouchApp } from "@mui/icons-material";
import { MultiplePercentageType, SinglePercentageType, TypePercentageEnum } from "../business-logic/download-payment.state";
import { filterUserPercentageThunk } from "../../user-percentage/slice/user-percentage.slice";
import { changePercentageDialogPercentageAct, setTypePercentageToPickDPAct, showDialogPickPercentageDPAct } from "../business-logic/download-payment.slice";
export default function PaymentRouteStep({type, percentagesData, enable, isMultiple = false, percentageData} : {type: TypePercentageEnum, percentageData?: SinglePercentageType, enable: boolean, isMultiple?: boolean, percentagesData?: MultiplePercentageType}) {
  const dispatch = useAppDispatch()

  const nDecimals = 0
  
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Typography textAlign={'center'} variant="caption"> {type}</Typography>
        </Grid>
      </Grid>
      <Grid container sx={{borderBottom: '1px solid #ccc'}} alignItems={'center'} wrap="nowrap">
        <Grid item>
          <ListItemIcon><Checkbox color="primary" disabled={true} checked={isMultiple ? percentagesData!?.users?.length > 0 : percentageData?.percentage !== undefined}/></ListItemIcon>
        </Grid>
        <Grid item flexGrow={1}>
          {!isMultiple && percentageData?.percentage && <Chip color="secondary" size="small" label={percentageData?.userNick} />}
          {isMultiple && percentagesData!.users.length > 0 && percentagesData!.userPercentageData!.map((u, i) => <Chip key={u.user} color="secondary" size="small" label={`${u.userNick}|${u.value}`}/>) }

        </Grid>
        <Grid item>
          <IconButton edge="start"
            disabled={!enable}
            color="primary"
            onClick={() => {
              dispatch(filterUserPercentageThunk({type}))
              dispatch(setTypePercentageToPickDPAct(type))
              dispatch(showDialogPickPercentageDPAct(true))
              if(!isMultiple) {
                dispatch(changePercentageDialogPercentageAct(Number(percentageData?.percentage)))
              }
            }}
          > <TouchApp fontSize="small"/> </ IconButton>
        </Grid>
      </Grid>
      <Grid container sx={{marginTop: 2, borderBottom: '1px solid #ccc', paddingBottom: 1}}>
        <Grid item xs={4} textAlign={'center'}>
          <Chip size="small" color={'primary'} label={`${isMultiple ? Number(percentagesData?.before).toFixed(nDecimals) : Number(percentageData?.before).toFixed(nDecimals)}`}/>
        </Grid>
        <Grid item xs={4} textAlign={'center'}> 
          <Chip color="error" size="small" label={`${Number(isMultiple ? percentagesData?.value  : percentageData?.value).toFixed(nDecimals)}`} /> 
        </Grid> 
        <Grid item xs={4} textAlign={'center'}>
          <Chip size="small" color="success" label={`${isMultiple ? Number(percentagesData?.after).toFixed(nDecimals) : Number(percentageData?.after).toFixed(nDecimals)}`}/>
        </Grid>
      </Grid>
    </>
  )
}