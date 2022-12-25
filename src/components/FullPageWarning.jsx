import React from 'react'
import Card from '@mui/material/Card'

function FullPageWarning({label, displayed, sx}) {
  return displayed ? (
    <Card
      sx={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        mt: 4,
        p: 6,
        ...sx,
      }}
    >
      <p>{label}</p>
    </Card>
  ) : null
}

export default FullPageWarning
