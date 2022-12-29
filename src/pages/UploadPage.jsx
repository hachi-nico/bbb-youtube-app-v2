import axios from 'axios'
import React, {useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import PlainCard from '../components/PlainCard'
import {baseUrl} from '../config/api'
import InnerLayout from '../layouts/InnerLayout'
import CardContainer from '../components/CardContainer'
import {getLocalToken, isSessionExp} from '../utils/globalFunction'
import Alert from '../components/Alert'
import FullScreenLoader from '../components/FullScreenLoader'
import FullPageWarning from '../components/FullPageWarning'

const UploadPage = () => {
  const history = useHistory()
  const firstRender = useRef(true)
  const [judul, setJudul] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [file, setFile] = useState('')

  const [fileLabel, setFileLabel] = useState('')
  const [loading, setLoading] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      document.title = 'Form Upload Manual'
    }

    const init = async () => {
      try {
        const {data} = await axios.post(
          baseUrl + 'verify-upload-page',
          {},
          {
            headers: {
              authorization: getLocalToken(),
            },
          }
        )

        if (data.status != 1) {
          localStorage.removeItem('token')
          history.push('/login')
        }
      } catch (e) {
        isSessionExp(e?.response?.data?.status, history)
      }
    }
    init()
  }, [])

  const handleSubmit = async () => {
    if (file) {
      try {
        setLoading(true)
        const params = new FormData()
        params.append('file', file)
        params.append('manualTitle', judul)
        params.append('manualDescription', deskripsi)

        await axios.post(baseUrl + 'local-upload', params, {
          headers: {
            authorization: getLocalToken(),
            'content-type': 'multipart/form-data',
          },
        })
      } catch (e) {
        setAlertOpen(true)
      } finally {
        setLoading(false)
      }
    }
  }

  if (loading)
    return (
      <FullScreenLoader caption="Sedang melakukan upload file, mohon untuk tidak meninggalkan halaman ini" />
    )

  return (
    <>
      <FullPageWarning
        sx={{display: {lg: 'none', md: 'block', sm: 'block', xs: 'block'}}}
        displayed={true}
        label="Halaman ini hanya tersedia di mode desktop"
      />
      <Box sx={{display: {lg: 'block', md: 'none', sm: 'none', xs: 'none'}}}>
        <PlainCard label="Form Upload Manual" />
        <InnerLayout>
          <CardContainer>
            <TextField
              value={judul}
              label="Judul"
              variant="outlined"
              onChange={e => setJudul(e.target.value)}
              fullWidth
              inputProps={{
                autoComplete: 'new-password',
              }}
              sx={{mb: 2}}
            />
            <TextField
              value={deskripsi}
              label="Deskripsi"
              variant="outlined"
              onChange={e => setDeskripsi(e.target.value)}
              fullWidth
              inputProps={{
                autoComplete: 'new-password',
              }}
              sx={{mb: 2}}
            />

            <Box
              sx={{
                mb: 2,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Button variant="outlined" component="label">
                Pilih File
                <input
                  hidden
                  multiple
                  type="file"
                  onChange={e => {
                    setFileLabel(
                      e.target.value.substring(12, e.target.value.length)
                    )
                    setFile(e.target.files[0])
                  }}
                />
              </Button>
              <Typography sx={{ml: 2}}>{fileLabel ?? '-'}</Typography>
            </Box>

            <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <Button variant="contained" onClick={handleSubmit}>
                Simpan
              </Button>
            </Box>
          </CardContainer>
        </InnerLayout>

        <Alert
          label="Terjadi kesalahan saat upload file, Silakan coba kembali !!!"
          opened={alertOpen}
          onClose={() => setAlertOpen(false)}
          promptDialog
        />
      </Box>
    </>
  )
}

export default UploadPage
