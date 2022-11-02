import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import useSWR from 'swr'

import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TextField from '@mui/material/TextField'
import Collapse from '@mui/material/Collapse'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import Alert from '../components/Alert'
import DataTable from '../components/DataTable'
import PlainCard from '../components/PlainCard'
import FullPageWarning from '../components/FullPageWarning'
import FullScreenLoader from '../components/FullScreenLoader'
import FetchMoreButton from '../components/FetchMoreButton'
import MainFloatingButton from '../components/FloatingActionButton'
import ModalCreateUser from '../components/UserPage/ModalCreateUser'
import SelectInput from '../components/SelectInput'
import ActionButton from '../components/ActionButton'
import InnerLayout from '../layouts/InnerLayout'
import {getLocalToken, isSessionExp, scrollToTop} from '../utils/globalFunction'
import {baseUrl} from '../config/api'
import {mainDateTimeFormat, insertDateTimeFormat} from '../config/globalvar'
import {IconButton} from '@mui/material'

const UserPage = () => {
  dayjs.locale('id')
  const [previousFormData, setPreviousFormData] = useState('')
  const [pageState, setPageState] = useState({
    noMoreDataLabel: false,
    createUserModalOpened: false,
    fetchMoreLoad: false,

    tglSort: false,
    roleSort: '',
    search: '',
    alertLabel: '',
    alertOpen: false,
    collapseOpen: false,
    collapseIndex: '',
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
    collapseOpen,
    collapseIndex,
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

  if (isLoading || isValidating) return <FullScreenLoader />

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

  const resetPageState = () => {
    setMultiState(setPageState, {
      noMoreDataLabel: false,
      tglSort: false,
      roleSort: '',
      search: '',
      createUserModalOpened: false,
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

  const modifyUserHandler = async (val, action = 'menambahkan') => {
    resetPageState()
    try {
      await fetchApi({
        url:
          action == 'menambahkan'
            ? 'add-user'
            : action == 'menghapus'
            ? 'delete-user'
            : 'update-user',
        args:
          action == 'menghapus'
            ? {userId: val}
            : {...val, tgl: dayjs().format(insertDateTimeFormat)},
      })
    } catch (e) {
      setPageState(s => ({
        ...s,
        alertLabel: `Gagal Saat ${action} user, silakan coba kembali !!!`,
        alertOpen: true,
      }))
    } finally {
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

  const collapseHandler = i => {
    setPageState(s => ({
      ...s,
      collapseIndex: i,
      collapseOpen: !s.collapseOpen,
    }))
  }

  const headingList = [
    {label: ' '},
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
        <InnerLayout>
          <>
            <DataTable
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
                      {label: 'Super Admin', value: 1},
                    ]}
                  />
                </div>
              }
            >
              {data.users.map((item, i) => (
                <>
                  <TableRow
                    key={i}
                    sx={{
                      '&:last-child td, &:last-child th': {
                        border: 0,
                      },
                      '& td': {border: 0},
                    }}
                  >
                    <TableCell>
                      <IconButton onClick={() => collapseHandler(i)}>
                        {collapseOpen && i == collapseIndex ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
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
                  <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                    <TableCell sx={{pb: 0, pt: 0}} colspan={5}>
                      <Collapse
                        in={collapseOpen && i == collapseIndex}
                        timeout="auto"
                        unmountOnExit
                      >
                        <ActionButton
                          deleteHandler={() =>
                            modifyUserHandler(
                              data.users[i].user_id,
                              'menghapus'
                            )
                          }
                          updateHandler={() => {
                            setPreviousFormData(data.users[i])
                            setPageState(s => ({
                              ...s,
                              createUserModalOpened: true,
                            }))
                          }}
                        />
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </DataTable>
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
        </InnerLayout>
      ) : null}

      <MainFloatingButton
        scrollToTop={scrollToTop}
        refreshPage={() => {
          resetPageState()
          mutateUser()
        }}
        addData={() => {
          setMultiState(setPageState, {createUserModalOpened: true})
        }}
      />

      <FullPageWarning
        label="Gagal saat memuat data user, silakan coba kembali !!!"
        displayed={isError}
      />

      <Alert
        label={alertLabel}
        opened={alertOpen}
        onClose={closeAlertHandler}
        promptDialog
      />

      {createUserModalOpened && !isError ? (
        <ModalCreateUser
          open={createUserModalOpened}
          previousData={previousFormData}
          closeHandler={() =>
            setMultiState(setPageState, {createUserModalOpened: false})
          }
          getFormData={val => {
            val.userId
              ? modifyUserHandler(val, 'mengubah')
              : modifyUserHandler(val)
          }}
        />
      ) : null}
    </>
  )
}

export default UserPage
