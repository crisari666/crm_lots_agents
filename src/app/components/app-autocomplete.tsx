import { Autocomplete, TextField } from "@mui/material";

export type AppAutocompleteOption = {
  _id: string,
  name: string
}

export default function AppAutoComplete(
  {multiple = false, options, name, onChange, value = [], label = "", placeholder = "", disabled = false}:
  {multiple? : boolean, options: AppAutocompleteOption[], name: string, 
    disabled?: boolean,
    value?:  AppAutocompleteOption[] | AppAutocompleteOption, label?: string, placeholder?: string,
    onChange: ({name, val} : {name: string, val: any}) => void
  }
) {
  return (
    <>
      <Autocomplete
        size="small"
        disabled={disabled}
        multiple={multiple}
        filterSelectedOptions
        getOptionLabel={(option) => option.name === undefined ?  "" : option.name}
        onChange={(e, value) => onChange({name, val: value})}
        options={options}
        value={value}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
          />
        )}
      />

    </>
  )
}