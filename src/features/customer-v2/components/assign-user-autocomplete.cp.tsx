import React from "react"
import { Autocomplete, TextField } from "@mui/material"
import UserInterface from "../../../app/models/user-interface"

export type AssignUserAutocompleteProps = {
  users: UserInterface[]
  value: string
  onChange: (userId: string) => void
  disabled?: boolean
  label?: string
}

/**
 * Searchable assignee picker; empty selection means unassigned.
 */
export default function AssignUserAutocompleteCP({
  users,
  value,
  onChange,
  disabled = false,
  label = "Usuario asignado",
}: AssignUserAutocompleteProps) {
  const options = users.filter((u) => u._id)
  const selected = options.find((u) => u._id === value) ?? null
  return (
    <Autocomplete<UserInterface, false, false, false>
      fullWidth
      disabled={disabled}
      options={options}
      value={selected}
      onChange={(_event, newValue) => {
        onChange(newValue?._id ?? "")
      }}
      isOptionEqualToValue={(a, b) => a._id === b._id}
      getOptionLabel={(u) =>
        `${u.name ?? ""} ${u.lastName ?? ""}`.trim() + (u.email ? ` (${u.email})` : "")
      }
      renderInput={(params) => (
        <TextField {...params} label={label} margin="dense" />
      )}
      ListboxProps={{
        sx: { "& .MuiAutocomplete-option": { cursor: "pointer" } },
      }}
    />
  )
}
