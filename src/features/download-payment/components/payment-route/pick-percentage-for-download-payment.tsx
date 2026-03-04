import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import React, { useEffect } from "react";
import { changeMultiplePercentageForPaymentAct, changePercentageDialogPercentageAct, changePercentageMainPartnerAct, changePercentageOfUserGroupPercentage, changeSinglePercentageForPaymentStepAct, changeUserDialogPercentageAct, changeUsersDialogPercentageAct, showDialogPickPercentageDPAct } from "../../business-logic/download-payment.slice";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import AppAutoComplete, { AppAutocompleteOption } from "../../../../app/components/app-autocomplete";
import AppTextField from "../../../../app/components/app-textfield";
import { TypePercentageEnum } from "../../business-logic/download-payment.state";

const typePercentageMultiples = [TypePercentageEnum.subLead, TypePercentageEnum.partner, TypePercentageEnum.officeLead, TypePercentageEnum.mainPartner];

export default function PickPercentageForDownloadPaymentDialog() {
  const dispatch = useAppDispatch()
  const {showDialogPickPercentage, typePercentageToPick, dialogPercentage, paymentRouteCalc, lastUserPaymentDownloaded} = useAppSelector((state) => state.downloadPayment)

  const isMultiple = typePercentageMultiples.includes(typePercentageToPick);
  const { percentage, user, users, usersAdded } = dialogPercentage
  const { usersOriginal } = useAppSelector((state) => state.users)
  const closeDialog = () => dispatch(showDialogPickPercentageDPAct(false))

  const optionUsers = () => {
    let opts = usersOriginal.filter((u) => {
      let resolve = (u.office !== null && (u.office as any).enable === true) || !u.offce
      if(typePercentageToPick === TypePercentageEnum.collector) resolve = resolve && u.level === 5
      if(typePercentageToPick === TypePercentageEnum.officeLead) resolve = resolve && (u.level === 2 || u.level === 3)
      if(typePercentageToPick === TypePercentageEnum.subLead) resolve = resolve && (u.level === 2 || u.level === 3)
      if(typePercentageToPick === TypePercentageEnum.worker) resolve = resolve && u.level! >= 2 && u.level! <= 4
      if(typePercentageToPick === TypePercentageEnum.leadWorker) resolve = resolve && u.level! < 4
      if(typePercentageToPick === TypePercentageEnum.partner) resolve = resolve && u.level! < 4
      if(typePercentageToPick === TypePercentageEnum.mainPartner) resolve = resolve && u.level! === 0
      return resolve
    }
    ).map((u) => ({_id: u._id, name: `${u.email} | ${u.name} | ${u.lastName}`})) as AppAutocompleteOption[]

    return opts
  }

  useEffect(() => {
    if(lastUserPaymentDownloaded !== undefined) {
      const p = lastUserPaymentDownloaded
      const users: AppAutocompleteOption[] = optionUsers()
      // if(p.worker.user !== undefined) {
      //   const indexUser = users.findIndex((u) => u._id === p.worker.user)
      //   if(indexUser !== -1) {
      //     dispatch(changeSinglePercentageForPaymentStepAct({percentage: p.worker.percentage, type: TypePercentageEnum.worker, user: p.worker.user, userNick: `${p.worker.percentage}% | ${users[indexUser].name.split('|')[0].trim()}`}))
      //   }
      // }

      if(p.collector.user !== undefined) {
        const indexUser = users.findIndex((u) => u._id === p.collector.user)
        if(indexUser !== -1) {
          dispatch(changeSinglePercentageForPaymentStepAct({percentage: p.collector.percentage, type: TypePercentageEnum.collector, user: p.collector.user, userNick: `${p.collector.percentage}% | ${users[indexUser].name.split('|')[0].trim()}`}))
        }
      }

      if(p.leadWorker.user !== undefined) {
        const indexUser = users.findIndex((u) => u._id === p.leadWorker.user)
        if(indexUser !== -1) {
          dispatch(changeSinglePercentageForPaymentStepAct({percentage: p.leadWorker.percentage, type: TypePercentageEnum.leadWorker, user: p.leadWorker.user, userNick: `${p.leadWorker.percentage}% | ${users[indexUser].name.split('|')[0].trim()}`}))
        }
      }

      if(p.officeLead.users.length > 0) {
        const usersChose = users.filter((u) => p.officeLead.users.includes(u._id));        
        dispatch(changeUsersDialogPercentageAct(usersChose))        
        p.officeLead.usersPercentage.forEach((u) => {
          dispatch(changePercentageOfUserGroupPercentage({percentage: u.percentage, userId: u.user}))
        })
        dispatch(changeMultiplePercentageForPaymentAct({type: TypePercentageEnum.officeLead}))
      }

      if(p.subleads.users.length > 0) {
        const usersChose = users.filter((u) => p.subleads.users.includes(u._id));        
        dispatch(changeUsersDialogPercentageAct(usersChose))        
        p.subleads.usersPercentage.forEach((u) => {
          dispatch(changePercentageOfUserGroupPercentage({percentage: u.percentage, userId: u.user}))
        })
        dispatch(changeMultiplePercentageForPaymentAct({type: TypePercentageEnum.subLead}))
      }

      if(p.admins.length > 0) { 
        p.admins.forEach((a) => {
          const indexUser = paymentRouteCalc.mainPartner.userPercentageData.findIndex((u) => u.user === a.user)
          if(indexUser !== -1) {
            dispatch(changePercentageMainPartnerAct({index: indexUser, percentage: a.percentage}))
          }
        })
      }
    }
  },[lastUserPaymentDownloaded])

  useEffect(() => {
    if(showDialogPickPercentage === true) {
      if(lastUserPaymentDownloaded === undefined){
        if(typePercentageToPick === TypePercentageEnum.collector) changePercentage(13)
        if(typePercentageToPick === TypePercentageEnum.worker) changePercentage(30)
        if(typePercentageToPick === TypePercentageEnum.leadWorker) changePercentage(12.5)
        if(typePercentageToPick === TypePercentageEnum.officeLead) changePercentage(5)
        if(typePercentageToPick === TypePercentageEnum.subLead) changePercentage(3)
      }


      if((typePercentageToPick === TypePercentageEnum.collector || typePercentageToPick === TypePercentageEnum.worker || typePercentageToPick === TypePercentageEnum.leadWorker) && paymentRouteCalc[typePercentageToPick].user !== undefined) {
        const indexSelectedUser = optionUsers().findIndex((u) => u._id === paymentRouteCalc[typePercentageToPick].user) 
        if(indexSelectedUser !== -1) {
          dispatch(changeUserDialogPercentageAct({user: optionUsers()[indexSelectedUser]}))
        }
      } else if((typePercentageToPick === TypePercentageEnum.officeLead || typePercentageToPick === TypePercentageEnum.partner || typePercentageToPick === TypePercentageEnum.mainPartner || typePercentageToPick === TypePercentageEnum.subLead) && paymentRouteCalc[typePercentageToPick].users.length > 0) {
        const userChose = optionUsers().filter((u) => paymentRouteCalc[typePercentageToPick].users.includes(u._id));
        dispatch(changeUsersDialogPercentageAct(userChose))

        paymentRouteCalc[typePercentageToPick].userPercentageData.forEach((u) => {
          dispatch(changePercentageOfUserGroupPercentage({percentage: u.percentage, userId: u.user}))
        })
      }
    }
  }, [showDialogPickPercentage])

  const changePercentage = (val: any) => dispatch(changePercentageDialogPercentageAct(Number(val)))

  const changeSelector = ({val} : {val: any}) => {
    if(!isMultiple) {
      dispatch(changeUserDialogPercentageAct({user: val}))
    } else {
      dispatch(changeUsersDialogPercentageAct(val))
    }
  }
  const submitForm = (e: any) => {
    e.preventDefault()    
    if(!isMultiple) {
      dispatch(changeSinglePercentageForPaymentStepAct({
        percentage, 
        type: typePercentageToPick,
        user: user._id,
        userNick:`${percentage}% | ${user.name.split('|')[0].trim()}`
      }))
    } else {
      dispatch(changeMultiplePercentageForPaymentAct({type: typePercentageToPick}))
    }
    closeDialog()
  }
  return (
    <Dialog open={showDialogPickPercentage}>
      <IconButton onClick={closeDialog} className="closeDialog" > <Close /> </IconButton>
      <DialogTitle> Pick {typePercentageToPick} percentage</DialogTitle>
      <form onSubmit={submitForm}>
        <DialogContent sx={{minWidth: 600}}>
          {!isMultiple && <Grid container>
            <Grid item xs={4}>
              <AppTextField required value={percentage} type="number" name="percentage" label="Porcentaje" onChange={({val}) => changePercentage(val)}  />
            </Grid>
            <Grid item xs={8}>
              <AppAutoComplete
                name={typePercentageToPick.toString()}
                label="Usuarios" 
                value={user} 
                options={optionUsers()} 
                onChange={changeSelector} 
                multiple={false} 
              />
              
            </Grid>
          </Grid>}
          {isMultiple && 
           <Grid container spacing={2}>
            <Grid item xs={12}>
              <AppAutoComplete
                name={typePercentageToPick.toString()}
                label="Usuarios" 
                value={users} 
                options={optionUsers()} 
                onChange={changeSelector} 
                multiple={true} 
              />
            </Grid>
            <>
              {usersAdded.map((u, i) => <React.Fragment key={`${i}${u.userId}percentagePicker`}>
                <Grid item xs={4}>
                  <AppTextField label="%" value={u.percentage} type="number" inputProps={{step: 0.1}} onChange={(d) => dispatch(changePercentageOfUserGroupPercentage({index: i, percentage: Number(d.val)}))} />
                </Grid>
                <Grid item xs={8}>
                  <Chip color="primary" label={u.userNick} /> 
                </Grid>
              </React.Fragment>)}
            </>
          </Grid> 
          }
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="outlined" color="success"> ACEPTAR </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}