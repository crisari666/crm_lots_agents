import { Box, Button, ButtonGroup, Chip, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, createTheme } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { getCustomerCallActionsThunk, logCustomerCallActionThunk, setDialogCallUserAct, setDialogCustomerStepAct, setDialogUpdateCustomerSituationAct } from "../customers.slice";
import { AddIcCall, Category, ChangeCircle, Circle, Edit, ManageHistory, Phone, PhoneForwarded, PhoneMissed, Visibility, VisibilityTwoTone } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { determineCustomerColorStatus, getCallsResume, resolveCustomerSituation, resolveCustomerStep, resolveCustomerStepId } from "../../../../utils/customer.utils";
import UserInterface from "../../../../app/models/user-interface";
import { CustomerInterface } from "../../../../app/models/customer.interface";
import { CustomerCallActionsEnum } from "../../../../app/models/customer-call-actions.enum";
import DialogCustomerCallActions from "../../customer-view/components/dialog-customer-call-actions";
import { ItemListInterface } from "../../../../app/models/item-list.inteface";
import DialogUpdateCustomerSituation from "./dialog-update-customer-sitatuon";
import { dateToInputDate, dateUTCToFriendly } from "../../../../utils/date.utils";
import DialogCallCustomer from "./dialog-call-customer";
import { ThemeProvider } from "@emotion/react";
import { setDialogChangeCustomerUserAct } from "../../../customers-center/customer-center.slice";
import React, { useMemo } from "react";
import { TableComponents, TableVirtuoso } from "react-virtuoso";
import { getCustomerResumeThunk } from "../../customer-view/customer-view.slice";
import { RootState } from "../../../../app/store";

const VirtuosoTableComponents: TableComponents<CustomerInterface> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', }} />
  ),
  TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow: ({ item: _item, ...props }) => <TableRow {...props}/>,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

export default function CustomersTableView({customers, currentUser, maxHeight = 550} : {customers: CustomerInterface[], currentUser: UserInterface, maxHeight?: number}) {
  const { settings } = useAppSelector((state: RootState) => state.settings)
  const { customersFilter } = useAppSelector((state: RootState) => state.customers)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const allowViewCustomerNumber = settings.find((setting) => setting.title === 'allow_see_customer_number')?.value?.toString() === 'true'
  const allowLeadViewCustomerDetails = settings.find((setting) => setting.title === 'allow_lead_view_customer_details')?.value?.toString() === 'true'
  const allowModifyStep = settings.find((setting) => setting.title === 'allow_user_modify_step')?.value?.toString() === 'true'
  const customerResumeBasedOnStepsColors = settings.find((setting) => setting.title === 'customer_resume_based_on_steps_colors')?.value?.toString() === 'true'
  
  // Filter customers by step if step filter is active
  const filteredCustomers = useMemo(() => {
    if (!customersFilter.step || customersFilter.step === "") {
      return customers
    }
    
    return customers.filter(customer => {
      if (customersFilter.step === "no-step") {
        // Special case: filter customers with no step
        return customer.step == null || !Array.isArray(customer.step) || customer.step.length === 0
      } else {
        // Filter by step ID
        if (customer.step && Array.isArray(customer.step) && customer.step.length > 0) {
          const step = customer.step[0] as any
          return step._id === customersFilter.step
        } else {
          return false
        }
      }
    })
  }, [customers, customersFilter.step])

  const userAssigned = (customer: CustomerInterface) => {
    if(customer.userAssigned != null && customer.userAssigned !== undefined) {
      if(customer.userAssigned.length > 0){
        const user = customer.userAssigned[0] as UserInterface
        return `${user.lastName} | ${customer.office?.name}`
      }else {
        return ""
      }
    } else {
      return ""
    }
  }

  const showDialogCall = ({customerId, phone, email, description} : {customerId: string, phone: string, email: string, description?: string}) => { 
    dispatch(logCustomerCallActionThunk({customerId, callAction: CustomerCallActionsEnum.pushCall}))
    dispatch(setDialogCallUserAct({ phone, customerId, email, description}))
  }

  const disableViewButton = (customer: CustomerInterface) => {
    if(currentUser?.level! <= 3) {
      return false
    } else if(customer.answered && customer.status === 0) {
      return false
    } else {
      return true
    }
  }

  const theme = createTheme({
    components: {
      MuiTableCell: { styleOverrides: { root: { padding: '1px', minWidth: "30px" } }},
      MuiButtonGroup: { defaultProps: { size: 'small'}},
      MuiButton: { defaultProps: { size: 'small'}, styleOverrides: { root: { padding: '2px', minWidth: "30px" } }},
      MuiIconButton: { defaultProps: { size: 'small'}},
      MuiSvgIcon: { defaultProps: { fontSize: "small" } , styleOverrides: { root: { fontSize: "16px" } } },
      MuiIcon: { defaultProps: { fontSize: 'small' } }
    }
  })

  return(
    <ThemeProvider theme={theme}>
      <DialogUpdateCustomerSituation/>
      <DialogCallCustomer/>
      <DialogCustomerCallActions/>
      <Box sx={{height: maxHeight}}>
        <Typography paddingLeft={2} variant="h6">Total: {filteredCustomers.length}</Typography>
        <TableVirtuoso
          data={filteredCustomers}
          components={VirtuosoTableComponents}
          fixedHeaderContent={() => 
            <TableRow style={{backgroundColor: 'white'}}>
                {currentUser?.level! <= 1 && <TableCell align="center"><VisibilityTwoTone /> </TableCell>}
                <TableCell align="center"><Circle /> </TableCell>
                <TableCell align="center">Date </TableCell>
                <TableCell align="center"> <Visibility /> </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>User</TableCell>
                <TableCell align="center">  <ManageHistory/></TableCell>
                {((currentUser?.level === 0 || currentUser?.level === 1) || allowModifyStep) && <TableCell>Step</TableCell>}
              </TableRow>
          }
          itemContent={(index, customer) => {
            const resumeCalls = getCallsResume(customer)         
            return (<>
              {currentUser?.level! <= 1 && <TableCell align="center"><IconButton onClick={() => dispatch(getCustomerResumeThunk(customer._id))}> <Visibility/> </IconButton></TableCell>}
              <TableCell align="center"> <Circle htmlColor={determineCustomerColorStatus(customer.status, customer.answered, customer.step, customer.isProspect, customerResumeBasedOnStepsColors)} /> </TableCell>
              <TableCell align="center"> {customer.dateAssigned ? dateUTCToFriendly(customer.dateAssigned) : '--'}-</TableCell>
              <TableCell align="center"> 
                {(currentUser?.level! <= 1 || (customer.answered === true && (currentUser?.level! === 4 || (currentUser?.level! < 4 && (customer.userAssigned as any)[0]._id === currentUser?._id))) || (customer.answered === false && currentUser?.level! === 4) || (currentUser?.level! <= 3 && allowLeadViewCustomerDetails))  &&  
                  <IconButton disabled={disableViewButton(customer)} onClick={() => navigate(`/dashboard/customer/${customer._id}`)} color="info"> 
                    <Visibility/>
                  </IconButton> 
                }
              </TableCell>
              <TableCell> {customer.name} {allowViewCustomerNumber && <Chip variant="outlined" color="primary" size="small"  label={customer.phone} />} </TableCell>
              <TableCell> 
                {currentUser?.level === 0 ? 
                  <Tooltip title={customer.phone}>
                    <IconButton color="primary" onClick={() => showDialogCall({ customerId: customer._id, phone: customer.phone, email: customer.phone, description: customer.description})}> <Phone/> </IconButton>
                  </Tooltip>
                  :
                  <IconButton color="primary" onClick={() => showDialogCall({ customerId: customer._id, phone: customer.phone, email: customer.email, description: customer.description})}> <Phone/> </IconButton>
                  }
              </TableCell>
              <TableCell> 
                {customer.code}
                {currentUser?.level! === 0 && <Tooltip title={resolveCustomerSituation(customer.situation)} arrow placement="right">
                  <IconButton color="secondary"  onClick={() => dispatch(setDialogUpdateCustomerSituationAct({
                    _id: customer._id, 
                    date: customer.situationDate ? dateToInputDate(customer.situationDate) : '',
                    name: customer.name, 
                    currentCode: customer.code ?? "",
                    code: customer.code ?? "",
                    statusCode: "unknown",
                    current: (customer.situation as ItemListInterface[]).length > 0 ? (customer.situation as ItemListInterface[])[0]._id : "",
                    newSitutation: (customer.situation as ItemListInterface[]).length > 0 ? (customer.situation as ItemListInterface[])[0]._id : "",
                  }))} ><ChangeCircle/></IconButton>
                </Tooltip>}
              </TableCell>
              <TableCell sx={{whiteSpace: "nowrap"}}> 
                {currentUser?.level === 0 && <><IconButton onClick={() => dispatch(setDialogChangeCustomerUserAct({
                  currentUserName: userAssigned(customer),
                  customerName: customer.name,
                  customerId: customer._id,
                  newUserId: "",
                  officeId: "",
                }))}> <Edit /> </IconButton>{userAssigned(customer)}</>} 
                {currentUser?.level! > 0 &&  userAssigned(customer)} 
              </TableCell>
              <TableCell align="center">
                <ButtonGroup>
                  <Button color="secondary"> <AddIcCall/> {resumeCalls.push} </Button>
                  <Button color="success"> <PhoneForwarded/> {resumeCalls.answer} </Button>
                  <Button color="error"> <PhoneMissed/> {resumeCalls.unanswer} </Button>
                  {currentUser?.level! === 0 && <Button onClick={() => dispatch(getCustomerCallActionsThunk({customerId: customer._id}))} color="info"> <ManageHistory/> </Button>}
                </ButtonGroup>
              </TableCell>
              {((currentUser?.level! === 0 || currentUser?.level! === 1) || allowModifyStep) && <TableCell>
                <Typography variant="caption"> {resolveCustomerStep(customer.step)} </Typography>
                <IconButton color="secondary" onClick={() => dispatch(setDialogCustomerStepAct({
                  customerId: customer._id,
                  name: customer.name,
                  stepId: resolveCustomerStepId(customer.step),
                }))}> <Category/> </IconButton>
              </TableCell>}
            </>)
          }}
        />
      </Box>
  
    </ThemeProvider>
  )
}