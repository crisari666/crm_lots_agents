import { Circle, CheckCircle } from "@mui/icons-material";
import { Box, Button, ButtonGroup, Chip, Tooltip, useTheme, useMediaQuery } from "@mui/material";
import { blue, brown, grey, purple, red, yellow } from "@mui/material/colors";
import { CustomerInterface } from "../../../../app/models/customer.interface";
import { StepType } from "../../../../app/models/step.type";
import CustomersResumeSteps from "./customers-resume-steps";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { useEffect } from "react";
import { getStepsThunk } from "../../../steps/steps.slice";
import { changeInputFilterCustomerAct } from "../customers.slice";

export default function CustomersTableResume({customers} : {customers: CustomerInterface[]}) {
  const { settings } = useAppSelector((state: RootState) => state.settings)
  const { steps } = useAppSelector((state: RootState) => state.steps)
  const { customersFilter } = useAppSelector((state: RootState) => state.customers)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getStepsThunk())
  }, [dispatch])
  
  const handleStepFilterClick = (stepId: string) => {
    // If the step is already filtered, clear the filter; otherwise, set it
    if (customersFilter.step === stepId) {
      dispatch(changeInputFilterCustomerAct({ key: "step", value: "" }))
    } else {
      dispatch(changeInputFilterCustomerAct({ key: "step", value: stepId }))
    }
  }
  
  const handleNoStepFilterClick = () => {
    // If "no-step" is already filtered, clear the filter; otherwise, set it
    if (customersFilter.step === "no-step") {
      dispatch(changeInputFilterCustomerAct({ key: "step", value: "" }))
    } else {
      dispatch(changeInputFilterCustomerAct({ key: "step", value: "no-step" }))
    }
  }
  
  const totalSuccess = customers.reduce((previous, current, i) => (current.status === 0 && current.answered  && (current.step as any).length > 0 ? previous + 1 : previous), 0)
  const customerResumeBasedOnStepsColors = settings.find((setting) => setting.title === 'customer_resume_based_on_steps_colors')?.value?.toString() === 'true'
  const dontAnswer = customers.reduce((previous, current, i) => (current.status === 0 && (current.step == null || (current.step as any).length === 0) ? previous + 1 : previous), 0)
  
  // Group customers by step when customerResumeBasedOnStepsColors is true
  const getCustomersByStep = () => {
    const customersByStep: { [key: string]: { step: StepType; count: number } } = {}
    
    // Initialize all steps with count 0
    steps.forEach(step => {
      customersByStep[step._id] = { step, count: 0 }
    })
    
    // Count customers for each step
    customers.forEach(customer => {
      if (customer.step && Array.isArray(customer.step) && customer.step.length > 0) {
        const step = customer.step[0] as StepType
        const stepId = step._id
        
        if (customersByStep[stepId]) {
          customersByStep[stepId].count += 1
        }
      }
    })
    
    return Object.values(customersByStep).sort((a, b) => a.step.order - b.step.order)
  }
  
  const customersByStep = getCustomersByStep()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  
  const StepChip = ({ step, count, onClick, isActive }: { step?: StepType, count: number, onClick: () => void, isActive: boolean }) => {
    const color = step?.color || brown.A700
    return (
      <Chip
        icon={
          isActive ? (
            <CheckCircle htmlColor={color} sx={{ fontSize: '14px !important' }} />
          ) : (
            <Circle htmlColor={color} sx={{ fontSize: '12px !important' }} />
          )
        }
        label={count}
        onClick={onClick}
        size="small"
        sx={{
          cursor: 'pointer',
          height: '24px',
          fontSize: '0.7rem',
          '& .MuiChip-icon': { 
            marginLeft: '4px',
            color: `${color} !important`
          },
          border: isActive ? `2px solid ${color}` : '1px solid transparent',
          backgroundColor: isActive ? `${color}15` : 'transparent',
          fontWeight: isActive ? 'bold' : 'normal',
          boxShadow: isActive ? `0 0 0 2px ${color}40` : 'none',
          '&:hover': {
            backgroundColor: `${color}25`,
            border: `1px solid ${color}`
          }
        }}
      />
    )
  }
  
  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 0.5, 
          alignItems: 'center',
          padding: 1,
          justifyContent: isSmallScreen ? 'flex-start' : 'center',
          minWidth: 'fit-content'
        }}
      >
        {customerResumeBasedOnStepsColors ? (
          <>
            {customersByStep.map(({ step, count }) => (
              <Tooltip key={step._id} title={`${step.title}: ${count} clientes`} arrow>
                <Box>
                  <StepChip
                    step={step}
                    count={count}
                    onClick={() => handleStepFilterClick(step._id)}
                    isActive={customersFilter.step === step._id}
                  />
                </Box>
              </Tooltip>
            ))}
            <Tooltip title={`Sin paso: ${dontAnswer} clientes`} arrow>
              <Box>
                <StepChip
                  count={dontAnswer}
                  onClick={handleNoStepFilterClick}
                  isActive={customersFilter.step === "no-step"}
                />
              </Box>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip title={`sin contestar ${customers.reduce((previous, current, i) => (current.status === 0 && !current.answered && (current.step != null && current.step as any).length > 0 ? previous + 1 : previous), 0)}`} arrow>
              <Chip
                icon={<Circle sx={{ fontSize: '12px !important' }} color="success" />}
                label={totalSuccess}
                size="small"
                sx={{ height: '24px', fontSize: '0.7rem', '& .MuiChip-icon': { marginLeft: '4px' } }}
              />
            </Tooltip>
            <Chip
              icon={<Circle sx={{ fontSize: '12px !important', color: yellow[500] }} />}
              label={customers.reduce((previous, current, i) => (current.status === 0 && !current.answered ? previous + 1 : previous), 0)}
              size="small"
              sx={{ height: '24px', fontSize: '0.7rem', '& .MuiChip-icon': { marginLeft: '4px' } }}
            />
            <Chip
              icon={<Circle sx={{ fontSize: '12px !important', color: purple[500] }} />}
              label={customers.reduce((previous, current, i) => (current.status === 0 && current.isProspect ? previous + 1 : previous), 0)}
              size="small"
              sx={{ height: '24px', fontSize: '0.7rem', '& .MuiChip-icon': { marginLeft: '4px' } }}
            />
            <Chip
              icon={<Circle sx={{ fontSize: '12px !important', color: blue[500] }} />}
              label={customers.reduce((previous, current, i) => (current.status === 0 && current.answered && (current.step as any).length === 0 ? previous + 1 : previous), 0)}
              size="small"
              sx={{ height: '24px', fontSize: '0.7rem', '& .MuiChip-icon': { marginLeft: '4px' } }}
            />
            <Chip
              icon={<Circle sx={{ fontSize: '12px !important', color: red[500] }} />}
              label={customers.reduce((previous, current, i) => (current.status === 2 ? previous + 1 : previous), 0)}
              size="small"
              sx={{ height: '24px', fontSize: '0.7rem', '& .MuiChip-icon': { marginLeft: '4px' } }}
            />
            <Chip
              icon={<Circle sx={{ fontSize: '12px !important', color: grey[500] }} />}
              label={customers.reduce((previous, current, i) => (current.status === 1 ? previous + 1 : previous), 0)}
              size="small"
              sx={{ height: '24px', fontSize: '0.7rem', '& .MuiChip-icon': { marginLeft: '4px' } }}
            />
          </>
        )}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5, 
          marginLeft: isSmallScreen ? 0 : 'auto',
          marginTop: isSmallScreen ? 0.5 : 0,
          flexShrink: 0
        }}>
          <ButtonGroup size="small" sx={{ height: '24px' }}>
            <Button sx={{ padding: '2px 8px', fontSize: '0.7rem', height: '24px' }} size="small" variant="outlined">
              Total:
            </Button>
            <Button sx={{ padding: '2px 8px', fontSize: '0.7rem', height: '24px' }} size="small" variant="outlined">
              {customers.length}
            </Button>
          </ButtonGroup>
          <CustomersResumeSteps customers={customers} />
        </Box>
      </Box>
    </Box>
  )
}