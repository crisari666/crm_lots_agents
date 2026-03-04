/* eslint-disable react-hooks/exhaustive-deps */
import * as Yup from "yup"
/* eslint-disable prettier/prettier */
import { FormikTouched, FormikValues, useFormik } from "formik"
import { Button, Grid, MenuItem, Select, TextField } from "@mui/material"
import { ReactNode, useEffect } from "react"
import { getCurrenDateUtil } from "../../utils/date.utils"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { RootState } from "../../app/store";
import { fetchUsersThunk } from "../users-list/slice/user-list.slice";
import CardPositionMap from "./components/card-position-map";
import { MapOutlined } from "@mui/icons-material";
import { changeUserCreateCardAction, createCardThunk, setGeoPosAllowedHandleCardAction, setPositionHandleCardAction, setShowMapAction } from "./handle-card.slice";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import LoadingIndicator from "../../app/components/loading-indicator";
import { useNavigate } from "react-router-dom";
import { OmegaSoftConstants } from "../../app/khas-web-constants"
import { setUserIdAction } from "../handle-user/handle-user.slice"
import { CheckUserAllowedComponent } from "../../app/components/check-user-allowed-component"


interface DisableInputI {
  [key: string]: boolean | undefined
}

const disabledInputs: DisableInputI = {
  date: true, total: true
}
const initialValues = {
  date: getCurrenDateUtil(),
  name: "",
  address: "",
  phone: "",
  ocupation: "",
  percentage: 20,
  value: 0,
  total: 0,
  dailyPayment: 0,
  nPayments:24, 

}

export function HandleCard() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { currentUser} = useAppSelector((state: RootState) => state.login)
  const {users} = useAppSelector((state: RootState) => state.users)
  

  const {geoPosAllowed, position, loading, createdCard, user} = useAppSelector((state: RootState) => state.handleCard)

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Ingresa un nombre").min(4, "Minimo 4 caracteres"),
    address: Yup.string().required("Ingresa una direccion").min(4, "Minimo 4 caracteres"),
    phone: Yup.string().required("Ingresa un telefono").min(7, 'Minimo 7').required('Email is required'),
    ocupation: Yup.string().required("Ingresa una ocupacion").min(4, "Minimo 4 caracteres"),
    percentage: Yup.number().min(0),
    value: Yup.number().required("Ingresa el valor del prestamo").min(0),
    total: Yup.number().min(0),
    dailyPayment: Yup.number().required().min(0),
    nPayments: Yup.number().required("Ingresa el numero de pagos").min(0)
  });

  useEffect(() => {
    if(users.length === 0){
      dispatch(fetchUsersThunk({enable: true}))
    }
  }, [users])

  useEffect(() => {
    if(navigator.geolocation){
      dispatch(setGeoPosAllowedHandleCardAction(true))
      navigator.geolocation.getCurrentPosition((pos) => {
        const {latitude, longitude} = pos.coords
        dispatch(setPositionHandleCardAction({latitude, longitude}))
      })
    }else {
      
    }
  }, [])

  const formik = useFormik({ 
    validationSchema:validationSchema,
    initialValues, 
    onSubmit: (values) => {      
      dispatch(createCardThunk({card: {...values, user}, lat: Number(position?.latitude), lng: Number(position?.longitude)}))
  } })

  const handleChange = ({key, value} : {key: string, value: string}) => {
    const allowToTrigger = ["percentage", "value", "dailyPayment", "nPayments"]
    if(allowToTrigger.indexOf(key) !== -1){
      var percentage =  Number(key === "percentage" ? value : formik.values.percentage);
      var val = Number(key === "value" ? value :  formik.values.value) 
      var interests = Number(val * (percentage/100));
      var dailyPayment = Number(key === "dailyPayment" ? value : formik.values.dailyPayment)
      var nPayments = Number(key === "nPayments" ? value : formik.values.nPayments)
      var total = Number(val) + Number(interests);
      if(key === "value" || key==="percentage") {
        formik.setFieldValue("nPayments", nPayments)
        formik.setFieldValue("dailyPayment", total/nPayments)
        formik.setFieldValue("total", total)
      }
      if(key === "dailyPayment"){
        formik.setFieldValue("nPayments", nPayments)
      }
      if(key === "nPayments"){
        formik.setFieldValue("dailyPayment", dailyPayment)
      }
    }
  }

  useEffect(() => {
    if(createdCard === true){
      navigate("/dashboard/cards-lists")
    }
  }, [createdCard])

  const handleUserSelectChange = (e: any) => {
    dispatch(changeUserCreateCardAction(e.target.value))
  }

  const render = (status: Status) => (<h1>{status}</h1>)
  
  return (
    <CheckUserAllowedComponent>
      <LoadingIndicator open={loading}/>
      {currentUser !== undefined && <form
          onSubmit={formik.handleSubmit}
        > 
          <Grid container spacing={1}>
            {Object.keys(formik.values).map((key, i) => {
              const isSelect = key === "user"
              // if(currentUser.level !== 0 && key === "user"){
              //   return <input key={key}  type="hidden" name={"user"} value={formik.values.user} onChange={formik.handleChange} />
              // }else {
                return (
                  <Grid item xs={4} key={key}>
                    <TextField style={{marginBlock: 10}}
                      fullWidth
                      id={key}
                      name={key}
                      select={isSelect}
                      disabled={disabledInputs[key] !== undefined}
                      //type={key === "date" ? "date" : "string"}
                      label={key.toUpperCase()}
                      value={(formik.values as FormikValues)[key]}
                      onChange={(e) => {
                        formik.handleChange(e)
                        handleChange({key: e.target.name, value: e.target.value})
                      }}
                      onBlur={formik.handleBlur}
                      error={Boolean((formik.touched as FormikTouched<FormikValues>)[key]) && Boolean((formik.errors as FormikTouched<FormikValues>)[key])}
                      helperText={
                        Boolean((formik.touched as FormikTouched<FormikValues>)[key]) &&  ((formik.errors as FormikTouched<FormikValues>)[key]) as ReactNode
                      }
                    />
                  </Grid>
                )

              // }
            })}
            {currentUser.level === 0 && <Grid item xs={4}>
              <Select required name="user" onChange={handleUserSelectChange} fullWidth value={user}> 
                <MenuItem value={undefined}>-- RUTA -- </MenuItem>
                {users.map((el, i) => <MenuItem key={el._id} value={el._id}>{el.email}</MenuItem>)}
              </Select>
            </Grid>}
            <Grid item xs={4} display={"flex"} alignItems={"center"} paddingBottom={"16px"}>
              <Button variant="contained" fullWidth startIcon={<MapOutlined />} onClick={()=> dispatch(setShowMapAction(true))}> UBICACION </Button>
            </Grid>
          </Grid>

          <Button color="primary" variant="contained" fullWidth type="submit">Submit</Button>
        </form>
      }
      {geoPosAllowed && position !== undefined && <Wrapper apiKey={OmegaSoftConstants.googleApiKey} render={render}>
        <CardPositionMap />
      </Wrapper>}
    </CheckUserAllowedComponent>
  )
}

