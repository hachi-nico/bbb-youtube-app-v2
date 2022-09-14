import React from 'react'
import Card from '@mui/material/Card'

const CardContainer = ({children}) => {
  return <Card sx={{p: 2}}>{children}</Card>
}

export default CardContainer
