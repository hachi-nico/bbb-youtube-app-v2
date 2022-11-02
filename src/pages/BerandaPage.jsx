import React, {useEffect} from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'

import PlainCard from '../components/PlainCard'
import InnerLayout from '../layouts/InnerLayout'
import FullScreenLoader from '../components/FullScreenLoader'

const Beranda = () => {
  useEffect(() => {
    document.title = 'Antrian Upload'
  }, [])

  const data = [
    {
      id: '9681d5c841a7b6dfec881616a15b203d2937d796-1667381516323',
      moderator: 'Nico Akbar',
      status: 2,
    },
    {
      id: '9681d5c841a7b6dfec881616a15b203d2937d796-1667381516323',
      moderator: 'Nico Akbar',
      status: 4,
    },
    {
      id: '9681d5c841a7b6dfec881616a15b203d2937d796-1667381516323',
      moderator: 'Nico Akbar',
      status: 4,
    },
    {
      id: '9681d5c841a7b6dfec881616a15b203d2937d796-1667381516323',
      moderator: 'Nico Akbar',
      status: 4,
    },
    {
      id: '9681d5c841a7b6dfec881616a15b203d2937d796-1667381516323',
      moderator: 'Nico Akbar',
      status: 4,
    },
    {
      id: '9681d5c841a7b6dfec881616a15b203d2937d796-1667381516323',
      moderator: 'Nico Akbar',
      status: 4,
    },
    {
      id: '9681d5c841a7b6dfec881616a15b203d2937d796-1667381516323',
      moderator: 'Nico Akbar',
      status: 4,
    },
    {
      id: '9681d5c841a7b6dfec881616a15b203d2937d796-1667381516323',
      moderator: 'Nico Akbar',
      status: 4,
    },
    {
      id: '9681d5c841a7b6dfec881616a15b203d2937d796-1667381516323',
      moderator: 'Nico Akbar',
      status: 4,
    },
    {
      id: '9681d5c841a7b6dfec881616a15b203d2937d796-1667381516323',
      moderator: 'Nico Akbar',
      status: 4,
    },
  ]
  return (
    <>
      <PlainCard label="Antrian Upload Recording BigBlueButton" />
      <InnerLayout>
        <Card sx={{p: 2}}>
          <Typography>{`Total Antrian: ${data.length}`}</Typography>
        </Card>
        {data.map((item, i) => (
          <Card sx={{my: 2}} key={i}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Typography sx={{fontWeight: 'bold'}}>
                  Rabu, 12/Oktober/2022 10:10
                </Typography>
                <Typography sx={{opacity: '0.8'}}>
                  {item.status == 2
                    ? 'proses upload ke youtube'
                    : 'dalam antrian'}
                </Typography>
              </Box>
              <Typography>{`Internal Meeting ID ${item.id}`}</Typography>
              <Typography>{`Moderator ${item.moderator}`}</Typography>
              <LinearProgress sx={{mt: 3}} variant="determinate" value={20} />
            </CardContent>
          </Card>
        ))}
      </InnerLayout>
    </>
  )
}

export default Beranda
