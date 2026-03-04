import * as io from "socket.io-client"

export interface EventsGatewayState {
  socket?: io.Socket,
  showSureHardOff: boolean
}