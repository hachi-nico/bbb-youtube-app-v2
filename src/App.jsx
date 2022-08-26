import React from 'react'
import {BrowserRouter, Switch, Route, Link} from 'react-router-dom'

import MainLayout from './layouts/MainLayout'
import Beranda from './pages/Beranda'

export default function App() {
  return (
    <RouterWrapper>
      <MainLayout />
    </RouterWrapper>
  )
}

const RouterWrapper = ({children}) => {
  return (
    <BrowserRouter>
      {children}
      <Switch>
        <Route exact path="/">
          <Beranda />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
