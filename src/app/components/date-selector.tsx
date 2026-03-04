import { FormControl, Input, InputLabel } from "@mui/material"

export default function DateSelector({
  onChange,
  value,
  disabled = false,
  fullwidth = false,
}: {
  onChange?: (date: string) => void
  value: string
  disabled?: boolean
  fullwidth?: boolean
}) {
  const change = (e: any) => {
    if (onChange !== undefined) {
      onChange(e.target.value)
    }
  }

  return (
    <FormControl fullWidth={fullwidth}>
      <InputLabel>Fecha: </InputLabel>
      <Input value={value} onChange={change} type="date" disabled={disabled} />
    </FormControl>
  )
}
