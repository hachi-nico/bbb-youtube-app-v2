import React, {useState} from 'react'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import LayersIcon from '@mui/icons-material/Layers'
import ArticleIcon from '@mui/icons-material/Article'
import BackupIcon from '@mui/icons-material/Backup'
import GroupIcon from '@mui/icons-material/Group'
import LogoutIcon from '@mui/icons-material/Logout'

import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'

import './MainLayout.css'
import {indigo} from '../config/color'

const drawerWidth = 240

function ResponsiveDrawer({children, window}) {
  const [value, setValue] = useState('Antrian')

  const handleChange = (event, newValue) => {
    console.log(event)
    setValue(newValue)
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
      label: 'User',
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
      {/* Section Top Bar Mobile */}
      <AppBar position="fixed" sx={{display: {md: 'none'}, bgcolor: indigo}}>
        <Toolbar></Toolbar>
      </AppBar>

      <Box sx={{width: {md: drawerWidth}}}>
        {/* Section Drawer Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: {xs: 'none', md: 'block'},
            '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
          }}
          open
        >
          <Box sx={{px: 2, bgcolor: indigo}}>
            <p className="headerDrawerHeading">Hello Nama User</p>
          </Box>
          {drawer}
        </Drawer>
      </Box>
      <Box
        sx={{
          px: 2,
          width: {md: `calc(100% - ${drawerWidth}px)`},
          mt: {xs: 8, md: 0},
        }}
      >
        {children}
      </Box>

      {/* Section Bottom Nav Mobile */}
      <BottomNavigation
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          bgcolor: indigo,
          '& .Mui-selected, .Mui-selected > svg': {
            color: '#fff',
          },
          display: {md: 'none'},
        }}
        value={value}
        onChange={handleChange}
      >
        {adminMenuList.map((item, i) => (
          <BottomNavigationAction
            key={i}
            label={item.label}
            value={item.label}
            icon={item.icon}
            sx={{color: 'white'}}
          />
        ))}
      </BottomNavigation>
    </Box>
  )
}

export default ResponsiveDrawer
