import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Checkbox, Tooltip, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { ChangeHistory, CheckBox as CheckBoxIcon, Circle, CrisisAlert, Storage, Visibility } from "@mui/icons-material";
import { determineCustomerColorStatusObj } from "../../../../utils/customer.utils";
import { toggleAddCustomerToCampaignAct } from "../import-numbers.slice";
import { getCustomerResumeThunk } from "../../customer-view/customer-view.slice";

export default function PreviewRowsTableCP() {
  const dispatch = useAppDispatch()
  const { uploadedData } = useAppSelector((state: RootState) => state.importNumbers)

  const changeCheckbox= ({leadIndex, customerIndex, checked} : {leadIndex: number, customerIndex: number,  checked: boolean}) => {
    console.log({leadIndex, customerIndex, checked});
    dispatch(toggleAddCustomerToCampaignAct({leadIndex, customerIndex, checked}))
  }

  const HeadTable = () => {
    return (<TableHead>
    <TableRow>
      <TableCell> <Visibility fontSize="small" /> </TableCell>
      <TableCell> <Storage /> </TableCell>
      <TableCell>Lider</TableCell>
      <TableCell>Name</TableCell>
      <TableCell>Phone</TableCell>
      <TableCell>Email</TableCell>
      <TableCell> <CheckBoxIcon /> </TableCell>
    </TableRow>
  </TableHead>)
}
  return(
    <>
        {uploadedData.map((lead, i) => (
          <Paper sx={{padding: 1, marginTop: 1}} elevation={4} key={"Table"+lead.user}>
            <TableContainer>
              <Table padding="none">
                <HeadTable/>
                <TableBody>
                  {lead.numbers.map((row, index) => (
                    <TableRow key={"lead"+lead.user+row.phone+index}>
                      <TableCell> <IconButton onClick={() => dispatch(getCustomerResumeThunk(row.customer!._id))} size="small"> <Visibility fontSize="small"/> </IconButton> </TableCell>
                      <TableCell>
                        {row.customer !== undefined && <>
                          <Circle fontSize="small" htmlColor={determineCustomerColorStatusObj({status: row.customer.status, hasSituation: Boolean(row.customer.situation), answered: row.customer.answered, isProspect: row.customer.isProspect})}/>
                          {row.customer.userAssigned && 
                            <Tooltip title={(row.customer.userAssigned as any).lastName}>
                              <CrisisAlert/>
                            </Tooltip>
                          }
                        </>}
                        {row.customer === undefined && <ChangeHistory/> && "[*]"}
                      </TableCell>
                      <TableCell>{row.lead}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell>{row.email}</TableCell>

                      <TableCell>
                          {row.add !== undefined && <Checkbox 
                            checked={row.add} 
                            onChange={(e, checked) => changeCheckbox({
                            checked, leadIndex: i, customerIndex: index
                          })}/>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ))
        }
    </>
  )
}