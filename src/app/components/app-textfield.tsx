
import { FormControl, FormHelperText, InputAdornment, InputBaseComponentProps, InputLabel, OutlinedInput } from "@mui/material"

export default function AppTextField(
  {label, name = "", onChange, startCompontent, endComponent, value, type= "text", autofocus = false, required= false, readonly= false, inputProps, hasError=false, error= ""} : {
  label?: string, 
  type?: string
  name?: string, 
  value?: any,
  autofocus?: boolean,
  required?: boolean,
  disabled?: boolean,
  readonly?: boolean,
  startCompontent?: React.ReactNode,
  endComponent?: React.ReactNode,
  hasError?: boolean
  error?: string
  inputProps?:  InputBaseComponentProps | undefined
  onChange?: ({name, val} : {name: string, val: any}) => void}
  ) {
    
  return (
    <FormControl fullWidth size="small" required={required} error={hasError} >
      {label !== undefined && <InputLabel color={hasError ? "error" : "primary"}>{label}</InputLabel>}
      <OutlinedInput
        type={type}
        value={value}
        label={label}
        autoFocus={autofocus}
        disabled={readonly}
        readOnly={readonly}
        name={name}
        inputProps={inputProps}
        required={required}
        onChange={(e) => onChange !== undefined ?  onChange({name, val: e.target.value}) : null}
        startAdornment={startCompontent !== undefined ? <InputAdornment position="start">{startCompontent}</InputAdornment> : null }
        endAdornment={endComponent !== undefined && <InputAdornment position="end">{endComponent}</InputAdornment> }
       />
      {hasError && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}