import * as Yup from "yup"
import { Button, Dialog, DialogContent, DialogTitle, MenuItem, Select, TextField } from "@mui/material";
import { FormikTouched, FormikValues, useFormik } from "formik"
import { ReactNode, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { RootState } from "../../../app/store";
import { addExpenseThunk, showModalFormExpenseAction } from "../handle-expenses.slice";
import { getCurrenDateUtil } from "../../../utils/date.utils";
import { OmegaSoftConstants } from "../../../app/khas-web-constants";

const initialValues = {
  type: 9,
  value: 0,
  name: "",
}



export default function ExpenseFormModal() {
  const { showFormModal } = useAppSelector((state: RootState) => state.expenses)
  const dispatch = useAppDispatch()

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Ingresa un nombre").min(4, "Minimo 6 caracteres"),
    value: Yup.number().required("Ingresa un nombre").min(0, "Un gasto no puede tener valor negativo"),
    type: Yup.number().required("Ingresa un tipo de gasto"),
  })

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: (values) => {
      console.log({ values })
      dispatch(addExpenseThunk(values))
      
    },
    enableReinitialize: true,
  })

  useEffect(()=> {
    if(!showFormModal){
      formik.resetForm()
    }
  }, [showFormModal])
  return(
    <Dialog open={showFormModal} onClose={() => dispatch(showModalFormExpenseAction(false))}>
      <DialogTitle>AGREGAR GASTO</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField placeholder="Fecha" value={getCurrenDateUtil()} fullWidth disabled/>
          {Object.keys(initialValues).map((key, i) => {
            return key === 'type' ? (
              <Select
                style={{ marginBlock: 10 }}
                fullWidth
                key={key}
                id={key}
                name={key}
                label={key.toUpperCase()}
                value={(formik.values as FormikValues)[key]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  Boolean((formik.touched as FormikTouched<FormikValues>)[key]) &&
                  Boolean((formik.errors as FormikTouched<FormikValues>)[key])
                }
                >
                {OmegaSoftConstants.expenseType.map((type) => (
                  <MenuItem key={`expense_${type._id}`} value={type._id}>{type.name}</MenuItem>
                ))}
              </Select>
            )
             : (
              <TextField
                style={{ marginBlock: 10 }}
                fullWidth
                key={key}
                id={key}
                name={key}
                label={key.toUpperCase()}
                value={(formik.values as FormikValues)[key]}
                type={key===  "value" ? "number" : "text"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  Boolean((formik.touched as FormikTouched<FormikValues>)[key]) &&
                  Boolean((formik.errors as FormikTouched<FormikValues>)[key])
                }
                helperText={
                  Boolean((formik.touched as FormikTouched<FormikValues>)[key]) &&
                  ((formik.errors as FormikTouched<FormikValues>)[
                    key
                  ] as ReactNode)
                }
              />
            )      
          })}
          <Button color="primary" variant="contained" fullWidth type="submit">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}