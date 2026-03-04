import { Card , IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from "react";
import { getStepsThunk, setStepIdForEditAct, showFormStepAct, updateInputStepFormAct } from "../steps.slice";
import { Edit } from "@mui/icons-material";
import { StepType } from "../../../app/models/step.type";
import LoadingIndicator from "../../../app/components/loading-indicator";

export default function StepsList() {
  const { steps, loading } = useAppSelector((state) => state.steps)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getStepsThunk())
  }, [dispatch])

  const editStep = (step: StepType) => { 
    dispatch(showFormStepAct(true))
    dispatch(updateInputStepFormAct({name: 'order', value: step.order}))
    dispatch(updateInputStepFormAct({name: 'title', value: step.title}))
    dispatch(updateInputStepFormAct({name: 'color', value: step.color || ''}))
    dispatch(setStepIdForEditAct(step._id))
  }
  return (
    <>
      <LoadingIndicator open={loading}/>
     <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>N</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {steps.map((step, index) => 
                <TableRow key={index}>
                  <TableCell>{step.order}</TableCell>
                  <TableCell>{step.title}</TableCell>
                  <TableCell>
                    {step.color ? (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px' 
                      }}>
                        <div 
                          style={{ 
                            width: '20px', 
                            height: '20px', 
                            backgroundColor: step.color, 
                            borderRadius: '50%',
                            border: '1px solid #ccc'
                          }}
                        />
                        <span style={{ color: step.color, fontWeight: 'bold' }}>
                          {step.color}
                        </span>
                      </div>
                    ) : (
                      <span style={{ color: '#999' }}>Sin color</span>
                    )}
                  </TableCell>
                  <TableCell> 
                    <IconButton onClick={() => editStep(step)} color="primary" size="small"> 
                      <Edit fontSize="small"/> 
                    </IconButton> 
                  </TableCell>
                </TableRow>
              )
              }
            </TableBody>
          </Table>

        </TableContainer>
      </Card> 
    </>
  )
}