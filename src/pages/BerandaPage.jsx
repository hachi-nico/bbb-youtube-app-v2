import React, {useEffect} from 'react'

import PlainCard from '../components/PlainCard'
import CardContainer from '../components/CardContainer'
import DataTable from '../components/DataTable'
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
        <DataTable />
      </div>
    </>
  )
}

export default Beranda
