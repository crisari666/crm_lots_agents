import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material"
import { PrizeInterface } from "../../../app/models/prize-inteface"
import InputApp from "../../../app/components/input-app"
import { Close } from "@mui/icons-material"
import { useAppDispatch } from "../../../app/hooks"
import { updateInputPrizeForm } from "../handle-raffle.slice"

export default function DialogHandlePrize({show, prize, onClose = () => {}, onConfirm = () => {}} : {show: boolean, prize?: PrizeInterface, onClose?: () => void, onConfirm?: () => void}) {
  const dispatch = useAppDispatch()

  const updateInput = (val: string, name: string) => {
    dispatch(updateInputPrizeForm({key: name, value: val}))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    onConfirm()
  }
  
  return (
    <Dialog open={show}>
      <DialogTitle>
        { prize!== undefined && prize!._id !== undefined ? "Editar Premio"  : "Agregar Premio"}
      </DialogTitle>
      <Button color="error" sx={{position: "absolute", top: 10, right: 2}} onClick={onClose}> <Close/> </Button>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{minWidth:"500px"}}>

            <Grid container>
              <Grid item xs={12}>
                <InputApp value={prize?.name} name={"name"} onChange={updateInput} placeholder="Nombre" required={true}/>
              </Grid>
              <Grid item xs={12}>
                <InputApp value={prize?.description} name={"description"} onChange={updateInput} placeholder="Descripcion" required={true} />
              </Grid>
              <Grid item xs={12}>
                <InputApp value={prize?.price} name={"price"} onChange={updateInput} placeholder="Precio" type="number" required={true}/>
              </Grid>
            </Grid>

          </DialogContent>
          <DialogActions>
              <Button color="success" variant="contained" sx={{marginRight: 2, marginBottom: 2}} type="submit"> GUARDAR </Button>
          </DialogActions>
        </form>
    </Dialog>
  )
}