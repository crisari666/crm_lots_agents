import { Badge, IconButton, Menu, MenuItem } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications"
import { useState } from "react";
import { AccountBox } from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function AppBarNottifications() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick} id="menu-app-bar">
        <Badge badgeContent={0} color="secondary">
          <AccountBox />
        </Badge>
      </IconButton>
      <Menu open={open} onClose={handleClose} id="documents" anchorEl={anchorEl}>
        <MenuItem > 
        <Link to="/dashboard/documents">
          Documentos 
        </Link>
        </MenuItem>
      </Menu>
    </>
  )
}