import { Grid } from "@mui/material";
import { useAppSelector } from "../../../../app/hooks";

export default function CustomersFilter() {
  const { customersFilter } = useAppSelector((state) => state.customers)

  return (
    <>
      <Grid container>
        <Grid item xs={4}>
        </Grid>
      </Grid>
    </>
  ); 
}