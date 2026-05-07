import { useEffect, useState } from "react"
import {
  Autocomplete,
  Box,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  clearCustomerSearchResultsAct,
  searchCustomersAutocompleteThunk,
} from "../redux/customer-search.slice"
import type { CustomerAutocompleteItem } from "../services/customers-ms.service"

const DEBOUNCE_MS = 250
const MIN_QUERY_LENGTH = 2

export type CustomerAutocompleteAsyncCPProps = {
  value: CustomerAutocompleteItem | null
  onChange: (item: CustomerAutocompleteItem | null) => void
  label?: string
  size?: "small" | "medium"
  minWidth?: number
  disabled?: boolean
}

function buildPrimaryLabel(item: CustomerAutocompleteItem): string {
  const fullName = `${item.name ?? ""} ${item.lastName ?? ""}`.trim()
  if (fullName.length > 0) return fullName
  return item.phone
}

function buildSecondaryLabel(item: CustomerAutocompleteItem): string {
  const parts: string[] = []
  if (item.phone) parts.push(item.phone)
  if (item.document) parts.push(item.document)
  if (item.email) parts.push(item.email)
  return parts.join(" · ")
}

export default function CustomerAutocompleteAsyncCP({
  value,
  onChange,
  label = "Cliente",
  size = "small",
  minWidth = 260,
  disabled,
}: CustomerAutocompleteAsyncCPProps) {
  const dispatch = useAppDispatch()
  const items = useAppSelector((s) => s.customerSearch.items)
  const loading = useAppSelector((s) => s.customerSearch.loading)
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    const trimmed = inputValue.trim()
    if (trimmed.length < MIN_QUERY_LENGTH) {
      dispatch(clearCustomerSearchResultsAct())
      return
    }
    const timer = window.setTimeout(() => {
      void dispatch(searchCustomersAutocompleteThunk(trimmed))
    }, DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [dispatch, inputValue])

  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: CustomerAutocompleteItem
  ) => {
    const { key, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & { key?: React.Key }
    const secondary = buildSecondaryLabel(option)
    return (
      <Box component="li" key={key ?? option.id} {...rest} sx={{ cursor: "pointer" }}>
        <Stack spacing={0.25} sx={{ width: "100%" }}>
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
    <Autocomplete<CustomerAutocompleteItem, false, false, false>
      size={size}
      sx={{ minWidth }}
      disabled={disabled}
      options={items}
      value={value}
      filterOptions={(opts) => opts}
      onChange={(_, option) => onChange(option)}
      onInputChange={(_, next, reason) => {
        if (reason === "reset") return
        setInputValue(next)
      }}
      isOptionEqualToValue={(option, current) => option.id === current.id}
      getOptionLabel={(option) => buildPrimaryLabel(option)}
      renderOption={renderOption}
      loading={loading}
      loadingText="Buscando…"
      noOptionsText={
        inputValue.trim().length < MIN_QUERY_LENGTH ? "Escribe para buscar…" : "Sin resultados"
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder="Nombre, teléfono o documento"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={16} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}
