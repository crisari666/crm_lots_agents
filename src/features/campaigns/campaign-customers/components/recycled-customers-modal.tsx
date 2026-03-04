import { Close, PersonAdd } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { useEffect } from "react";
import { assignCustomerRecycleThunk, loadRecycledCustomersThunk, showRecycledCustomersModalAct } from "../redux/campaign-customers-slice";
import { themeCondense } from "../../../../app/themes/theme-condense";
export default function RecycleCustomersDialog() {
  const dispatch = useAppDispatch()
  const { showRecycledCustomersModal, recycledCustomers, usersCampaignData } = useAppSelector((state) => state.campaignCustomers) 

  useEffect(() => {
    dispatch(loadRecycledCustomersThunk())
  }, [])

  const assignCustomer = ({customerId, email, index, name, phone} : {customerId: string, index: number, name: string, phone: string, email: string}) => {
    const data = [...usersCampaignData].sort((a, b) => a.customers.length - b.customers.length)
    const first = data[0]

    dispatch(
      assignCustomerRecycleThunk({
        customerData: {
          address: "",
          email,
          lastName: "",
          name,
          office: first.user.office._id,
          phone,
          userAssigned: first.user._id,
          customerId
        },
        index
      })
    )

  }
  return (
    <>
      <Dialog open={showRecycledCustomersModal}>
        <IconButton className="closeDialog" onClick={() => dispatch(showRecycledCustomersModalAct(false))}> <Close /></IconButton>
        <DialogTitle> Clientes reciclados </DialogTitle>
        <DialogContent> 
          <ThemeProvider theme={themeCondense}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>N</TableCell>
                    <TableCell>Asignar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recycledCustomers.map((customer, index) => (
                    <TableRow key={customer._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell sx={{paddingX: 2}}>
                        <Button 
                          onClick={() => assignCustomer({
                            customerId: customer._id,
                            email: customer.email,
                            index,
                            name: customer.name,
                            phone: customer.phone
                          })}
                          size="small" variant="outlined" color="info"> <PersonAdd/> 
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </ThemeProvider>

        </DialogContent>
      </Dialog>
    </>
  )
}