import React, {useEffect} from 'react'

import PlainCard from '../components/PlainCard'

const UserPage = () => {
  useEffect(() => {
    document.title = 'Manajemen User'
  }, [])

  return (
    <>
      <PlainCard label="Manajemen User" />
    </>
  )
}

export default UserPage
