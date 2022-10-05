import React from 'react'
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom'
import {RecoilRoot, useRecoilValue} from 'recoil'

import MainLayout from './layouts/MainLayout'
import BerandaPage from './pages/BerandaPage'
import LaporanPage from './pages/LaporanPage'
import UploadPage from './pages/UploadPage'
import UserPage from './pages/UserPage'
import LoginPage from './pages/LoginPage'

export default function App() {
  return (
    <RecoilRoot>
      <PageRouters />
    </RecoilRoot>
  )
}

const PageRouters = () => {
  return (
    <BrowserRouter>
      <Switch>
        <MainLayout>
          <PrivateRoute exact path="/">
            <Redirect to="/antrian" />
          </PrivateRoute>
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
    </BrowserRouter>
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
