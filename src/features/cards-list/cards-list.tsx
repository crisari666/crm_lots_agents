/* eslint-disable prettier/prettier */
import { Box, Grid } from "@mui/material"
import LoadingIndicator from "../../app/components/loading-indicator"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { RootState } from "../../app/store"
import CardsListComponent from "./components/cards-list-component"
import { CardPositionModalCardList } from "./components/modal-card-position-list"
import { Wrapper } from "@googlemaps/react-wrapper"
import { OmegaSoftConstants } from "../../app/khas-web-constants"
import CardListUserSelector from "./components/card-list-user-selector"
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import { CheckUserAllowedComponent } from "../../app/components/check-user-allowed-component"
import AddPaymentModal from "../payments/add-payment/add-payment-modal"
import { fetchCardsByUserIdThunk } from "./cards-list.slice"
import { clearStateCreateCardAction } from "../handle-card/handle-card.slice"

export function CardsList() {
  const { loading } = useAppSelector((state: RootState) => state.cardsList)
  const dispatch = useAppDispatch();

  const { userId } = useParams()

  useEffect(() => {
    dispatch(clearStateCreateCardAction())
  }, [])

  useEffect(() => {
    if (userId) {    
       dispatch(fetchCardsByUserIdThunk({userId}))
    }
  }, [userId, dispatch])

  return (
    <CheckUserAllowedComponent >
      <Box>
        <LoadingIndicator open={loading} />
        <> Lista de tarjetas </>
        
        <CheckUserAllowedComponent checkIfAdmin={true}>
          <Box marginTop={3}>
            <Grid container>
              <Grid item xs={6} lg={4}>
                <CardListUserSelector userId={userId} />
              </Grid>
            </Grid>
          </Box>
        </CheckUserAllowedComponent>
        {/* } */}
        <CardsListComponent />
        <Wrapper apiKey={OmegaSoftConstants.googleApiKey}>
          <CardPositionModalCardList />
        </Wrapper>
      </Box>
      <AddPaymentModal />
    </CheckUserAllowedComponent>
  )
}
