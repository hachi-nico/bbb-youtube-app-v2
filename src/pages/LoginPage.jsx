import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import {indigo} from '../config/color'
import {baseUrl} from '../config/api'
import CardContainer from '../components/CardContainer'
import FullScreenLoader from '../components/FullScreenLoader'
import GlobalAlert from '../components/GlobalAlert'

function LoginPage() {
  const [pageState, setPageState] = useState({
    loading: false,
    successLabel: '',
    errLabel: '',
  })
  const [form, setForm] = useState({
    usernameErr: false,
    usernameVal: '',
    passwordErr: false,
    passwordVal: '',
  })
  const history = useHistory()

  useEffect(() => {
    document.body.style.backgroundColor = indigo
    document.title = 'Login'

    return () => (document.body.style.backgroundColor = 'whitesmoke')
  }, [])

  const loginHandler = async (username, password) => {
    pageStateHandler({errLabel: '', successLabel: ''}, 'pageState')
    if (!username) {
      return pageStateHandler({usernameErr: true}, 'form')
    }
    if (!password) {
      return pageStateHandler({passwordErr: true}, 'form')
    }

    try {
      pageStateHandler({loading: true}, 'pageState')
      const {data} = await axios.post(baseUrl + 'login', {
        username,
        password,
      })

      if (data.status == 1) {
        pageStateHandler(
          {loading: false, errLabel: '', successLabel: 'data.message'},
          'pageState'
        )
        localStorage.setItem('token', JSON.stringify(data.token))
        history.push('/antrian')
      } else {
        pageStateHandler(
          {loading: false, errLabel: 'Gagal saat Login'},
          'pageState'
        )
      }
      pageStateHandler({loading: false}, 'pageState')
    } catch (e) {
      pageStateHandler(
        {
          loading: false,
          errLabel: e.response.data.message ?? 'Gagal saat Login',
        },
        'pageState'
      )
    }
  }

  const pageStateHandler = (obj = {}, type = '') => {
    if (type == 'pageState') {
      setPageState(s => ({
        ...s,
        ...obj,
      }))
    } else if (type == 'form') {
      setForm(s => ({
        ...s,
        ...obj,
      }))
    }
  }

  const formInputHandler = (key, event) => {
    if (form.usernameVal) pageStateHandler({usernameErr: false}, 'form')
    if (form.passwordVal) pageStateHandler({passwordErr: false}, 'form')

    pageStateHandler({[key]: event.target.value}, 'form')
  }

  const {errLabel, successLabel, loading} = pageState

  return (
    <>
      <GlobalAlert
        label={errLabel}
        type="warning"
        onClose={() => pageStateHandler({errLabel: ''}, 'pageState')}
        opened={!!errLabel}
      />
      <GlobalAlert
        label={successLabel}
        type="success"
        opened={!!successLabel}
        onClose={() => pageStateHandler({successLabel: ''}, 'pageState')}
      />
      {loading && <FullScreenLoader />}
      <CardContainer
        style={{
          width: {xs: 325, md: 500},
          height: 300,
          position: 'relative',
          mx: 'auto',
          mt: 20,
        }}
      >
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <TextField
            error={form.usernameErr}
            value={form.usernameVal}
            sx={s.textField}
            label="Username"
            variant="standard"
            onChange={val => formInputHandler('usernameVal', val)}
          />
          <TextField
            error={form.passwordErr}
            value={form.passwordVal}
            sx={s.textField}
            label="Password"
            variant="standard"
            onChange={val => formInputHandler('passwordVal', val)}
          />
          <Button
            sx={s.textField}
            variant="contained"
            onClick={() => loginHandler(form.usernameVal, form.passwordVal)}
          >
            Login
          </Button>
        </div>
      </CardContainer>
    </>
  )
}

const s = {
  textField: {
    mx: 2,
    my: 2,
  },
}

export default LoginPage
