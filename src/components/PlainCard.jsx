import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

const PlainCard = ({label = 'plain card'}) => {
  return (
    <Card>
      <CardContent>
        <p>{label}</p>
      </CardContent>
    </Card>
  )
}

export default PlainCard
