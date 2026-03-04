/* eslint-disable react-hooks/exhaustive-deps */
import * as Yup from "yup"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import CssBaseline from "@mui/material/CssBaseline"
import TextField from "@mui/material/TextField" 
import Box from "@mui/material/Box"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { Copyright } from "@mui/icons-material"
import { useFormik } from "formik";
import LoadingIndicator from "../../app/components/loading-indicator"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { RootState } from "../../app/store"
import { resetEndSessionForce, signInUserThunk } from "./signin.slice"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DialogWronSignin from "./components/dialog-wrong-signin"
import HandleGeolocation from "../../app/components/handle-geolocation"

const defaultTheme = createTheme()

export default function SignInView() {
  const validationSchema = Yup.object().shape({
    user: Yup.string().required("Ingresa el correo o usuario"),
    password: Yup.string().min(6, 'Password should be of minimum 8 characters length').required('Password is required'),
  });
  const {loading, success, userPosition} = useAppSelector((state: RootState) => state.login)
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const formik = useFormik({ 
    validationSchema:validationSchema,
    initialValues: {user: "", password: ""}, 
    onSubmit: (values) => {
      const {user, password} = values     
      console.log({userPosition});
       
      if(userPosition !== undefined) {
        dispatch(signInUserThunk({user, password, lat: userPosition.lat, lng: userPosition.lng}))
      } else {
      alert('No ha sido posible determinar tu ubicacion, por favor verifica que tengas habilitado el GPS del dispositivo')
      }
    } 
  })

  useEffect(() => {
    if(success){
    navigate("/dashboard")
    }
  }, [success])

  useEffect(()=>{
    dispatch(resetEndSessionForce())
  }, [])


  return (
    <ThemeProvider theme={defaultTheme}>
      <HandleGeolocation/>
      <DialogWronSignin/>
      <LoadingIndicator open={loading} />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5"> Sign in </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Box  sx={{ mt: 1 }}>
              <TextField 
                margin="normal" 
                required 
                fullWidth 
                id="user" 
                label="Usuario" 
                name="user" 
                autoFocus 
                error={formik.touched.user && Boolean(formik.errors.user)}
                helperText={formik.touched.user && formik.errors.user}
                value={formik.values.user}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <TextField
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                margin="normal"
                required
                fullWidth
                value={formik.values.password}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign In
              </Button>
              {/* <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2"> Forgot password? </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2"> {"Don't have an account? Sign Up"}</Link>
                </Grid>
              </Grid> */}
            </Box>
          </form>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  )
}
