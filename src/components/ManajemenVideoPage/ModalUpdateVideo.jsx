import React, {useState, useEffect} from 'react'

import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'

function ModalCreateUser({
  closeHandler = () => {},
  open = false,
  getFormData = () => {},
  previousData,
}) {
  const [form, setForm] = useState({
    judul: '',
    judulErr: false,
    judulErrLabel: '',
    deskripsi: '',
  })

  const {judul, judulErr, judulErrLabel, deskripsi} = form
  useEffect(() => {
    setForm(s => ({
      ...s,
      judul: previousData.judul,
      deskripsi: previousData.deskripsi,
    }))
  }, [])

  const formInputHandler = (key, event) => {
    if (judul) setForm(s => ({...s, judulErr: false, judulErrLabel: ''}))
    setForm(s => ({...s, [key]: event.target.value}))
  }

  const submitHandler = () => {
    if (!judul) {
      setForm(s => ({...s, judulErr: true}))
      return false
    }

    return getFormData({
      id: previousData.id,
      judul,
      deskripsi,
    })
  }

  return (
    <Dialog fullScreen open={open} onClose={closeHandler}>
      <DialogTitle sx={{textAlign: 'center'}}>Update Video</DialogTitle>
      <DialogContent sx={{pb: 1}}>
        <TextField
          error={judulErr}
          value={judul}
          helperText={judulErrLabel}
          label="Judul"
          variant="standard"
          onChange={val => formInputHandler('judul', val)}
          fullWidth
          inputProps={{
            autoComplete: 'new-password',
          }}
          sx={{pr: 1}}
        />
        <TextField
          value={deskripsi}
          sx={s.textField}
          label="Deskripsi"
          variant="standard"
          onChange={val => formInputHandler('deskripsi', val)}
          fullWidth
          inputProps={{
            autoComplete: 'new-password',
          }}
        />
      </DialogContent>
      <DialogActions>
        <div style={{display: 'flex', marginBottom: 10}}>
          <Button variant="contained" onClick={closeHandler} sx={{mr: 2}}>
            Batal
          </Button>
          <Button variant="contained" onClick={submitHandler}>
            Simpan
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}

const s = {textField: {my: 2}}

export default ModalCreateUser
