import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { fetchSubadminsThunk } from "../../slice/user-list.slice"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Dialog,
  Button
} from "@mui/material"
import { Circle, Person } from "@mui/icons-material"
import SubadminOfficeSelector from "./subadmin-office-selector"
import UserInterface from "../../../../app/models/user-interface"
import { getOfficesThunk } from "../../../offices/offices-list/offices-list.slice"
import SubadminVentorsReadonly from "./subadmin-ventors-readonly"
import { getSubadminVentorsReq } from "../../../../app/services/users.service"

export default function AuditsList() {
  const dispatch = useAppDispatch()
  const { audits, loading } = useAppSelector((state) => state.users)
  const { offices, gotOffices } = useAppSelector((state) => state.offices)
  const [selectedAudit, setSelectedAudit] = useState<UserInterface | null>(null)
  const [showOfficeDialog, setShowOfficeDialog] = useState(false)
  const [showUsersDialog, setShowUsersDialog] = useState(false)
  const [ventorCountBySubadmin, setVentorCountBySubadmin] = useState<Record<string, number>>({})

  useEffect(() => {
    dispatch(fetchSubadminsThunk())
  }, [dispatch])

  useEffect(() => {
    if(!gotOffices) {
      dispatch(getOfficesThunk())
    }
  }, [gotOffices, dispatch])

  useEffect(() => {
    const loadCounts = async (): Promise<void> => {
      try {
        const pairs = await Promise.all(
          audits
            .filter((audit) => Boolean(audit._id))
            .map(async (audit) => {
              const ventors = await getSubadminVentorsReq(String(audit._id))
              return [String(audit._id), ventors.length] as const
            }),
        )
        setVentorCountBySubadmin(Object.fromEntries(pairs))
      } catch (error) {
        console.error("Error loading subadmin ventor totals", error)
      }
    }
    if (audits.length > 0) {
      loadCounts()
    } else {
      setVentorCountBySubadmin({})
    }
  }, [audits, showUsersDialog])

  const handleOfficeClick = (audit: UserInterface) => {
    setSelectedAudit(audit)
    setShowOfficeDialog(true)
  }

  const handleCloseDialog = () => {
    setShowOfficeDialog(false)
    setShowUsersDialog(false)
    setSelectedAudit(null)
  }

  const handleUsersClick = (audit: UserInterface) => {
    setSelectedAudit(audit)
    setShowUsersDialog(true)
  }

  // Helper function to get offices where this subadmin is assigned as subadmin
  const getSubadminOffices = (audit: UserInterface) => {
    return offices.filter(office => office.subadmin === audit._id)
  }

  // Helper function to get office chips for subadmin assignments
  const getSubadminOfficeChips = (audit: UserInterface) => {
    const subadminOffices = getSubadminOffices(audit)
    if (subadminOffices.length > 0) {
      return subadminOffices.map((office) => (
        <Chip
          key={office._id}
          label={office.name}
          size="small"
          variant="outlined"
          color="primary"
          sx={{ mr: 0.5, mb: 0.5 }}
        />
      ))
    }
    return <Typography variant="body2" color="text.secondary">No offices assigned</Typography>
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        Audits/Subadmins
      </Typography>
      
      <TableContainer component={Paper} elevation={2}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Assigned Offices</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Connected</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {audits.map((audit) => (
              <TableRow 
                key={audit._id} 
                hover
                sx={{ '&:hover': { backgroundColor: 'grey.50' } }}
              >
                <TableCell>
                  {audit.name} {audit.lastName}
                </TableCell>
                <TableCell>{audit.email}</TableCell>
                <TableCell 
                  onClick={() => handleOfficeClick(audit)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { 
                      backgroundColor: 'primary.light',
                      color: 'white'
                    }
                  }}
                >
                  <Box display="flex" flexWrap="wrap" alignItems="center">
                    {getSubadminOfficeChips(audit)}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={
                      <Circle 
                        sx={{ 
                          fontSize: '12px',
                          color: audit.connected ? 'success.main' : 'error.main'
                        }} 
                      />
                    }
                    label={audit.connected ? 'Online' : 'Offline'}
                    size="small"
                    color={audit.connected ? 'success' : 'error'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<Person />}
                    onClick={() => handleUsersClick(audit)}
                    size="small"
                  >
                    Usuarios ({ventorCountBySubadmin[String(audit._id)] ?? 0})
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {audits.length === 0 && (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            py={4}
          >
            <Typography variant="body2" color="text.secondary">
              No audits/subadmins found
            </Typography>
          </Box>
        )}
      </TableContainer>

      <Dialog 
        open={showOfficeDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedAudit && (
          <SubadminOfficeSelector 
            audit={selectedAudit} 
            onClose={handleCloseDialog} 
          />
        )}
      </Dialog>
      <Dialog
        open={showUsersDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedAudit && (
          <SubadminVentorsReadonly
            audit={selectedAudit}
            onClose={handleCloseDialog}
          />
        )}
      </Dialog>
    </Box>
  )
}