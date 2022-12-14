import React, {useEffect, useState, useRef, Fragment} from 'react'
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
import Typography from '@mui/material/Typography'

import Alert from '../components/Alert'
import CardContainer from '../components/CardContainer'
import DataTable from '../components/DataTable'
import PlainCard from '../components/PlainCard'
import FullPageWarning from '../components/FullPageWarning'
import FullScreenLoader from '../components/FullScreenLoader'
import FetchMoreButton from '../components/FetchMoreButton'
import MainFloatingButton from '../components/FloatingActionButton'
import ModalUpdateVideo from '../components/ManajemenVideoPage/ModalUpdateVideo'
import SelectInput from '../components/SelectInput'
import ActionButton from '../components/ActionButton'
import InnerLayout from '../layouts/InnerLayout'
import {getLocalToken, isSessionExp, scrollToTop} from '../utils/globalFunction'
import {baseUrl} from '../config/api'
import {mainDateTimeFormat, insertDateTimeFormat} from '../config/globalvar'
import {IconButton} from '@mui/material'

const ManajemenVideoPage = () => {
  dayjs.locale('id')
  const history = useHistory()
  const firstRender = useRef(true)
  const [searchInput, setSearchInput] = useState('')
  const [collapseOpen, setCollapseOpen] = useState(false)
  const [collapseIndex, setCollapseIndex] = useState('')
  const [noMoreDataLabel, setNoMoreDataLabel] = useState(false)
  const [fetchMoreLoad, setFetchMoreLoad] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false)
  const [previousData, setPreviousData] = useState({judul: '', deskripsi: ''})

  const [search, setSearch] = useState('')

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      document.title = 'Manajemen Video'
    }

    mutateManajemenVideo()
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

  const useManajemenVideo = () => {
    const {data, error, isValidating, mutate} = useSWR(
      {
        url: 'get-auth-callback',
        args: {
          limit: 30,
          offset: 0,
          search,
          callbackType: 'listVideo',
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
      mutateManajemenVideo: mutate,
    }
  }
  const {data, isError, isLoading, isValidating, mutateManajemenVideo} =
    useManajemenVideo()

  if (isLoading || isValidating) return <FullScreenLoader />

  const fethMoreManajemenVideo = async () => {
    await mutateManajemenVideo(
      async prevData => {
        const nextData = await fetchApi({
          url: 'get-auth-callback',
          args: {
            offset: data?.data.length,
            limit: 30,
            search,
            callbackType: 'listVideo',
          },
        })

        if (nextData.data.length <= 0) setNoMoreDataLabel(true)

        return {
          status: nextData.status,
          count: nextData.count,
          data: [...prevData.data, ...nextData.data],
        }
      },
      {revalidate: false}
    )
  }

  const resetState = () => {
    setNoMoreDataLabel(false)
    setSearch('')
    setSearchInput('')
  }

  const collapseHandler = i => {
    setCollapseIndex(i)
    setCollapseOpen(s => !s)
  }

  const searchHandler = event => {
    if (event.keyCode == 13) setSearch(event.target.value)
  }

  const handleUpdateVideo = async val => {
    try {
      await fetchApi({
        url: 'get-auth-callback',
        args: {...val, callbackType: 'updateVideo'},
      })
    } catch (e) {
      setAlertOpen(true)
    } finally {
      mutateManajemenVideo()
    }
  }

  const headingList = [
    {label: ' '},
    {label: 'No.'},
    {label: 'Judul'},
    {label: 'Deskripsi'},
    {label: 'Tanggal'},
  ]

  return (
    <>
      <PlainCard label="Manajemen Video" />
      {data && !isError ? (
        <InnerLayout>
          <>
            <DataTable
              headingList={headingList}
              filterComponents={
                <>
                  <Typography
                    sx={{pl: 1.5, pb: 1.5}}
                  >{`Total Video: ${data.count}`}</Typography>
                  <div style={{display: 'flex', flexDirection: 'row'}}>
                    <TextField
                      size="small"
                      placeholder="Cari berdasarkan Judul Video"
                      variant="outlined"
                      value={searchInput}
                      onChange={e => setSearchInput(e.target.value)}
                      onKeyDown={val => searchHandler(val)}
                      sx={{pb: 1, px: 1.5}}
                      fullWidth
                      inputProps={{
                        autoComplete: 'new-password',
                      }}
                    />
                  </div>
                </>
              }
            >
              {data.data.map((item, i) => (
                <Fragment key={i}>
                  <TableRow
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
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{item.judul}</TableCell>
                    <TableCell>{item.deskripsi}</TableCell>
                    <TableCell>
                      {`${dayjs(item.tgl).format(mainDateTimeFormat)}`}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                    <TableCell sx={{pb: 0, pt: 0}} colSpan={headingList.length}>
                      <Collapse
                        in={collapseOpen && i == collapseIndex}
                        timeout="auto"
                        unmountOnExit
                      >
                        <ActionButton
                          updateHandler={() => {
                            setPreviousData({
                              judul: item.judul,
                              deskripsi: item.deskripsi,
                              id: item.id,
                            })
                            setModalUpdateOpen(true)
                          }}
                        />
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))}
            </DataTable>
            {data.data.length > 0 && (
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
                    setFetchMoreLoad(true)
                    await fethMoreManajemenVideo()
                    setFetchMoreLoad(false)
                  }}
                  moreData={fetchMoreLoad}
                  noMoreDataLabel={noMoreDataLabel}
                />
              </div>
            )}
          </>
        </InnerLayout>
      ) : null}

      <FullPageWarning
        label={'Gagal saat memuat data video, silakan coba kembali !!!'}
        displayed={isError}
      />

      <Alert
        label="Terjadi kesalahan saat update video, Silakan coba kembali !!!"
        opened={alertOpen}
        onClose={() => setAlertOpen(false)}
        promptDialog
      />

      <MainFloatingButton
        scrollToTop={scrollToTop}
        refreshPage={() => {
          resetState()
          mutateManajemenVideo()
        }}
      />

      {modalUpdateOpen && !isError ? (
        <ModalUpdateVideo
          open={modalUpdateOpen}
          previousData={previousData}
          closeHandler={() => {
            setModalUpdateOpen(false)
          }}
          getFormData={val => {
            handleUpdateVideo(val)
            setModalUpdateOpen(false)
          }}
        />
      ) : null}
    </>
  )
}

export default ManajemenVideoPage
