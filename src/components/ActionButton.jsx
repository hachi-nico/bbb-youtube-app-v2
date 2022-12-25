import React from 'react'
import Button from '@mui/material/Button'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'

export default function ActionButton({updateHandler = '', deleteHandler = ''}) {
  return (
    <Box sx={{m: 2}}>
      {updateHandler ? (
        <Button
          color="info"
          startIcon={<BorderColorIcon />}
          variant="outlined"
          size="small"
          onClick={updateHandler}
          sx={{mr: 2}}
        >
          Edit
        </Button>
      ) : null}
      {deleteHandler ? (
        <Button
          color="error"
          startIcon={<DeleteIcon />}
          variant="outlined"
          size="small"
          onClick={deleteHandler}
        >
          Hapus
        </Button>
      ) : null}
    </Box>
  )
}
