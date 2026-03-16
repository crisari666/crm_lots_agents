import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
  Box
} from "@mui/material"
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import {
  fetchAmenitiesThunk,
  createAmenityThunk,
  updateAmenityThunk
} from "../slice/amenities.slice"
import { AmenityType } from "../types/amenity.types"

type AmenitiesDialogCPProps = {
  open: boolean
  onClose: () => void
}

export default function AmenitiesDialogCP({ open, onClose }: AmenitiesDialogCPProps) {
  const dispatch = useAppDispatch()
  const { amenities, isLoading, error } = useAppSelector((state: RootState) => state.amenities)
  const [title, setTitle] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [localError, setLocalError] = useState("")

  useEffect(() => {
    if (open) dispatch(fetchAmenitiesThunk())
  }, [open, dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")
    const trimmed = title.trim()
    if (!trimmed) {
      setLocalError("Title is required")
      return
    }
    if (trimmed.length > 200) {
      setLocalError("Title must be 200 characters or less")
      return
    }
    try {
      if (editingId) {
        await dispatch(updateAmenityThunk({ id: editingId, data: { title: trimmed } })).unwrap()
        setEditingId(null)
      } else {
        await dispatch(createAmenityThunk({ title: trimmed })).unwrap()
      }
      setTitle("")
    } catch {
      setLocalError(editingId ? "Failed to update amenity" : "Failed to create amenity")
    }
  }

  const handleEdit = (amenity: AmenityType) => {
    setEditingId(amenity._id)
    setTitle(amenity.title)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setTitle("")
  }

  const displayError = localError || error

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Amenities</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", mb: 2 }}>
            <TextField
              size="small"
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              inputProps={{ maxLength: 200 }}
              disabled={isLoading}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !title.trim()}
              startIcon={<AddIcon />}
            >
              {editingId ? "Update" : "Add"}
            </Button>
            {editingId && (
              <Button size="small" onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
          </Box>
        </form>
        {displayError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {displayError}
          </Alert>
        )}
        <List dense>
          {amenities.map((a) => (
            <ListItem
              key={a._id}
              secondaryAction={
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => handleEdit(a)}
                  disabled={isLoading}
                >
                  <EditIcon />
                </IconButton>
              }
            >
              <ListItemText primary={a.title} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
