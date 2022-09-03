import React, {useState} from 'react'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import Divider from '@mui/material/Divider'

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
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'

import './MainLayout.css'
import {indigo} from '../config/color'

const drawerWidth = 240

function ResponsiveDrawer({children, window}) {
  const [bottomNavValue, setBottomNavValue] = useState('Antrian')
  const [sideNavValue, setSideNavValue] = useState(0)

  const handleChange = (event, newValue) => {
    setBottomNavValue(newValue)
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
    <List sx={{mt: 2}}>
      {adminMenuList.map((item, index) => {
        const isActiveColor =
          sideNavValue == index ? {color: '#fff'} : {color: '#000'}
        const isActiveBgColor =
          sideNavValue == index ? {bgcolor: indigo} : {bgcolor: '#fff'}

        return (
          <ListItem key={index} disablePadding>
            <ListItemButton
              onClick={() => setSideNavValue(index)}
              sx={{
                ...isActiveBgColor,
                '&:hover': {
                  backgroundColor:
                    sideNavValue == index ? indigo : 'rgba(0,0,0,0.05)',
                },
              }}
            >
              <ListItemIcon sx={isActiveColor}>{item.icon}</ListItemIcon>
              <ListItemText sx={isActiveColor} primary={item.label} />
            </ListItemButton>
          </ListItem>
        )
      })}
    </List>
  )

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
          <Box sx={{p: 2}}>
            <p className="headerDrawerHeading">
              Automatic Bigbluebutton Recording Upload System
            </p>
          </Box>
          <Divider />
          {drawer}
          <div className="userInfoContainer">
            <Divider />
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 12,
                paddingBottom: 12,
                paddingLeft: 16,
                paddingRight: 16,
              }}
            >
              <AccountCircleIcon sx={{marginRight: 2, fontSize: 30}} />
              <p>Nico Akbar Wahyudin Prasetyo Widodo</p>
            </div>
          </div>
        </Drawer>
      </Box>
      <Box
        sx={{
          px: 2,
          width: {md: `calc(100% - ${drawerWidth}px)`},
          mt: {xs: 8, md: 2},
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
        value={bottomNavValue}
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
