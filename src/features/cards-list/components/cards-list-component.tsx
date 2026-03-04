/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import { Button, ButtonGroup, TableBody, TableCell, TableContainer, TableHead, TableRow, Table, IconButton, Chip, Box } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import { useEffect, useRef, useState } from "react"
import { addCardToPreviewsAction, fetchCardsThunk, getCardResumeThunk, removeCardFromPreviewsAction, setCoordMapModalCardsListAction, setNewCardListSorted, updateCardsSortThunk } from "../cards-list.slice"
import { Add, Dangerous, Info, LocationOn, RemoveRedEye, VisibilityOff } from "@mui/icons-material"
import { CardInterface } from "../../../app/models/card-interface"
import React from "react"
import CardResumeComponent from "./card-resume-component"
import { setCardDatFromListAction, showPaymentModalAction } from "../../payments/add-payment/add-payment.slice"


export default function CardListComponent(){
  const { cards, emptyList, cardsAtPreview } = useAppSelector((state: RootState) => state.cardsList)
  const [ currentIndexDrop, setCurrentIndexDrop ] = useState<number>(-1)
  const [ overItemIndexDrop, setOverItemIndexDrop ] = useState<number>(-1)
  const dispatch = useAppDispatch();

  const nSpans = 7

  useEffect(()=> {
    if(cards.length === 0 && !emptyList){
      dispatch(fetchCardsThunk())
    }
  }, [cards, emptyList])

  const  dragItem = useRef()
  const  dragOver = useRef()

  const dragStart = (e: any) => {
    const index = e.target.getAttribute("data-index")
    setCurrentIndexDrop(index);
    dragItem.current = e.target.id
  }

  const dragEnter = (e: any) => {
    const index = e.currentTarget.getAttribute("data-index")
    dragOver.current = e.currentTarget.id
    setOverItemIndexDrop(Number(index))
  }

  useEffect(() => {
  }, [overItemIndexDrop])

  const dropEnd = () => {
    const copyList = [...cards];
    const dragItemContent = copyList[currentIndexDrop];
    copyList.splice(currentIndexDrop, 1)
    copyList.splice(overItemIndexDrop, 0, dragItemContent)
    dragItem.current = undefined
    dragOver.current = undefined
    setCurrentIndexDrop(-1)
    setOverItemIndexDrop(-1)
    dispatch(setNewCardListSorted(copyList))
    const cardIds: string[] = copyList.map((el: CardInterface , i) => el._id!);
    dispatch(updateCardsSortThunk(cardIds))
  }

  const clickOnCard = (cardId: string) => {
    if(cardsAtPreview[cardId] === undefined){
      dispatch(addCardToPreviewsAction(cardId))
      dispatch(getCardResumeThunk(cardId))
    }else{
      dispatch(removeCardFromPreviewsAction(cardId))
    }
  }

  const determineRowColor = (card: CardInterface): string  => {
    if(card.status === 1){
      return "black"
    }else {
      return ""
    }
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Nº</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">Nombre</TableCell>
              <TableCell align="center">Abono</TableCell>
              <TableCell align="center">Saldo</TableCell>
              <TableCell align="center">Ultimo Pago</TableCell>
              <TableCell align="center"> <LocationOn/> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cards.map((el, i) => {
              const isCardAtPreview = cardsAtPreview[el._id!] !== undefined;

              return (
                <React.Fragment key={el._id} >
                  {overItemIndexDrop === i && <TableRow> <TableCell colSpan={7}> Nueva Posicion </TableCell></TableRow>}
                  <TableRow  key={el._id} component={'tr'} onDragStart={dragStart} onDragEnter={dragEnter} onDragEnd={dropEnd}  draggable data-id={el._id} data-index={i}> 
                    <TableCell sx={{backgroundColor: determineRowColor(el)}} >{i+1}</TableCell>
                    <TableCell>
                      <ButtonGroup variant="contained">
                        <Button size="small" sx={{padding: "2px"}} color="info" onClick={() => clickOnCard(el._id!)}> 
                          {!isCardAtPreview ? <RemoveRedEye fontSize={"small"} /> : <VisibilityOff fontSize={"small"} />}   
                        </Button>
                        <Button size="small" sx={{padding: "2px"}} color="secondary"> <Info fontSize={"small"} />  </Button>
                        <Button size="small" sx={{padding: "2px"}} color="error"> <Dangerous fontSize={"small"} />  </Button>

                      </ButtonGroup>
                    </TableCell>
                    <TableCell>{el.name}</TableCell>
                    <TableCell align="center">
                      <Box display={"flex"} alignItems={"center"}>
                        <Chip label={el.todayPaymentsTotal ?? 0} />
                        <IconButton color="success" onClick={() => {
                          dispatch(showPaymentModalAction(true))
                          dispatch(setCardDatFromListAction(el))
                        }}> <Add /> </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>{el.total - (el.totalPayed ?? 0)}</TableCell>
                    <TableCell> {el.date?.toString()} </TableCell>
                    <TableCell> <Button size="small" onClick={() => {
                      dispatch(setCoordMapModalCardsListAction({latitude: el.lat, longitude: el.lng}))
                    }}> <LocationOn fontSize="small" /></Button>  </TableCell>
                  </TableRow>
                  {isCardAtPreview && <TableRow>
                      <TableCell colSpan={nSpans}>
                        <CardResumeComponent cardData={cardsAtPreview[el._id!]} />
                      </TableCell>
                  </TableRow>}
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
