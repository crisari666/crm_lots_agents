import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { fetchSubadminsThunk } from "../../slice/user-list.slice"
import { getOfficesThunk, setMultipleOfficesSubadminThunk } from "../../../offices/offices-list/offices-list.slice"
import AppAutoComplete, { AppAutocompleteOption } from "../../../../app/components/app-autocomplete"
import { Box, Typography, CircularProgress } from "@mui/material"
import { useEffect } from "react"
import UserInterface from "../../../../app/models/user-interface"

interface SubadminOfficeSelectorProps {
  audit: UserInterface
  onClose: () => void
}

export default function SubadminOfficeSelector({ audit, onClose }: SubadminOfficeSelectorProps) {
  const dispatch = useAppDispatch()
  const { offices, loading: officesLoading } = useAppSelector((state) => state.offices)
  
  // Initialize selected offices from offices where this subadmin is assigned as subadmin
  const [selectedOffices, setSelectedOffices] = useState<AppAutocompleteOption[]>(() => {
    const subadminOffices = offices.filter(office => office.subadmin === audit._id)
    return subadminOffices.map(office => ({
      _id: office._id!,
      name: office.name || ''
    }))
  })

  useEffect(() => {
    if (offices.length === 0) {
      dispatch(getOfficesThunk())
    }
  }, [dispatch, offices.length])

  // Update selected offices when offices data changes
  useEffect(() => {
    const subadminOffices = offices.filter(office => office.subadmin === audit._id)
    setSelectedOffices(subadminOffices.map(office => ({
      _id: office._id!,
      name: office.name || ''
    })))
  }, [offices, audit._id])

  const handleOfficeChange = ({ name, val }: { name: string, val: AppAutocompleteOption[] }) => {
    setSelectedOffices(val || [])
  }

  const handleSave = async () => {
    try {
      const officeIds = selectedOffices.map(office => office._id)
      
      // Make API call to update subadmin assignments
      await dispatch(setMultipleOfficesSubadminThunk({
        subadminId: audit._id!,
        officeIds: officeIds
      })).unwrap()
      
      // Refresh the offices list to get updated data
      dispatch(getOfficesThunk())
      // Refresh the subadmins list
      dispatch(fetchSubadminsThunk())
      onClose()
    } catch (error) {
      console.error('Error updating subadmin offices:', error)
    }
  }

  const officeOptions: AppAutocompleteOption[] = offices
    .filter(office => office.enable)
    .map(office => ({
      _id: office._id!,
      name: office.name || ''
    }))

  if (officesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        <CircularProgress size={20} />
      </Box>
    )
  }

  return (
    <Box p={2} minWidth={300}>
      <Typography variant="h6" gutterBottom>
        Assign Offices to {audit.name} {audit.lastName}
      </Typography>
      
      <Box mb={2}>
        <AppAutoComplete
          multiple={true}
          options={officeOptions}
          name="offices"
          value={selectedOffices}
          onChange={handleOfficeChange}
          label="Select Offices"
          placeholder="Choose offices to assign..."
        />
      </Box>

      <Box display="flex" gap={1} justifyContent="flex-end">
        <button
          onClick={onClose}
          style={{
            padding: '8px 16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: 'white',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            background: '#1976d2',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Save
        </button>
      </Box>
    </Box>
  )
} 