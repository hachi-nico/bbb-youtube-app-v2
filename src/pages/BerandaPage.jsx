import React, {useEffect} from 'react'

import PlainCard from '../components/PlainCard'
import CardContainer from '../components/CardContainer'
import GlobalTable from '../components/GlobalTable'

const Beranda = () => {
  return (
    <div>
      <PlainCard label="Antrian Upload" />
      <div style={{marginTop: 22}}>
        <GlobalTable />
      </div>
    </div>
  )
}

export default Beranda
