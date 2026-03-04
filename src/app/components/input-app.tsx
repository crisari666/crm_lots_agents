import { TextField } from "@mui/material"

export interface InputAppProps {
  placeholder: string
  readonly?: boolean
  value: any
  onChange?: (val: any, name: string) => void
  name?: string
  type?: string
  required?: boolean
  disabled?: boolean
}

export default function InputApp({
  name="", onChange= ()=>{}, readonly = false, placeholder, value, type= "text", disabled = false, required= false
}: InputAppProps) {
  return (
    <TextField
      style={{ marginBlock: 10 }}
      fullWidth
      required={required}
      id={name}
      name={name}
      disabled={disabled}
      type={type}
      label={placeholder.toUpperCase()}
      value={value}
      onChange={(e) => onChange(e.target.value, name)}
    />
  )
}
