import { Badge, IconButton, Menu, MenuItem } from '@mui/material'
import { AccountBox } from '@mui/icons-material'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function AppBarNottifications() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (): void => {
    setAnchorEl(null)
  }
  return (
    <>
      <IconButton color="inherit" onClick={handleClick} id="menu-app-bar">
        <Badge badgeContent={0} color="secondary">
          <AccountBox />
        </Badge>
      </IconButton>
      <Menu open={open} onClose={handleClose} id="user-menu" anchorEl={anchorEl}>
        <MenuItem onClick={handleClose}>
          <Link to="/dashboard/users/profile">Mi perfil</Link>
        </MenuItem>
      </Menu>
    </>
  )
}
