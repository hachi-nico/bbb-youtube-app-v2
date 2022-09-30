import React, {useEffect} from 'react'

import PlainCard from '../components/PlainCard'
import GlobalTable from '../components/GlobalTable'

const LaporanPage = () => {
  useEffect(() => {
    document.title = 'Laporan'
  }, [])
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
