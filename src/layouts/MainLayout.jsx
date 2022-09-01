import React, {useState} from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import LayersIcon from '@mui/icons-material/Layers'
import ArticleIcon from '@mui/icons-material/Article'
import BackupIcon from '@mui/icons-material/Backup'
import GroupIcon from '@mui/icons-material/Group'
import LogoutIcon from '@mui/icons-material/Logout'

const drawerWidth = 240

function ResponsiveDrawer({children, window}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const adminMenuList = [
    {
      label: 'Antrian',
      icon: <LayersIcon />,
    },
    {
      label: 'Laporan',
      icon: <ArticleIcon />,
    },
    {
      label: 'Upload',
      icon: <BackupIcon />,
    },
    {
      label: 'Managemen Akun',
      icon: <GroupIcon />,
    },
    {
      label: 'Keluar',
      icon: <LogoutIcon />,
    },
  ]

  const drawer = (
    <List>
      {adminMenuList.map((item, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )

  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <Box sx={{display: 'flex'}} className="removeBoxPadding">
      <CssBaseline />
      {/* Section navbar */}
      <AppBar position="fixed" sx={{display: {md: 'none'}}}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{mr: 2, display: {md: 'none'}}}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Responsive drawer
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{width: {md: drawerWidth}}}>
        {/* Section Drawer Mobile */}
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: {xs: 'block', md: 'none'},
            '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
          }}
        >
          {drawer}
        </Drawer>

        {/* Section Drawer Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: {xs: 'none', md: 'block'},
            '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        sx={{
          px: 2,
          width: {sm: `calc(100% - ${drawerWidth}px)`},
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default ResponsiveDrawer
