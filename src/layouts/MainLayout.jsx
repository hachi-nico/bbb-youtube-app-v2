import React, {useState} from 'react'
import {Link as RouterLink} from 'react-router-dom'
import axios from 'axios'
import {useHistory, useLocation} from 'react-router-dom'

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
import SubscriptionsIcon from '@mui/icons-material/Subscriptions'

import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'

import './MainLayout.css'
import {indigo} from '../config/color'
import Alert from '../components/Alert'
import {baseUrl} from '../config/api'

const drawerWidth = 240

function MainLayout({children}) {
  const token = JSON.parse(localStorage.getItem('token'))
  const isSuperAdmin = JSON.parse(localStorage.getItem('userData'))
  if (!token) return children

  const adminMenuList =
    isSuperAdmin.tipe == 1
      ? [
          {
            label: 'User',
            icon: <GroupIcon />,
            route: '/user',
          },
        ]
      : []

  const userMenuList = [
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
      label: 'Video',
      icon: <SubscriptionsIcon />,
      route: '/video',
    },
    {
      label: 'Upload',
      icon: <BackupIcon />,
      route: '/upload',
    },
    ...adminMenuList,
    {
      label: 'Keluar',
      icon: <LogoutIcon />,
      route: '/keluar',
    },
  ]

  const [navValue, setNavValue] = useState('Antrian')
  const [alertOpen, setAlertOpen] = useState(false)
  const [promptOpen, setPromptOpen] = useState(false)
  const history = useHistory()
  const {pathname} = useLocation()
  const {user = 'user'} = JSON.parse(localStorage.getItem('userData'))

  const handleNav = route => {
    setNavValue(route)
  }

  const logoutHandler = async () => {
    const token = JSON.parse(localStorage.getItem('token'))
    try {
      const {data} = await axios.post(baseUrl + 'logout', {
        token,
      })

      if (data.status == 1) {
        localStorage.removeItem('token')
        history.push('/login')
      } else {
        setAlertOpen(true)
      }
    } catch (e) {
      setAlertOpen(true)
    }
  }

  const desktopDrawerItem = (
    <List sx={{mt: 2}}>
      {userMenuList.map((item, index) => {
        const isActiveColor =
          pathname == item.route ? {color: '#fff'} : {color: '#000'}
        const isActiveBgColor =
          pathname == item.route ? {bgcolor: indigo} : {bgcolor: '#fff'}

        return (
          <RouterLink to={item.route} key={index}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  if (item.route == '/keluar') {
                    setPromptOpen(true)
                  } else {
                    handleNav(item.label)
                  }
                }}
                sx={{
                  ...isActiveBgColor,
                  '&:hover': {
                    backgroundColor:
                      pathname == item.route ? indigo : 'rgba(0,0,0,0.05)',
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
      <Alert
        label={'Apakah anda yakin untuk melakukan Log Out ?'}
        onClose={() => {
          setPromptOpen(false)
          history.push('/antrian')
        }}
        onConfirm={() => {
          setPromptOpen(false)
          logoutHandler()
        }}
        opened={promptOpen}
        confirmDialog
      />
      <Alert
        label={'Gagal saat Log Out'}
        onClose={() => setAlertOpen(false)}
        opened={alertOpen}
        promptDialog
      />
      <CssBaseline />
      {/* Section Top Bar Mobile */}
      <AppBar position="fixed" sx={{display: {md: 'none'}, bgcolor: indigo}}>
        <Toolbar
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <p>{user}</p>
          <AccountCircleIcon sx={{marginLeft: 1, fontSize: 30}} />
        </Toolbar>
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
              Dashboard Monitoring Recording BigBlueButton
            </p>
          </Box>
          <Divider />
          {desktopDrawerItem}
          <div className="userInfoContainer">
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
              <p>{user}</p>
            </div>
          </div>
        </Drawer>
      </Box>
      <Box
        sx={{
          px: 2,
          width: {md: `calc(100% - ${drawerWidth}px)`, xs: '100%'},
          mt: {xs: 10, md: 2},
          mb: {xs: 16, md: 6},
        }}
      >
        {children}
      </Box>

      {/* Section Bottom Nav Mobile */}
      <BottomNavigation
        sx={{
          width: '100vw',
          position: 'fixed',
          bottom: 0,
          bgcolor: indigo,
          '& .Mui-selected, .Mui-selected > svg': {
            color: '#fff',
          },
          display: {md: 'none'},
        }}
        value={navValue}
      >
        {userMenuList.map((item, i) => {
          if (item.label == 'Upload') return null
          return (
            <BottomNavigationAction
              LinkComponent={RouterLink}
              to={item.route}
              key={i}
              label={item.label}
              value={item.label}
              icon={item.icon}
              sx={{color: 'white'}}
              onClick={() => {
                if (item.route == '/keluar') {
                  setPromptOpen(true)
                } else {
                  handleNav(item.label)
                }
              }}
            />
          )
        })}
      </BottomNavigation>
    </Box>
  )
}

export default MainLayout
