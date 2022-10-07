import React, {useEffect, useState} from 'react'
import axios from 'axios'

import Button from '@mui/material/Button'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

import GlobalTable from '../components/GlobalTable'
import PlainCard from '../components/PlainCard'
import GlobalAlert from '../components/GlobalAlert'
import FullScreenLoader from '../components/FullScreenLoader'
import {getLocalToken} from '../utils/globalFunction'
import {baseUrl} from '../config/api'
import {indigo} from '../config/color'

const UserPage = () => {
  const [userList, setUserList] = useState([])
  const [pageState, setPageState] = useState({
    loading: false,
    err: false,
    errMsg: '',
    limit: 15,
    offset: 0,
  })
  const {errMsg, err, limit, offset, loading} = pageState
  useEffect(() => {
    document.title = 'Manajemen User'
    setMultiState(setPageState, {loading: true})
    const controller = new AbortController()
    const init = async () => {
      await fetchUser()
    }
    init()
    return () => controller.abort()
  }, [])

  const setMultiState = (setStateName, obj) => {
    setStateName(s => ({
      ...s,
      ...obj,
    }))
  }

  const fetchUser = async (isFetchmore = false) => {
    try {
      const {data} = await axios.post(
        baseUrl + 'user-list',
        {limit, offset},
        {
          headers: {
            authorization: getLocalToken(),
          },
        }
      )
      if (data.status == 1) {
        const {users} = data
        setMultiState(setPageState, {loading: false})
        !isFetchmore ? setUserList(users) : setUserList(s =>  [...s, ...users])
      } else {
        setMultiState(setPageState, {
          loading: false,
          err: true,
          errMsg: 'Gagal saat mengambil data list User',
        })
      }
    } catch (e) {
      setMultiState(setPageState, {
        loading: false,
        err: true,
        errMsg: '[CEA] - Gagal saat mengambil data list User',
      })
    }
  }

  const fetchMore = async dataLength => {
    setMultiState(setPageState, {
      offset: dataLength,
    })
    await fetchUser(true)
  }

  return (
    <>
      {loading && <FullScreenLoader />}
      {/* Error Alert */}
      <GlobalAlert
        label={errMsg}
        onClose={() => setMultiState(setPageState, {err: false})}
        opened={err}
        promptDialog
      />
      <PlainCard label="Manajemen User" />
      <div style={{marginTop: 26}}>
        {!err && !loading && userList.length > 0 ? (
          <>
            <GlobalTable headingList={['No.', 'Nama', 'Username', 'Tipe']}>
              {userList.map((item, i) => (
                <TableRow
                  key={i}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell>{item.user_id}</TableCell>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>{item.tipe}</TableCell>
                </TableRow>
              ))}
            </GlobalTable>
            <div
              style={{display: 'flex', flexDirection: 'column', marginTop: 20}}
            >
              <Button
                sx={{p: 1, backgroundColor: indigo}}
                variant="contained"
                onClick={() => fetchMore(userList.length)}
              >
                Muat lagi
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </>
  )
}

export default UserPage
