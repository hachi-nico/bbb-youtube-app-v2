import React, {useEffect} from 'react'

import PlainCard from '../components/PlainCard'
import DataTable from '../components/DataTable'

const LaporanPage = () => {
  useEffect(() => {
    document.title = 'Laporan'
  }, [])
  return (
    <>
      <PlainCard label="Laporan Upload" />
      <div style={{marginTop: 22}}>
        <DataTable />
      </div>
    </>
  )
}

export default LaporanPage
