/* eslint-disable prettier/prettier */
import { Box, CircularProgress, Divider } from "@mui/material"
import { CardInterface } from "../../../app/models/card-interface"
import CardResumeHeadComponent from "./card-resume-head-component"
import CardHistoryPayments from "./card-history-payments"
import CardHistoryUnpaids from "./card-history-unpaids"

export default function CardResumeComponent({ cardData }: { cardData: CardInterface | boolean}) {
  
  
  return (
    <Box>
      <Box textAlign={"center"}>
        {cardData === true && <CircularProgress />}
        {cardData !== true && 
          <>
            <CardResumeHeadComponent cardData={cardData as CardInterface} />
            <Divider />
            <CardHistoryPayments cardData={cardData as CardInterface}/>
            <CardHistoryUnpaids unpaids={(cardData as CardInterface).unpaids}/>
          </>
        }
      </Box>
    </Box>
  )
}