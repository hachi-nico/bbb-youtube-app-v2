import React from 'react'
import Button from '@mui/material/Button'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteIcon from '@mui/icons-material/Delete'

export default function ActionButton({updateHandler, deleteHandler}) {
  return (
    <div
      style={{
        marginTop: 20,
        marginLeft: 5,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Button
        color="info"
        startIcon={<BorderColorIcon />}
        variant="outlined"
        size="small"
        onClick={updateHandler}
      >
        Edit
      </Button>
      <Button
        color="error"
        startIcon={<DeleteIcon />}
        variant="outlined"
        size="small"
        sx={{mt: 1}}
        onClick={deleteHandler}
      >
        Hapus
      </Button>
    </div>
  )
}
