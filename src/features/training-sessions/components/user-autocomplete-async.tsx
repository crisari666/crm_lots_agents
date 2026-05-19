import { useEffect, useState } from "react"
import { Autocomplete, Box, CircularProgress, Stack, TextField, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  clearTrainingSessionUserSearch,
  searchTrainingSessionUsersThunk,
  selectTrainingSessionsState
} from "../slice/training-sessions.slice"
import type { TrainingSessionUserSearchItem } from "../types/training-sessions.types"

const DEBOUNCE_MS = 250
const MIN_QUERY_LENGTH = 2

export type UserAutocompleteAsyncProps = {
  value: TrainingSessionUserSearchItem | null
  onChange: (item: TrainingSessionUserSearchItem | null) => void
  label?: string
  disabled?: boolean
}

function buildPrimaryLabel(item: TrainingSessionUserSearchItem): string {
  const fullName = `${item.name ?? ""} ${item.lastName ?? ""}`.trim()
  if (fullName.length > 0) return fullName
  return item.email
}

function buildSecondaryLabel(item: TrainingSessionUserSearchItem): string {
  const parts: string[] = []
  if (item.email) parts.push(item.email)
  if (item.user) parts.push(item.user)
  return parts.join(" · ")
}

export default function UserAutocompleteAsync({
  value,
  onChange,
  label = "Buscar usuario",
  disabled = false
}: UserAutocompleteAsyncProps) {
  const dispatch = useAppDispatch()
  const { userSearchItems, isSearchingUsers } = useAppSelector(selectTrainingSessionsState)
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    const trimmed = inputValue.trim()
    if (trimmed.length < MIN_QUERY_LENGTH) {
      dispatch(clearTrainingSessionUserSearch())
      return
    }
    const timer = window.setTimeout(() => {
      void dispatch(searchTrainingSessionUsersThunk(trimmed))
    }, DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [dispatch, inputValue])

  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: TrainingSessionUserSearchItem
  ) => {
    const { key, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & { key?: React.Key }
    const secondary = buildSecondaryLabel(option)
    return (
      <Box component="li" key={key ?? option.id} {...rest} sx={{ cursor: "pointer" }}>
        <Stack spacing={0.25}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {buildPrimaryLabel(option)}
          </Typography>
          {secondary ? (
            <Typography variant="caption" color="text.secondary" noWrap>
              {secondary}
            </Typography>
          ) : null}
        </Stack>
      </Box>
    )
  }

  return (
    <Autocomplete
      fullWidth
      size="small"
      disabled={disabled}
      options={userSearchItems}
      value={value}
      inputValue={inputValue}
      onInputChange={(_event, newInput) => setInputValue(newInput)}
      onChange={(_event, newValue) => onChange(newValue)}
      loading={isSearchingUsers}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      getOptionLabel={(option) => buildPrimaryLabel(option)}
      noOptionsText={
        inputValue.trim().length < MIN_QUERY_LENGTH
          ? "Escribe al menos 2 caracteres"
          : "Sin resultados"
      }
      renderOption={renderOption}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isSearchingUsers ? <CircularProgress color="inherit" size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
      ListboxProps={{ sx: { "& .MuiAutocomplete-option": { cursor: "pointer" } } }}
    />
  )
}
