import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'

import Button from '@mui/material/Button'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

import GlobalTable from '../components/GlobalTable'
import PlainCard from '../components/PlainCard'
import GlobalAlert from '../components/GlobalAlert'
import FullScreenLoader from '../components/FullScreenLoader'
import FetchMoreButton from '../components/FetchMoreButton'
import {getLocalToken, isSessionExp} from '../utils/globalFunction'
import {baseUrl} from '../config/api'

const UserPage = () => {
  const [userList, setUserList] = useState([])
  const [pageState, setPageState] = useState({
    loading: false,
    err: false,
    errMsg: '',
    offset: 0,
    moreData: false,
    noMoreDataLabel: false,
  })
  const history = useHistory()
  const {errMsg, err, loading, offset, moreData, noMoreDataLabel} = pageState

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

  const fetchUser = async () => {
    try {
      const {data} = await axios.post(
        baseUrl + 'user-list',
        {limit: 15, offset},
        {
          headers: {
            authorization: getLocalToken(),
          },
        }
      )
      if (data.status == 1) {
        const {users} = data
        setMultiState(setPageState, {
          loading: false,
          offset: userList.length + users.length,
        })
        if (users.length <= 0)
          setMultiState(setPageState, {noMoreDataLabel: true})
        setUserList([...userList, ...users])
      } else {
        isSessionExp(data.status, history)
        setMultiState(setPageState, {
          loading: false,
          err: true,
          errMsg: data.message ?? 'Gagal saat mengambil data list User',
        })
      }
    } catch (e) {
      isSessionExp(e.response.data.status, history)
      setMultiState(setPageState, {
        loading: false,
        err: true,
        errMsg: `[CEA] ${
          e.response.data.message ?? 'Gagal saat mengambil data list User'
        } `,
      })
    }
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
                  <TableCell>{i}</TableCell>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>{item.tipe}</TableCell>
                </TableRow>
              ))}
            </GlobalTable>
            <div
              style={{display: 'flex', flexDirection: 'column', marginTop: 20}}
            >
              <FetchMoreButton
                label="Muat Lebih Banyak"
                onClick={async () => {
                  setMultiState(setPageState, {moreData: true})
                  await fetchUser()
                  setMultiState(setPageState, {moreData: false})
                }}
                moreData={moreData}
                noMoreDataLabel={noMoreDataLabel}
              />
            </div>
          </>
        ) : null}
      </div>
    </>
  )
}

export default UserPage
