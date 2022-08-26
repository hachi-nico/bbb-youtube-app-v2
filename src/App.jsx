import React from 'react'
import {BrowserRouter, Switch, Route, Link} from 'react-router-dom'

import MainLayout from './layouts/MainLayout'
import Beranda from './pages/Beranda'

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
        </Switch>
      </MainLayout>
    </BrowserRouter>
  )
}
