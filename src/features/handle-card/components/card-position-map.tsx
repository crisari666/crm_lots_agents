/* eslint-disable prettier/prettier */
import { Box, Button, Grid, Modal } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import { setPositionHandleCardAction, setShowMapAction } from "../handle-card.slice"
import MapComponent from "../../../app/components/map-component"

export default function CardPositionMap() {
  const dispatch = useAppDispatch()
  const {showMap, position = {latitude: 0, longitude: 0}} = useAppSelector((state: RootState) => state.handleCard)

  const { latitude, longitude } = position
  

  const handleClickMapCoors = (latLng: any) => {
    const {lat, lng} = latLng
    dispatch(setPositionHandleCardAction({latitude: lat, longitude: lng}))
  }
  
  return (
    <>

      <Modal open={showMap} style={{display: "flex", justifyContent: "center", alignItems: "center"}} onClose={() => dispatch(setShowMapAction(false))}>
        <Box width={"600px"}>
          <Grid container>
            <Grid item xs={12}>
              <MapComponent zoom={14} center={{ lat: latitude, lng: longitude }} markers={[new window.google.maps.Marker({position: {lat: latitude, lng: longitude}}) ]} onClick={handleClickMapCoors} />
            </Grid>
            <Grid item xs={6}>
              <Button size="small" fullWidth disabled> Longitud: {longitude} </Button>
            </Grid>
            <Grid item xs={6}>
              <Button size="small" fullWidth disabled> Latitud: {latitude} </Button>
            </Grid>

          </Grid>
          
        </Box>
      </Modal>
    </>
  )
}
