import React, {useState} from 'react'
import {Link as RouterLink} from 'react-router-dom'
import {useRecoilValue} from 'recoil'

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

function MainLayout({children}) {
  const token = JSON.parse(localStorage.getItem('token'))

  if (!token) return children

  const adminMenuList = [
    {
      label: 'Antrian',
      icon: <LayersIcon />,
      route: '/antrian',
    },
    {
      label: 'Laporan',
      icon: <ArticleIcon />,
      route: '/laporan',
    },
    {
      label: 'Upload',
      icon: <BackupIcon />,
      route: '/upload',
    },
    {
      label: 'User',
      icon: <GroupIcon />,
      route: '/user',
    },
    {
      label: 'Keluar',
      icon: <LogoutIcon />,
      route: '/keluar',
    },
  ]

  const [navValue, setNavValue] = useState('Antrian')

  const handleNav = route => {
    setNavValue(route)
  }

  const desktopDrawerItem = (
    <List sx={{mt: 2}}>
      {adminMenuList.map((item, index) => {
        const isActiveColor =
          navValue == item.label ? {color: '#fff'} : {color: '#000'}
        const isActiveBgColor =
          navValue == item.label ? {bgcolor: indigo} : {bgcolor: '#fff'}

        return (
          <RouterLink to={item.route} key={index}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNav(item.label)}
                sx={{
                  ...isActiveBgColor,
                  '&:hover': {
                    backgroundColor:
                      navValue == item.label ? indigo : 'rgba(0,0,0,0.05)',
                  },
                }}
              >
                <ListItemIcon sx={isActiveColor}>{item.icon}</ListItemIcon>
                <ListItemText sx={isActiveColor} primary={item.label} />
              </ListItemButton>
            </ListItem>
          </RouterLink>
        )
      })}
    </List>
  )

  return (
    <Box sx={{display: 'flex', flex: 1}}>
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
            '&& .MuiTouchRipple-child': {backgroundColor: indigo},
          }}
          open
        >
          <Box sx={{p: 2}}>
            <p className="headerDrawerHeading">
              Automatic Bigbluebutton Recording Upload System
            </p>
          </Box>
          <Divider />
          {desktopDrawerItem}
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
          width: {md: `calc(100% - ${drawerWidth}px)`, xs: '100%'},
          mt: {xs: 10, md: 2},
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
        value={navValue}
      >
        {adminMenuList.map((item, i) => (
          <BottomNavigationAction
            LinkComponent={RouterLink}
            to={item.route}
            key={i}
            label={item.label}
            value={item.label}
            icon={item.icon}
            sx={{color: 'white'}}
            onClick={() => handleNav(item.label)}
          />
        ))}
      </BottomNavigation>
    </Box>
  )
}

export default MainLayout
