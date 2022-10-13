import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/id'

import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import GlobalTable from '../components/GlobalTable'
import PlainCard from '../components/PlainCard'
import GlobalAlert from '../components/GlobalAlert'
import FullScreenLoader from '../components/FullScreenLoader'
import FetchMoreButton from '../components/FetchMoreButton'
import MainFloatingButton from '../components/MainFloatingButton'
import ModalCreateUser from '../components/UserPage/ModalCreateUser'
import {getLocalToken, isSessionExp, scrollToTop} from '../utils/globalFunction'
import {baseUrl} from '../config/api'
import {green} from '../config/color'
import {mainDateTimeFormat} from '../config/globalvar'

const UserPage = () => {
  dayjs.locale('id')
  const [userList, setUserList] = useState([])
  const [pageState, setPageState] = useState({
    loading: false,
    err: false,
    errMsg: '',
    offset: 0,
    moreData: false,
    noMoreDataLabel: false,
    modifyUserModalVisible: false,
    tglSort: false,
  })
  const [form, setForm] = useState({
    username: '',
    usernameErr: false,
    nama: '',
    role: '',
    password: '',
    passwordErr: false,
    passwordRepeat: '',
    passwordRepeatErr: false,
  })
  const history = useHistory()
  const {
    errMsg,
    err,
    loading,
    offset,
    moreData,
    noMoreDataLabel,
    modifyUserModalVisible,
    tglSort,
  } = pageState
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
  const isFirstRender = useRef(true)

  useEffect(() => {
    const controller = new AbortController()
    if (isFirstRender.current) {
      isFirstRender.current = false // toggle flag after first render/mounting

      document.title = 'Manajemen User'
      setMultiState(setPageState, {loading: true})
      const init = async () => {
        await fetchUser()
      }
      init()
    }

    const listenSorting = async () => {
      resetPageState()
      setUserList([])
      await fetchUser(true, {tglSort: tglSort ? 'ASC' : 'DESC'})
    }
    listenSorting()

    return () => controller.abort()
  }, [tglSort])

  const setMultiState = (setStateName, obj) => {
    setStateName(s => ({
      ...s,
      ...obj,
    }))
  }

  const fetchUser = async (isRefresh = false, additionalParams = {}) => {
    try {
      const {data} = await axios.post(
        baseUrl + 'user-list',
        {
          limit: 15,
          offset: isRefresh ? 0 : offset,
          ...additionalParams,
        },
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
          offset: isRefresh ? 0 : userList.length + users.length,
        })

        if (users.length <= 0 && !isRefresh)
          setMultiState(setPageState, {noMoreDataLabel: true})

        isRefresh ? setUserList(users) : setUserList([...userList, ...users])
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

  const resetForm = () => {
    setMultiState(setForm, {
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

  const resetPageState = () => {
    setMultiState(setPageState, {
      loading: true,
      err: false,
      errMsg: '',
      offset: 0,
      moreData: false,
      noMoreDataLabel: false,
    })
  }

  const formInputHandler = (key, event) => {
    if (username) setMultiState(setPageState, {usernameErr: false})

    setMultiState(setForm, {[key]: event.target.value})
  }

  return (
    <>
      <MainFloatingButton
        scrollToTop={scrollToTop}
        refreshPage={async () => {
          resetPageState()
          setUserList([])
          await fetchUser(true)
        }}
      />
      {loading && <FullScreenLoader />}

      {/* Error Alert */}
      <GlobalAlert
        label={errMsg}
        onClose={() => setMultiState(setPageState, {err: false})}
        opened={err}
        promptDialog
      />

      <PlainCard label="Manajemen User" />
      <div style={{marginTop: 26, marginBottom: 20}}>
        <Button
          variant="contained"
          sx={{backgroundColor: green, mb: 2}}
          onClick={() =>
            setMultiState(setPageState, {modifyUserModalVisible: true})
          }
        >
          Tambah User
        </Button>
        {!err && !loading && userList.length > 0 ? (
          <>
            <GlobalTable
              headingList={[
                {label: 'No.'},
                {label: 'Nama'},
                {label: 'Username'},
                {label: 'Tipe'},
                {
                  label: 'Tanggal Dibuat',
                  sort: true,
                  sortType: tglSort,
                  handler: () =>
                    setPageState(s => ({...s, tglSort: !s.tglSort})),
                },
              ]}
            >
              {userList.map((item, i) => (
                <TableRow
                  key={i}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>{item.tipe}</TableCell>
                  <TableCell>
                    {`${
                      item.tgl
                        ? dayjs(item.tgl).format(mainDateTimeFormat)
                        : '-'
                    }`}
                  </TableCell>
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

      {/* Section tambah edit user */}
      {modifyUserModalVisible && (
        <ModalCreateUser
          open={modifyUserModalVisible}
          closeHandler={() =>
            setMultiState(setPageState, {modifyUserModalVisible: false})
          }
        >
          <TextField
            error={usernameErr}
            value={username}
            sx={s.textField}
            label="Username"
            variant="standard"
            onChange={val => formInputHandler('username', val)}
            fullWidth
          />
          <TextField
            value={nama}
            sx={s.textField}
            label="Nama"
            variant="standard"
            onChange={val => formInputHandler('nama', val)}
            fullWidth
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
        </ModalCreateUser>
      )}
    </>
  )
}

const s = {
  textField: {
    my: 2,
  },
}

export default UserPage
