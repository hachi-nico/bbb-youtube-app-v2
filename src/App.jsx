import React from 'react'
import {BrowserRouter, Switch, Route, Link} from 'react-router-dom'

import MainLayout from './layouts/MainLayout'
import Beranda from './pages/Beranda'
import LaporanPage from './pages/LaporanPage'
import UploadPage from './pages/UploadPage'
import UserPage from './pages/UserPage'

export default function App() {
  return (
    <BrowserRouter>
      <MainPages />
    </BrowserRouter>
  )
}

const MainPages = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Switch>
          <Route exact path="/">
            <Beranda />
          </Route>
          <Route exact path="/laporan">
            <LaporanPage />
          </Route>
          <Route exact path="/upload">
            <UploadPage />
          </Route>
          <Route exact path="/user">
            <UserPage />
          </Route>
        </Switch>
      </MainLayout>
    </BrowserRouter>
  )
}
