import React from 'react'
import Card from '@mui/material/Card'

const CardContainer = ({children, sx = {}}) => {
  return <Card sx={{p: 2, ...sx}}>{children}</Card>
}

export default CardContainer
