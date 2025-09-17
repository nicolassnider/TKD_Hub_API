import React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MenuIcon from '@mui/icons-material/Menu'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import { useNavigate } from 'react-router-dom'
import { useRole } from '../context/RoleContext'

export default function Header() {
  const navigate = useNavigate()
  const { token, role, displayName, avatarUrl, setToken, setRole, setDisplayName, setAvatarUrl } = useRole()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const [logoutOpen, setLogoutOpen] = React.useState(false)

  const logout = () => {
    setToken(null)
    setRole(['Guest'])
    setDisplayName?.(null)
    setAvatarUrl?.(null)
    setLogoutOpen(false)
    navigate('/')
  }

  const confirmLogout = () => setLogoutOpen(true)
  const cancelLogout = () => setLogoutOpen(false)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={handleMenu}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={() => { handleClose(); navigate('/') }}>Home</MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/students') }}>Students</MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/events') }}>Events</MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/blog') }}>Blog</MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/classes') }}>Classes</MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/coaches') }}>Coaches</MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/dojaangs') }}>Dojaangs</MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/promotions') }}>Promotions</MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/ranks') }}>Ranks</MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/tuls') }}>Tuls</MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/users') }}>Users</MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/dashboard') }}>Dashboard</MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/payments/mercadopago') }}>Payments</MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/manage') }}>Manage</MenuItem>
          </Menu>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TKD Hub
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            <Button color="inherit" onClick={() => navigate('/students')}>Students</Button>
            <Button color="inherit" onClick={() => navigate('/events')}>Events</Button>
            <Button color="inherit" onClick={() => navigate('/blog')}>Blog</Button>
            <Button color="inherit" onClick={() => navigate('/classes')}>Classes</Button>
            <Button color="inherit" onClick={() => navigate('/coaches')}>Coaches</Button>
          </Box>

          {token ? (
            <>
              <Chip
                avatar={displayName || avatarUrl ? <Avatar alt={displayName ?? 'User'} src={avatarUrl ?? undefined} /> : undefined}
                label={displayName ?? (Array.isArray(role) ? role[0] : role) ?? 'User'}
                variant="outlined"
                sx={{ mr: 1 }}
              />
              <Button color="inherit" onClick={confirmLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
              <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
            </>
          )}

          <Dialog open={logoutOpen} onClose={cancelLogout}>
            <DialogTitle>Confirm logout</DialogTitle>
            <DialogContent>
              <DialogContentText>Are you sure you want to sign out?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={cancelLogout}>Cancel</Button>
              <Button onClick={logout} color="primary">Sign out</Button>
            </DialogActions>
          </Dialog>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
