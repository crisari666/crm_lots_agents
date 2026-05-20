import { useEffect, useMemo } from "react"
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
} from "@mui/material"
import CloudUpload from "@mui/icons-material/CloudUpload"
import Shuffle from "@mui/icons-material/Shuffle"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import UserInterface from "../../../app/models/user-interface"
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice"
import LoadingIndicator from "../../../app/components/loading-indicator"
import {
  applyDistributeAct,
  clearPreviewAct,
  importCustomersThunk,
  setDistributeUserIdsAct,
} from "../import-customers.slice"
import {
  selectDistributePreviewCounts,
  selectPhysicalUsersForImport,
} from "../import-customers.selectors"
import { normalizeImportPhone } from "../utils/normalize-import-phone.util"
import { importCustomersStrings as s } from "../../../i18n/locales/import-customers.strings"

function getUserLabel(user: UserInterface): string {
  const name = `${user.name ?? ""} ${user.lastName ?? ""}`.trim()
  return name + (user.email ? ` (${user.email})` : "")
}

export default function ImportCustomersControls() {
  const dispatch = useAppDispatch()
  const { previewRows, loading, distributeUserIds, fileLoaded } = useAppSelector(
    (state: RootState) => state.importCustomers,
  )
  const gotUsers = useAppSelector((state: RootState) => state.users.gotUsers)
  const physicalUsers = useAppSelector(selectPhysicalUsersForImport)
  const distributeCounts = useAppSelector(selectDistributePreviewCounts)

  useEffect(() => {
    if (!gotUsers) {
      void dispatch(fetchUsersThunk({ enable: true }))
    }
  }, [dispatch, gotUsers])

  const selectedDistributeUsers = useMemo(
    () =>
      distributeUserIds
        .map((id) => physicalUsers.find((user) => user._id === id))
        .filter((user): user is UserInterface => user != null),
    [distributeUserIds, physicalUsers],
  )

  const canImport =
    previewRows.length > 0 &&
    previewRows.every((row) => normalizeImportPhone(row.phone).length > 0)

  const handleImport = () => {
    const customers = previewRows.map((row) => ({
      phone: row.phone.trim(),
      ...(row.name.trim() && { name: row.name.trim() }),
      ...(row.email.trim() && { email: row.email.trim() }),
      ...(row.assignedTo && { assignedTo: row.assignedTo }),
    }))
    void dispatch(importCustomersThunk(customers))
  }

  const handleClear = () => {
    dispatch(clearPreviewAct())
  }

  const handleDistributeUsersChange = (_event: unknown, value: UserInterface[]) => {
    dispatch(setDistributeUserIdsAct(value.map((user) => user._id ?? "").filter(Boolean)))
  }

  if (!fileLoaded) {
    return null
  }

  return (
    <>
      <LoadingIndicator open={loading} />
      <Paper sx={{ p: 2, mt: 2 }} elevation={2}>
        <Stack spacing={2}>
          <Autocomplete<UserInterface, true, false, false>
            multiple
            options={physicalUsers}
            value={selectedDistributeUsers}
            onChange={handleDistributeUsersChange}
            disabled={loading}
            getOptionLabel={getUserLabel}
            isOptionEqualToValue={(a, b) => a._id === b._id}
            renderInput={(params) => (
              <TextField {...params} label={s.distributeUsersLabel} size="small" />
            )}
            ListboxProps={{
              sx: { "& .MuiAutocomplete-option": { cursor: "pointer" } },
            }}
            sx={{ cursor: "pointer" }}
          />
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudUpload />}
              disabled={!canImport || loading}
              onClick={handleImport}
              sx={{ cursor: "pointer" }}
            >
              {s.importButton}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Shuffle />}
              disabled={distributeUserIds.length === 0 || previewRows.length === 0 || loading}
              onClick={() => dispatch(applyDistributeAct())}
              sx={{ cursor: "pointer" }}
            >
              {s.distributeButton}
            </Button>
            <Button variant="outlined" disabled={loading} onClick={handleClear} sx={{ cursor: "pointer" }}>
              {s.clearButton}
            </Button>
          </Stack>
          {distributeCounts.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {distributeCounts.map(({ userId, count }) => {
                const user = physicalUsers.find((item) => item._id === userId)
                const label = user ? getUserLabel(user) : userId
                return (
                  <Chip
                    key={userId}
                    size="small"
                    label={`${label} · ${count} ${s.distributeChipSuffix}`}
                    variant="outlined"
                    sx={{ cursor: "default" }}
                  />
                )
              })}
            </Box>
          )}
        </Stack>
      </Paper>
    </>
  )
}
