import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import UserInterface from '../../../../app/models/user-interface'
import { getSubadminVentorsReq } from '../../../../app/services/users.service'

type SubadminVentorsReadonlyProps = {
  audit: UserInterface
  onClose: () => void
}

export default function SubadminVentorsReadonly({
  audit,
  onClose,
}: SubadminVentorsReadonlyProps) {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [ventors, setVentors] = useState<UserInterface[]>([])
  useEffect(() => {
    const loadVentors = async (): Promise<void> => {
      if (!audit._id) {
        setLoading(false)
        return
      }
      setLoading(true)
      setError('')
      try {
        const rows = await getSubadminVentorsReq(String(audit._id))
        setVentors(rows)
      } catch (err) {
        setError(String(err))
      } finally {
        setLoading(false)
      }
    }
    void loadVentors()
  }, [audit._id])
  return (
    <>
      <DialogTitle>
        Ventores — {audit.name} {audit.lastName}
      </DialogTitle>
      <DialogContent>
        {loading && (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress />
          </Box>
        )}
        {!loading && error !== '' && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        {!loading && error === '' && ventors.length === 0 && (
          <Typography color="text.secondary" variant="body2">
            No hay ventores asignados.
          </Typography>
        )}
        {!loading && ventors.length > 0 && (
          <List dense>
            {ventors.map((ventor) => (
              <ListItem key={ventor._id}>
                <ListItemText
                  primary={`${ventor.name ?? ''} ${ventor.lastName ?? ''}`.trim()}
                  secondary={ventor.email}
                />
              </ListItem>
            ))}
          </List>
        )}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onClose}>
            Cerrar
          </Button>
        </Box>
      </DialogContent>
    </>
  )
}
