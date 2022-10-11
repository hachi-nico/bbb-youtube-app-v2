import React from 'react'

import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'

function ModalCreateUser({
  closeHandler = () => {},
  submitHandler = () => {},
  open = false,
  children,
}) {
  return (
    <Dialog
      open={open}
      fullWidth
      onClose={closeHandler}
      sx={{m: {md: 12, xs: 4}}}
    >
      <DialogTitle sx={{textAlign: 'center'}}>Tambah Data Baru</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <div style={{display: 'flex'}}>
          <Button variant="contained" onClick={closeHandler} sx={{mr: 2}}>
            Cancel
          </Button>
          <Button variant="contained" onClick={submitHandler}>
            Simpan
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default ModalCreateUser
