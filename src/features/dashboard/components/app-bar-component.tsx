import { Toolbar, IconButton, Typography, styled } from "@mui/material"
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar"
import MenuIcon from "@mui/icons-material/Menu"
import { useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import AppBarNottifications from "./app-bar-nottifications"
import AppBarAlerts from "./app-bar-alerts"
import { getUserLevelDesc } from "../../../utils/user.utils"


interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

export default function AppBarComponent({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (value: boolean) => void
}) {
  const toggleDrawer = () => setOpen(!open)

  const { currentUser } = useAppSelector((state: RootState) => state.login)

  return (
    <AppBar position="relative" open={open}>
      <Toolbar
        sx={{
          pr: "24px", // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: "36px",
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1, marginLeft: {xs: 5.5, sm: 0} }}
        >
          Dashboard
        </Typography>
        <Typography>{currentUser?.email} | {getUserLevelDesc(currentUser?.level!)}</Typography>
        <AppBarAlerts />
        <AppBarNottifications/>
      </Toolbar>
    </AppBar>
  )
}
