import React, {useEffect} from 'react'

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
          width: 500,
          height: 300,
          position: 'relative',
          mx: 'auto',
          mt: 20,
        }}
      >
        <p style={{fontSize: 20, fontWeight: 'bold'}}>Login Page</p>
      </CardContainer>
    </div>
  )
}

export default LoginPage
