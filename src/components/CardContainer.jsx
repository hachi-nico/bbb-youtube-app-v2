import React from 'react'
import Card from '@mui/material/Card'

const CardContainer = ({children, style = {}}) => {
  return (
    <Card sx={{p: 2}} style={style}>
      {children}
    </Card>
  )
}

export default CardContainer
