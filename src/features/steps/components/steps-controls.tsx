import { Button, Card, CardContent } from "@mui/material";
import { useAppDispatch } from "../../../app/hooks";
import { showFormStepAct } from "../steps.slice";

export default function StepsControl() {
  const dispatch = useAppDispatch()  
  return (
    <Card sx={{marginBottom: 1, padding: 1}}>
        <Button onClick={() => dispatch(showFormStepAct(true))} variant="contained"> AGREGAR PASO </Button>
    </Card>
  )
}