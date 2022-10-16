import React from 'react'

function FullPageWarning({label}) {
  return (
    <div style={{position: 'relative', top: 0, bottom: 0, left: 0, right: 0}}>
      <p>{label}</p>
    </div>
  )
}

export default FullPageWarning
