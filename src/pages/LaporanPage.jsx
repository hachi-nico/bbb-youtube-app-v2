import React from 'react'

import PlainCard from '../components/PlainCard'
import GlobalTable from '../components/GlobalTable'

const LaporanPage = () => {
  return (
    <>
      <PlainCard label="Laporan Upload" />
      <div style={{marginTop: 22}}>
        <GlobalTable />
      </div>
    </>
  )
}

export default LaporanPage
