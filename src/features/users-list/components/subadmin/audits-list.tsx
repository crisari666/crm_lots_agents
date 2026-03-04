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
  Dialog
} from "@mui/material"
import { Circle } from "@mui/icons-material"
import SubadminOfficeSelector from "./subadmin-office-selector"
import UserInterface from "../../../../app/models/user-interface"
import OfficesTableList from "../../../offices/offices-list/components/offices-table-list"
import { getOfficesThunk } from "../../../offices/offices-list/offices-list.slice"

export default function AuditsList() {
  const dispatch = useAppDispatch()
  const { audits, loading } = useAppSelector((state) => state.users)
  const { offices, gotOffices } = useAppSelector((state) => state.offices)
  const [selectedAudit, setSelectedAudit] = useState<UserInterface | null>(null)
  const [showOfficeDialog, setShowOfficeDialog] = useState(false)

  useEffect(() => {
    dispatch(fetchSubadminsThunk())
  }, [dispatch])

  useEffect(() => {
    if(!gotOffices) {
      dispatch(getOfficesThunk())
    }
  }, [gotOffices, dispatch])

  const handleOfficeClick = (audit: UserInterface) => {
    setSelectedAudit(audit)
    setShowOfficeDialog(true)
  }

  const handleCloseDialog = () => {
    setShowOfficeDialog(false)
    setSelectedAudit(null)
  }

  // Helper function to get offices where this subadmin is assigned as subadmin
  const getSubadminOffices = (audit: UserInterface) => {
    return offices.filter(office => office.subadmin === audit._id)
  }

  // Helper function to get office display text for subadmin assignments
  const getSubadminOfficeDisplayText = (audit: UserInterface) => {
    const subadminOffices = getSubadminOffices(audit)
    if (subadminOffices.length > 0) {
      return subadminOffices.map(office => office.name).join(', ')
    }
    return 'No offices assigned'
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
      <Typography variant="h4" component="h1" gutterBottom>
        Audits/Subadmins
      </Typography>
      
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Assigned Offices</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Connected</TableCell>
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
    </Box>
  )
}