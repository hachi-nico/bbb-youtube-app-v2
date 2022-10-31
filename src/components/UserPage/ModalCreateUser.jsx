import React, {useState} from 'react'

import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'

function ModalCreateUser({
  closeHandler = () => {},
  submitHandler = () => {},
  open = false,
}) {
  const [form, setForm] = useState({
    username: '',
    usernameErr: false,
    nama: '',
    role: 2,
    password: '',
    passwordErr: false,
    passwordRepeat: '',
    passwordRepeatErr: false,
  })

  const {
    username,
    usernameErr,
    nama,
    role,
    password,
    passwordErr,
    passwordRepeat,
    passwordRepeatErr,
  } = form

  const formInputHandler = (key, event) => {
    if (username) setMultiState(setPageState, {usernameErr: false})
    setForm(s => ({...s, [key]: event.target.value}))
  }

  const resetForm = () => {
    setForm({
      username: '',
      usernameErr: '',
      nama: '',
      role: '',
      password: '',
      passwordErr: '',
      passwordRepeat: '',
      passwordRepeatErr: '',
    })
  }

  return (
    <Dialog
      open={open}
      fullWidth
      onClose={closeHandler}
      sx={{m: {md: 12, xs: 4}}}
    >
      <DialogTitle sx={{textAlign: 'center'}}>Tambah Data Baru</DialogTitle>
      <DialogContent>
        <TextField
          error={usernameErr}
          value={username}
          sx={s.textField}
          label="Username"
          variant="standard"
          onChange={val => formInputHandler('username', val)}
          fullWidth
          inputProps={{
            autoComplete: 'new-password',
          }}
        />
        <TextField
          value={nama}
          sx={s.textField}
          label="Nama"
          variant="standard"
          onChange={val => formInputHandler('nama', val)}
          fullWidth
          inputProps={{
            autoComplete: 'new-password',
          }}
        />
        <TextField
          error={passwordErr}
          value={password}
          sx={s.textField}
          label="Password"
          variant="standard"
          type="password"
          onChange={val => formInputHandler('password', val)}
          fullWidth
          inputProps={{
            autoComplete: 'new-password',
          }}
        />
        <TextField
          error={passwordRepeatErr}
          value={passwordRepeat}
          sx={s.textField}
          label="Ulangi Password"
          variant="standard"
          type="password"
          onChange={val => formInputHandler('passwordRepeat', val)}
          fullWidth
        />
      </DialogContent>
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

const s = {textField: {my: 2}}

export default ModalCreateUser
