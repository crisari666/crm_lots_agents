import { useEffect } from "react";
import AppSelector from "../../../app/components/app-select";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeStepFilterAct, changeTypeFilterAct } from "../customer-center.slice";
import { getStepsThunk } from "../../steps/steps.slice";

export default function CustomerCenterSelectorStatus() {
  const dispatch = useAppDispatch()
  const {filter} = useAppSelector((state) => state.customerCenter)  
  const {settings} = useAppSelector((state) => state.settings)
  const customerResumeBasedOnStepsColors = settings.find((setting) => setting.title === 'customer_resume_based_on_steps_colors')?.value?.toString() === 'true'
  const {steps} = useAppSelector((state) => state.steps)  

  useEffect(() => {
    dispatch(getStepsThunk())
  }, [])

  const options = customerResumeBasedOnStepsColors ? steps.map((step) => ({_id: step._id, name: step.title})) : [
    {_id: 'all', name: 'Todos'},
    {_id: 'success', name: 'Exitosos'},
    {_id: 'active', name: 'Activo'},
    {_id: 'pending', name: 'Pendiente'},
    {_id: 'inactive', name: 'Deshabilitado'},
    {_id: 'prospect', name: 'Prospecto'},
  ]

  return(
    <>
      {customerResumeBasedOnStepsColors ? (
        <AppSelector 
          label="Etapa"
          value={filter.step}
          onChange={(f) => dispatch(changeStepFilterAct(f.val))}
          options={options}
        />
      ) : ( 
      <AppSelector 
          label="Type"
          value={filter.type}
          onChange={(f) => dispatch(changeTypeFilterAct(f.val))}
          options={options}
        />
      )}
    </>
  )
}

//66171f9e59d691802e4000e6