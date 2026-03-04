import { useSelector } from "react-redux"
import { RootState } from "../../../app/store"
import { useAppDispatch } from "../../../app/hooks"
import { Box, Button, Card, Divider, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material"
import DialogHandlePrize from "./dialog-handle-prize"
import { clearPrizeFormAct, sendPrizeRaffleThunk, setPrizeForImagsAct, setPrizeFormRaffleAct } from "../handle-raffle.slice"
import { Add, Edit, Photo } from "@mui/icons-material"
import { numberToCurrency } from "../../../utils/numbers.utils"
import DialogHandlePrizeImgs from "./dialog-handle-prize-imgs"

export default function RafflePrizesHandler() {
  const { currentRaffle, prizeForm, prizeForImgs } = useSelector((state: RootState) => state.raffle)
  const dispatch = useAppDispatch()
  
  return(
    <> 
      {currentRaffle !== undefined && <Card sx={{padding: "5px"}}>
      <DialogHandlePrizeImgs show={prizeForImgs !== undefined} prize={prizeForImgs} onClose={() => dispatch(setPrizeForImagsAct(undefined))}/>
        <Box padding={1}>
            {prizeForm !== undefined && <DialogHandlePrize show={prizeForm !== undefined} prize={prizeForm} onClose={() => dispatch(clearPrizeFormAct())}
              onConfirm={() => dispatch(sendPrizeRaffleThunk({prize: prizeForm!}))}
            />}
            <Button variant="contained" onClick={() => dispatch(setPrizeFormRaffleAct({
              description: "",
              images: [],
              name: "",
              raffle: currentRaffle._id!,
              price: ""
             }))}
          >AGREGAR PREMIO  <Add/> </Button>
            <Divider sx={{marginBlock: "10px"}} />
            <List>
              {currentRaffle.prizes.map((el, i) => {
                return(
                  <ListItem 
                    
                    key={el._id!}
            
                    secondaryAction={
                      <IconButton color="secondary" onClick={() => dispatch(setPrizeFormRaffleAct(el))}> <Edit/> </IconButton>
                    }
                  >
                    <ListItemText
                      primary={el.name}
                      secondary={` ${el.description} | $ ${numberToCurrency(el.price)} `}
                
                     />
                    <ListItemButton onClick={() => dispatch(setPrizeForImagsAct(el))}>
                      <Photo color="primary" sx={{margin: "0 auto"}}/>
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>
        </Box>
      </Card>} 
    </>
  )
}