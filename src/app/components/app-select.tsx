import { FormControl, InputAdornment, InputLabel, MenuItem, Select } from "@mui/material"

export default function AppSelector(
  {value, onChange = () => {}, options =[], label="", name="", endComponent, startCompontent, disabled= false, propOptionName = "name", required = false, readonly = false, size="small", multiple = false} :
  {value?: any, options?: any[], onChange?: ( {name, val} : {name: string, val: any,}) => void, label?: string, name?: string, multiple?: boolean
  startCompontent?: React.ReactNode, required?: boolean, size?: "small" | "medium",
  endComponent?: React.ReactNode, disabled?: boolean, propOptionName?: string, readonly?: boolean
  }
  ) {
  return (
    <FormControl fullWidth size={size} required={required}>
      <InputLabel>{label}</InputLabel>
      <Select fullWidth label={label} name={name} value={value}
        disabled={disabled}
        multiple={false}
        readOnly={readonly}
        required={required}
        size="small"
        onChange={(e) => onChange({name: e.target.name, val: e.target.value})}
        startAdornment={startCompontent !== undefined ? <InputAdornment position="start">{startCompontent}</InputAdornment> : null }
        endAdornment={endComponent !== undefined && <InputAdornment position="end">{endComponent}</InputAdornment> }
      >
        <MenuItem value="">-- {label.toUpperCase()} --</MenuItem>
        {options.map((el, i) => {
          return(
            <MenuItem key={`${name}_${el._id}${propOptionName}`} value={el._id}> {el.CustomChildren ? el.CustomChildren: el[propOptionName]}</MenuItem>
          )
        })}
      </Select>
  </FormControl>
  )
}