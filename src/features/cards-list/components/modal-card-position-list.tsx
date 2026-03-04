import Modal from "@mui/material/Modal"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import Box from "@mui/material/Box"
import MapComponent from "../../../app/components/map-component"
import { hideModelPosCardCardsListAction } from "../cards-list.slice"

export function CardPositionModalCardList() {
  const dispatch = useAppDispatch()
  const {
    showMapListCards,
    currentCoordsModalMap = { latitude: 0, longitude: 0 },
  } = useAppSelector((state: RootState) => state.cardsList)

  return (
    <Modal
      open={showMapListCards && currentCoordsModalMap !== undefined}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClose={() => dispatch(hideModelPosCardCardsListAction())}
    >
      <Box height={"600px"} width={"600px"}>
        <MapComponent
          zoom={12}
          center={{
            lat: currentCoordsModalMap?.latitude as number,
            lng: currentCoordsModalMap?.longitude as number,
          }}
          markers={[
            new window.google.maps.Marker({
              position: {
                lat: currentCoordsModalMap?.latitude,
                lng: currentCoordsModalMap?.longitude,
              },
            }),
          ]}
        />
      </Box>
    </Modal>
  )
}
