import React, {useEffect} from 'react'

import GlobalTable from '../components/GlobalTable'
import PlainCard from '../components/PlainCard'

const UserPage = () => {
  useEffect(() => {
    document.title = 'Manajemen User'
  }, [])

  return (
    <>
      <PlainCard label="Manajemen User" />
      <div style={{marginTop: 22}}>
        <GlobalTable />
      </div>
    </>
  )
}

export default UserPage
