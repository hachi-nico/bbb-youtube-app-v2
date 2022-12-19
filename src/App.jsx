import React, {useEffect} from 'react'
import {
  Switch,
  Route,
  Redirect,
  useLocation,
  useHistory,
} from 'react-router-dom'

import MainLayout from './layouts/MainLayout'
import BerandaPage from './pages/BerandaPage'
import LaporanPage from './pages/LaporanPage'
import UploadPage from './pages/UploadPage'
import UserPage from './pages/UserPage'
import LoginPage from './pages/LoginPage'
import {baseUrl} from './config/api'

export default function App() {
  useEffect(() => {
    async function registerServiceWorker() {
      try {
        const register = await navigator.serviceWorker.register('./worker.js', {
          scope: '/',
        })
        const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: import.meta.env.VITE_APP_PUBLIC_VAPID_KEY,
        })

        await fetch(baseUrl + 'notification-subscribe', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } catch (e) {
        console.log('gagal service worker', e)
      }
    }
    registerServiceWorker()
  }, [])

  const {pathname} = useLocation()
  if (pathname == '/') return useHistory().push('/antrian')
  return (
    <Switch>
      <MainLayout>
        <PublicRoute exact path="/login">
          <LoginPage />
        </PublicRoute>
        <PrivateRoute path="/antrian">
          <BerandaPage />
        </PrivateRoute>
        <PrivateRoute path="/laporan">
          <LaporanPage />
        </PrivateRoute>
        <PrivateRoute path="/upload">
          <UploadPage />
        </PrivateRoute>
        <PrivateRoute path="/user">
          <UserPage />
        </PrivateRoute>
      </MainLayout>
    </Switch>
  )
}

const PrivateRoute = ({children, path}) => {
  const token = JSON.parse(localStorage.getItem('token'))
  return (
    <Route
      path={path}
      render={() => (token ? children : <Redirect to={{pathname: '/login'}} />)}
    />
  )
}

const PublicRoute = ({children, path}) => {
  const token = JSON.parse(localStorage.getItem('token'))
  return (
    <Route
      path={path}
      render={() =>
        !token ? children : <Redirect to={{pathname: '/antrian'}} />
      }
    />
  )
}
