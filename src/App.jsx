import React from 'react'
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom'
import {RecoilRoot, useRecoilValue} from 'recoil'

import MainLayout from './layouts/MainLayout'
import BerandaPage from './pages/BerandaPage'
import LaporanPage from './pages/LaporanPage'
import UploadPage from './pages/UploadPage'
import UserPage from './pages/UserPage'
import LoginPage from './pages/LoginPage'

import {tokenAtom} from './store/authStore'

export default function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <MainPages />
        <Route exact path="/login">
          <LoginPage />
        </Route>
      </BrowserRouter>
    </RecoilRoot>
  )
}

const MainPages = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Switch>
          <PrivateRoute exact path="/">
            <BerandaPage />
          </PrivateRoute>
          <PrivateRoute exact path="/laporan">
            <LaporanPage />
          </PrivateRoute>
          <PrivateRoute exact path="/upload">
            <UploadPage />
          </PrivateRoute>
          <PrivateRoute exact path="/user">
            <UserPage />
          </PrivateRoute>
        </Switch>
      </MainLayout>
    </BrowserRouter>
  )
}

const PrivateRoute = ({children, additionalProps}) => {
  const token = useRecoilValue(tokenAtom)
  return (
    <Route
      exact
      {...additionalProps}
      render={({location}) =>
        token ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: {from: location},
            }}
          />
        )
      }
    />
  )
}
