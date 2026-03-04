import { createTheme } from "@mui/material";

export const customersDisabledtheme = createTheme({
  components: {
    MuiTable: {

    },
    MuiTypography: {
      styleOverrides: {
        root: {
          padding: "1rem"
        }
      }
    },
    MuiTableCell: {
      defaultProps: {
        padding: "checkbox"
      },
    }
  }
})