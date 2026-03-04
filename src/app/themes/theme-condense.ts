import { createTheme } from "@mui/material";

export const themeCondense = createTheme({
  components: {
    MuiTableCell: { styleOverrides: { root: { padding: '1px', minWidth: "30px" } }},
    MuiButtonGroup: { defaultProps: { size: 'small'}},
    MuiButton: { defaultProps: { size: 'small'}, styleOverrides: { root: { padding: '2px', minWidth: "30px" } }},
    MuiIconButton: { defaultProps: { size: 'small'}},
    MuiSvgIcon: { defaultProps: { fontSize: "small" } , styleOverrides: { root: { fontSize: "16px" } } },
    MuiIcon: { defaultProps: { fontSize: 'small' } }
  }
})