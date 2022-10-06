import React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'

function GlobalAlert({
  label = '',
  onClose = () => {},
  onConfirm = () => {},
  opened = false,
  promptDialog = false,
  confirmDialog = false,
}) {
  return (
    <Dialog
      open={opened}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Peringatan</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {label}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {promptDialog && <Button onClick={onClose}>Ok</Button>}
        {confirmDialog && (
          <>
            <Button onClick={onConfirm}>Ya</Button>
            <Button onClick={onClose}>Tidak</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default GlobalAlert
