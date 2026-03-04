import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Input } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import AppTextField from "../../../app/components/app-textfield";
import { displayUserRankedFormAct, updateInputUserRankedFormAct, updateUserRankThunk } from "../slice/user-list.slice";
import AppSelector from "../../../app/components/app-select";
import { getOfficeLevelsThunk } from "../../offices/office-levels/slice/office-level.slice";
import { useEffect } from "react";
export default function FornUserRank() {
  const dispatch = useAppDispatch()
  const { displayFormRankedUser, userRankedForm } = useAppSelector((state) => state.users) 
  const { officeLevels } = useAppSelector((state) => state.officesLevel) 
  const { officeLevelId, userId, userName } = userRankedForm
  
  useEffect(() => {
    dispatch(getOfficeLevelsThunk())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const closeDialog = () => {
    dispatch(displayUserRankedFormAct(false)) 
  }

  const changeInput = (d : {name: string, val: string}) => {
    dispatch(updateInputUserRankedFormAct(d))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    dispatch(updateUserRankThunk({officeLevelId, userId}))
  }

  return (
    <>
      <Dialog open={displayFormRankedUser}>
        <IconButton onClick={closeDialog} className="closeDialog"> <Close  /></IconButton>
        <DialogTitle> Clasificacion de usuario </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <AppTextField label="Nombre" readonly value={userName} />
                <Input type="hidden" value={userId}/>
              </Grid>
              <Grid item xs={12}>
                <AppSelector name="officeLevelId" options={officeLevels.map((l) => ({name: l.title, _id: l._id})
                )} label="Clasificacion" value={officeLevelId} onChange={changeInput} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type="submit"> GUARDAR </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}