import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'

import {floatingStyle} from '../config/globalStyles'

function FullScreenLoader({caption}) {
  return (
    <div
      style={{
        ...floatingStyle,
        zIndex: 100000,
        backgroundColor: 'rgba(255,255,255,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
      }}
    >
      <CircularProgress thickness={5} size={60} />
      {caption ? <p style={{marginLeft: 20}}>{caption}</p> : null}
    </div>
  )
}

export default FullScreenLoader
