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

import GlobalAlert from '../components/GlobalAlert'
import GlobalTable from '../components/GlobalTable'
import PlainCard from '../components/PlainCard'
import FullPageWarning from '../components/FullPageWarning'
import FullScreenLoader from '../components/FullScreenLoader'
import FetchMoreButton from '../components/FetchMoreButton'
import MainFloatingButton from '../components/MainFloatingButton'
import ModalCreateUser from '../components/UserPage/ModalCreateUser'
import SelectInput from '../components/SelectInput'
import {getLocalToken, isSessionExp, scrollToTop} from '../utils/globalFunction'
import {baseUrl} from '../config/api'
import {green} from '../config/color'
import {mainDateTimeFormat} from '../config/globalvar'

const UserPage = () => {
  dayjs.locale('id')
  const [pageState, setPageState] = useState({
    noMoreDataLabel: false,
    createUserModalOpened: false,
    fetchMoreLoad: false,

    tglSort: false,
    roleSort: '',
    search: '',
    alertLabel: '',
    alertOpen: false,
  })
  const {
    noMoreDataLabel,
    createUserModalOpened,
    tglSort,
    fetchMoreLoad,
    search,
    roleSort,
    alertLabel,
    alertOpen,
  } = pageState

  const history = useHistory()
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      document.title = 'Manajemen User'
    }
    mutateUser()
  }, [])

  const fetchApi = async args => {
    try {
      const {data} = await axios.post(baseUrl + args.url, args.args, {
        headers: {
          authorization: getLocalToken(),
        },
      })
      if (data.status != 1) throw 'Gagal'
      return data
    } catch (e) {
      isSessionExp(e?.response.data.status, history)
      throw e
    }
  }

  const fethMoreUsers = async () => {
    await mutateUser(
      async prevData => {
        const nextData = await fetchApi({
          url: 'user-list',
          args: {
            limit: 15,
            offset: data?.users.length,
            tglSort: tglSort ? 'ASC' : 'DESC',
            tipe: roleSort,
            search,
          },
        })
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
        args: {
          limit: 15,
          offset: 0,
          tglSort: tglSort ? 'ASC' : 'DESC',
          tipe: roleSort,
          search,
        },
      },
      fetchApi,
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

  const resetPageState = () => {
    setMultiState(setPageState, {
      noMoreDataLabel: false,
      tglSort: false,
      roleSort: '',
      search: '',
    })
  }

  const searchHandler = event => {
    if (event.keyCode == 13) {
      setMultiState(setPageState, {search: event.target.value})
    }
  }

  const selectHandler = event => {
    setMultiState(setPageState, {roleSort: event.target.value})
  }

  const getRoleName = role => {
    return role == 1 ? 'Super user' : role == 2 ? 'Dosen' : 'Mahasiswa'
  }

  const addUserHandler = async val => {
    try {
      await fetchApi({
        url: 'add-user',
        args: {
          ...val,
        },
      })
    } catch (e) {
      setPageState(s => ({
        ...s,
        alertLabel: 'Gagal Saat menambahkan user, silakan coba kembali !!!',
        alertOpen: true,
      }))
    } finally {
      setMultiState(setPageState, {createUserModalOpened: false})
      mutateUser()
    }
  }

  const closeAlertHandler = () => {
    setPageState(s => ({
      ...s,
      alertLabel: '',
      alertOpen: false,
    }))
  }

  if (isLoading || isValidating) {
    return <FullScreenLoader />
  }

  const headingList = [
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
  ]

  return (
    <>
      <PlainCard label="Manajemen User" />
      {data && !isError ? (
        <div style={{marginTop: 26, marginBottom: 20}}>
          <Button
            variant="contained"
            sx={{backgroundColor: green, mb: 2}}
            onClick={() =>
              setMultiState(setPageState, {createUserModalOpened: true})
            }
          >
            Tambah User
          </Button>
          <>
            <GlobalTable
              headingList={headingList}
              filterComponents={
                <div style={{display: 'flex', flexDirection: 'row'}}>
                  <TextField
                    size="small"
                    placeholder="Cari berdasarkan Nama / Username"
                    variant="outlined"
                    onKeyDown={val => searchHandler(val)}
                    sx={{pb: 1, px: 1.5}}
                    fullWidth
                    inputProps={{
                      autoComplete: 'new-password',
                    }}
                  />
                  <SelectInput
                    label="Role"
                    value={roleSort}
                    addtionalSx={{pr: 1.5}}
                    selectHandler={selectHandler}
                    items={[
                      {label: 'Mahasiswa', value: 3},
                      {label: 'Dosen', value: 2},
                      {label: 'Super ', value: 1},
                    ]}
                  />
                </div>
              }
            >
              {data.users.map((item, i) => (
                <TableRow
                  key={i}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{`${item.nama ? item.nama : ' - '}`}</TableCell>
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

      <FullPageWarning
        label="Gagal saat memuat data user, silakan coba kembali !!!"
        displayed={isError}
      />

      <GlobalAlert
        label={alertLabel}
        opened={alertOpen}
        onClose={closeAlertHandler}
        promptDialog
      />

      {createUserModalOpened && !isError ? (
        <ModalCreateUser
          open={createUserModalOpened}
          closeHandler={() =>
            setMultiState(setPageState, {createUserModalOpened: false})
          }
          getFormData={async val => addUserHandler(val)}
        />
      ) : null}
    </>
  )
}

export default UserPage
