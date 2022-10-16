import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import useSWR from 'swr'

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
  const [pageState, setPageState] = useState({
    noMoreDataLabel: false,
    modifyUserModalVisible: false,
    fetchMoreLoad: false,

    tglSort: false,
    search: '',
  })
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
  const {
    noMoreDataLabel,
    modifyUserModalVisible,
    tglSort,
    fetchMoreLoad,
    search,
  } = pageState

  const history = useHistory()
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      document.title = 'Manajemen User'
      mutateUser()
    }
  }, [])

  const fetchUsers = async args => {
    const {data} = await axios.post(baseUrl + args.url, args.args, {
      headers: {
        authorization: getLocalToken(),
      },
    })
    isSessionExp(data.status, history)
    if (data.status != 1) {
      const e = new Error()
      throw e
    }

    return data
  }

  const fethMoreUsers = async () => {
    await mutateUser(
      async prevData => {
        const nextData = await fetchUsers({
          url: 'user-list',
          args: {
            limit: 15,
            offset: data?.users.length,
            tglSort: tglSort ? 'ASC' : 'DESC',
            search,
          },
        })
        console.log(nextData, 'next')
        console.log(prevData, 'prev')
        if (nextData.users.length <= 0)
          setMultiState(setPageState, {noMoreDataLabel: true})

        return {
          status: nextData.status,
          message: nextData.message,
          users: [...prevData.users, ...nextData.users],
        }
      },
      {revalidate: false}
    )
  }

  const useUsers = () => {
    const {data, error, isValidating, mutate} = useSWR(
      {
        url: 'user-list',
        args: {limit: 15, offset: 0, tglSort: tglSort ? 'ASC' : 'DESC', search},
      },
      fetchUsers,
      {
        revalidateIfStale: false,
        revalidateOnFocus: false,
      }
    )
    return {
      data,
      isLoading: !error && !data,
      isError: error,
      isValidating,
      mutateUser: mutate,
    }
  }
  const {data, isError, isLoading, isValidating, mutateUser} = useUsers()
  const setMultiState = (setStateName, obj) => {
    setStateName(s => ({
      ...s,
      ...obj,
    }))
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
      noMoreDataLabel: false,
      tglSort: false,
      search: '',
    })
  }

  const formInputHandler = (key, event) => {
    if (username) setMultiState(setPageState, {usernameErr: false})
    setMultiState(setForm, {[key]: event.target.value})
  }

  const searchHandler = event => {
    if (event.keyCode == 13) {
      setMultiState(setPageState, {search: event.target.value})
    }
  }

  const getRoleName = role => {
    return role == 1 ? 'Super user' : role == 2 ? 'Dosen' : 'Mahasiswa'
  }

  if (isLoading || isValidating) {
    return <FullScreenLoader />
  }

  return (
    <>
      <PlainCard label="Manajemen User" />
      {data && !isError ? (
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
          <>
            <GlobalTable
              headingList={[
                {label: 'No.'},
                {label: 'Nama'},
                {label: 'Username'},
                {label: 'Role'},
                {
                  label: 'Tanggal Dibuat',
                  sort: true,
                  sortType: tglSort,
                  handler: () => {
                    mutateUser()
                    setPageState(s => ({...s, tglSort: !s.tglSort}))
                  },
                },
              ]}
            >
              <TableRow>
                {/* <TableCell /> */}
                <TableCell colSpan={5}>
                  <TextField
                    size="small"
                    label="Cari berdasarkan Nama / Username"
                    variant="outlined"
                    onKeyDown={val => searchHandler(val)}
                    fullWidth
                  />
                </TableCell>
              </TableRow>
              {data.users.map((item, i) => (
                <TableRow
                  key={i}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>{getRoleName(item.tipe)}</TableCell>
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
            {data.users.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: 20,
                }}
              >
                <FetchMoreButton
                  label="Muat Lebih Banyak"
                  onClick={async () => {
                    setMultiState(setPageState, {fetchMoreLoad: true})
                    await fethMoreUsers()
                    setMultiState(setPageState, {fetchMoreLoad: false})
                  }}
                  moreData={fetchMoreLoad}
                  noMoreDataLabel={noMoreDataLabel}
                />
              </div>
            )}
          </>
        </div>
      ) : null}
      <MainFloatingButton
        scrollToTop={scrollToTop}
        refreshPage={() => {
          resetPageState()
          mutateUser()
        }}
      />
      <GlobalAlert
        label="Error saat mengambil data user"
        onClose={() => setMultiState(setPageState, {err: false})}
        opened={isError}
        promptDialog
      />
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

const s = {textField: {my: 2}}

export default UserPage
