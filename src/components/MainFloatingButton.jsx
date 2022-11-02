import React from 'react'

import RefreshIcon from '@mui/icons-material/Refresh'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'
import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

import {green, indigo} from '../config/color'

function MainFloatingButton({addData, refreshPage, scrollToTop}) {
  return (
    <Box
      sx={{position: 'fixed', bottom: {md: 14, xs: 60}, right: 14, zIndex: 100}}
    >
      <Button
        variant="contained"
        sx={{backgroundColor: green, padding: 1.4, marginRight: 2}}
        onClick={addData}
      >
        <AddIcon />
      </Button>
      <Button
        variant="contained"
        sx={{padding: 1.4, marginRight: 2, backgroundColor: indigo}}
        onClick={refreshPage}
      >
        <RefreshIcon />
      </Button>
      <Button
        variant="contained"
        sx={{padding: 1.4, backgroundColor: indigo}}
        onClick={scrollToTop}
      >
        <KeyboardDoubleArrowUpIcon />
      </Button>
    </Box>
  )
}

export default MainFloatingButton
