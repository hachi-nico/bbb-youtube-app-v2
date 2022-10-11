import React from 'react'

import RefreshIcon from '@mui/icons-material/Refresh'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'
import Button from '@mui/material/Button'

import {green, indigo} from '../config/color'

function MainFloatingButton({refreshPage, scrollToTop}) {
  return (
    <div style={{position: 'fixed', bottom: 14, right: 14, zIndex: 100}}>
      <Button
        variant="contained"
        style={{padding: 10, marginRight: 10, backgroundColor: indigo}}
        onClick={refreshPage}
      >
        <RefreshIcon />
      </Button>
      <Button
        variant="contained"
        style={{padding: 10, backgroundColor: green}}
        onClick={scrollToTop}
      >
        <KeyboardDoubleArrowUpIcon />
      </Button>
    </div>
  )
}

export default MainFloatingButton
