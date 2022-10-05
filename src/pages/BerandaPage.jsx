import React, {useEffect} from 'react'

import PlainCard from '../components/PlainCard'
import CardContainer from '../components/CardContainer'
import GlobalTable from '../components/GlobalTable'
import FullScreenLoader from '../components/FullScreenLoader'
import Button from '@mui/material/Button'

const Beranda = () => {
  useEffect(() => {
    document.title = 'Antrian Upload'
  }, [])

  return (
    <>
      {/* <FullScreenLoader /> */}
      <PlainCard label="Antrian Upload" />
      <div style={{marginTop: 22}}>
        <GlobalTable />
      </div>
    </>
  )
}

export default Beranda
