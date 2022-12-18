import React, {useState, useEffect} from 'react'

import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'

import SelectInput from '../SelectInput'

function ModalCreateUser({
  closeHandler = () => {},
  open = false,
  getFormData = () => {},
  previousData,
}) {
  const [form, setForm] = useState({
    username: '',
    usernameErr: false,
    usernameErrLabel: '',
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
    usernameErrLabel,
    nama,
    role,
    password,
    passwordErr,
    passwordRepeat,
    passwordRepeatErr,
  } = form

  useEffect(() => {
    if (previousData?.user_id)
      setForm(s => ({...s, ...previousData, role: previousData.tipe}))
  }, [])

  const formInputHandler = (key, event) => {
    if (username)
      setForm(s => ({...s, usernameErr: false, usernameErrLabel: ''}))
    if (password) setForm(s => ({...s, passwordErr: false}))
    if (password == passwordRepeat)
      setForm(s => ({...s, passwordRepeatErr: false}))
    setForm(s => ({...s, [key]: event.target.value}))
  }

  const submitHandler = () => {
    if (!username) {
      setForm(s => ({...s, usernameErr: true}))
      return false
    }

    if (!password) {
      setForm(s => ({...s, passwordErr: true}))
      return false
    }

    if (password != passwordRepeat) {
      setForm(s => ({...s, passwordRepeatErr: true}))
      return false
    }

    const regExp = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/
    if (regExp.test(username)) {
      setForm(s => ({
        ...s,
        usernameErr: true,
        usernameErrLabel: 'Username tidak boleh berisi karakter spesial',
      }))
      return false
    }

    return getFormData({
      username,
      password,
      nama,
      tipe: role,
      userId: previousData?.user_id ?? '',
    })
  }

  return (
    <Dialog fullScreen open={open} onClose={closeHandler}>
      <DialogTitle sx={{textAlign: 'center'}}>Tambah Data Baru</DialogTitle>
      <DialogContent sx={{pb: 1}}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: {md: 'row', xs: 'column'},
            pt: 2,
          }}
        >
          <TextField
            error={usernameErr}
            value={username}
            helperText={usernameErrLabel}
            label="Username"
            variant="standard"
            onChange={val => formInputHandler('username', val)}
            fullWidth
            inputProps={{
              autoComplete: 'new-password',
            }}
            sx={{pr: 1}}
          />
          <SelectInput
            label="Role"
            value={role}
            addtionalSx={{pt: {xs: 4, md: 1}}}
            labelSx={{pt: {xs: 5, md: 1}}}
            selectHandler={e => formInputHandler('role', e)}
            items={[
              {label: 'Dosen', value: 2},
              {label: 'Mahasiswa', value: 3},
            ]}
          />
        </Box>
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
        {previousData?.user_id ? null : (
          <>
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
              helperText={passwordRepeatErr ? 'Password tidak cocok' : ''}
              onChange={val => formInputHandler('passwordRepeat', val)}
              fullWidth
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <div style={{display: 'flex'}}>
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
