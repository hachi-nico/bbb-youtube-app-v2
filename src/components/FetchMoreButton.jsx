import React from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

import {indigo} from '../config/color'

function FetchMoreButton({label, onClick, moreData, noMoreDataLabel}) {
  return noMoreDataLabel ? (
    <p style={{textAlign: 'center'}}>Sudah tidak ada Data</p>
  ) : (
    <Button
      sx={{p: 1, backgroundColor: indigo}}
      variant="contained"
      onClick={onClick}
    >
      {moreData ? <CircularProgress size={25} sx={{color: '#fff'}} /> : label}
    </Button>
  )
}

export default FetchMoreButton
