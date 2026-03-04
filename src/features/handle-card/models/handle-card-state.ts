export interface HandleCardState {
  loading: boolean
  position?: PositionInterface
  showMap: boolean
  geoPosAllowed: boolean
  createdCard: boolean
  user?: string
}

export interface PositionInterface {
  latitude: number
  longitude: number
}
