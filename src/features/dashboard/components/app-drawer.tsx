import {
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import List from "@mui/material/List"
import Divider from "@mui/material/Divider"
import MuiDrawer from "@mui/material/Drawer"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import React from "react"
import { MenuItems } from "./menu-items"
import { ChevronRight, Logout } from "@mui/icons-material"
import { Link } from "react-router-dom"
import logoApp from './../../../assets/omega-icon.png'
const drawerWidth: number = 240

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    overflowX: 'hidden',
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(8),
      },
    }),
  },
}))

export default function AppDrawer() {
  const [open, setOpen] = React.useState(false)
  const toggleDrawer = () => {
    setOpen(!open)
  }
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Drawer variant="permanent" open={open} sx={{position: {xs: "absolute", sm: 'relative', md: "relative"}, zIndex: 20, overflowX: 'hidder'}}>
      
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
          px: [1],
        }}
      >
        <img src={logoApp} className="logo-drawer" alt="888" onClick={toggleDrawer}/>
        {open && <Typography variant="h6" sx={{marginLeft: 8}}>Selene</Typography>}
        <IconButton onClick={toggleDrawer} sx={{position: "absolute", right: -5, padding: 0, margin: 0}}>
          {open ? <ChevronLeftIcon /> : <ChevronRight />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav" sx={{position: {xs: "relative", sm: "relative"}, zIndex: 100, display: {xs: open ? 'block' : 'none', sm: 'block'}}}>
        <MenuItems onClick={() => isSm ? setOpen(false) : null}/>
        <Divider sx={{ my: 1 }} />
        {/* {secondaryListItems} */}
        <Link to={"/logout"}>
          <ListItemButton>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary={"Salir"} />
          </ListItemButton>
        </Link>
      </List>
    </Drawer>
  )
}
