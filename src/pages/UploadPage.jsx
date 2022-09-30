import React, {useEffect} from 'react'

import PlainCard from '../components/PlainCard'

const UploadPage = () => {
  useEffect(() => {
    document.title = 'Form Upload Manual'
  }, [])

  return (
    <>
      <PlainCard label="Form Upload Manual" />
    </>
  )
}

export default UploadPage
