import React, {useEffect} from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import {indigo} from '../config/color'
import CardContainer from '../components/CardContainer'

function LoginPage() {
  useEffect(() => {
    document.body.style.backgroundColor = indigo

    return () => (document.body.style.backgroundColor = 'whitesmoke')
  }, [])

  return (
    <div style={{}}>
      <CardContainer
        style={{
          width: {xs: 325, md: 500},
          height: 300,
          position: 'relative',
          mx: 'auto',
          mt: 20,
        }}
      >
        <p style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center'}}>
          Login
        </p>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <TextField sx={s.textField} label="Username" variant="standard" />
          <TextField sx={s.textField} label="Password" variant="standard" />
          <Button sx={s.textField} variant="contained">
            Login
          </Button>
        </div>
      </CardContainer>
    </div>
  )
}

const s = {
  textField: {
    mx: 2,
    my: 2,
  },
}

export default LoginPage
