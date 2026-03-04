import { Button, ButtonGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useAppSelector } from "../../../app/hooks";
import { RootState } from "../../../app/store";
import { useNavigate } from "react-router-dom";

export default function RafflesList () {
  const { raffles } = useAppSelector((state: RootState) => state.raflesList)

  const navigate = useNavigate()

  const editRaffle = (raffleId: string) => {
    navigate(`/dashboard/handel-raffle/${raffleId}`)
  }
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Activo</TableCell>
            <TableCell>N Imgs</TableCell>
            <TableCell>Opciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {raffles.map((raffle) => {
            return (
              <TableRow key={raffle._id}>
                <TableCell>{raffle.datePrize.split("T")[0]}</TableCell>
                <TableCell>{raffle.name}</TableCell>
                <TableCell>{raffle.status}</TableCell>
                <TableCell>{raffle.images.length}</TableCell>
                <TableCell>
                  <ButtonGroup size="small">
                    <Button color="info" onClick={() => editRaffle(raffle._id)}>Editar</Button>
                    <Button color="error">Eliminar</Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}