import React from 'react'
import Alert from '@mui/material/Alert'
import Fade from '@mui/material/Fade'

function GlobalAlert({
  label = '',
  type = 'success',
  additionalStyles = {position: 'absolute', mx: 12, left: 0, right: 0, top: 65},
  onClose = () => {},
  opened = false,
}) {
  return (
    <Fade in={opened}>
      <Alert severity={type} sx={{...additionalStyles}} onClose={onClose}>
        {label}
      </Alert>
    </Fade>
  )
}

export default GlobalAlert
