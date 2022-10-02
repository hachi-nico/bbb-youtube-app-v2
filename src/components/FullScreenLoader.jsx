import React from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'

function FullScreenLoader() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.5)',
      }}
    >
      <LinearProgress sx={{height: 10}} />
    </Box>
  )
}

export default FullScreenLoader
