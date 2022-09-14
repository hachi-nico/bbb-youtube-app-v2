import React from 'react'
import Card from '@mui/material/Card'

const PlainCard = ({label = 'plain card'}) => {
  return (
    <Card sx={{p: 2}}>
      <p style={{fontSize: 20, fontWeight: 'bold'}}>{label}</p>
    </Card>
  )
}

export default PlainCard
