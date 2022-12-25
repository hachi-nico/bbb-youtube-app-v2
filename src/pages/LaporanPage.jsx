import React, {useEffect, useState, useRef, Fragment} from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import useSWR from 'swr'
import {IconButton} from '@mui/material'

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
import {green, blue, yellow, grey, red} from '../config/color'

const LaporanPage = () => {
  dayjs.locale('id')
  const history = useHistory()
  const firstRender = useRef(true)
  const [searchInput, setSearchInput] = useState('')
  const [fetchMoreLoad, setFetchMoreLoad] = useState(false)
  const [noMoreDataLabel, setNoMoreDataLabel] = useState(false)

  const [tglSort, setTglSort] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      document.title = 'Laporan Upload'
    }

    mutateLaporanUpload()
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

  const useLaporanUpload = () => {
    const {data, error, isValidating, mutate} = useSWR(
      {
        url: 'laporan-list',
        args: {
          limit: 30,
          offset: 0,
          search,
          tglSort: tglSort ? 'ASC' : 'DESC',
          status,
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
      mutateLaporanUpload: mutate,
    }
  }
  const {data, isError, isLoading, isValidating, mutateLaporanUpload} =
    useLaporanUpload()

  if (isLoading || isValidating) return <FullScreenLoader />

  const fethMoreLaporanUpload = async () => {
    await mutateLaporanUpload(
      async prevData => {
        const nextData = await fetchApi({
          url: 'laporan-list',
          args: {
            offset: data?.laporan.length,
            limit: 30,
            search,
            status,
            tglSort: tglSort ? 'ASC' : 'DESC',
          },
        })

        if (nextData.laporan.length <= 0) setNoMoreDataLabel(true)

        return {
          status: nextData.status,
          laporan: [...prevData.laporan, ...nextData.laporan],
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

  const searchHandler = event => {
    if (event.keyCode == 13) setSearch(event.target.value)
  }

  const statusList = [
    {label: 'Gagal', value: 5, color: red},
    {label: 'Dalam Antrian', value: 4, color: grey},
    {label: 'Dibatalkan', value: 3, color: yellow},
    {label: 'Proses Upload', value: 2, color: blue},
    {label: 'Berhasil', value: 1, color: green},
  ]

  const handleStatus = data => {
    let label = ''
    statusList.map(item => {
      if (item.value == data) {
        label = item.label
      }
    })
    return label
  }

  const headingList = [
    {label: 'No.'},
    {label: 'Judul'},
    {label: 'Role'},
    {
      label: 'Tanggal Dibuat',
      sort: true,
      sortType: tglSort,
      handler: () => {
        mutateUser()
        setTglSort(s => !s)
      },
    },
  ]

  return (
    <>
      <PlainCard label="Laporan Upload" />
      {data && !isError ? (
        <InnerLayout>
          <>
            <DataTable
              size="medium"
              headingList={headingList}
              filterComponents={
                <div style={{display: 'flex', flexDirection: 'row'}}>
                  <TextField
                    size="small"
                    placeholder="Cari berdasarkan Judul dan Deskripsi"
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
                  <SelectInput
                    label="Status"
                    value={status}
                    addtionalSx={{pr: 1.5}}
                    selectHandler={e => setStatus(e.target.value)}
                    items={statusList}
                  />
                </div>
              }
            >
              {data.laporan.map((item, i) => (
                <Fragment key={i}>
                  <TableRow
                    sx={{
                      '&:last-child td, &:last-child th': {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{item.judul}</TableCell>
                    <TableCell>{handleStatus(item.status)}</TableCell>
                    <TableCell>
                      {dayjs(item.tgl_upload).format(mainDateTimeFormat)}
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))}
            </DataTable>

            {data.laporan.length > 0 && (
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
                    await fethMoreLaporanUpload()
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

      <MainFloatingButton
        scrollToTop={scrollToTop}
        refreshPage={() => {
          resetState()
          mutateLaporanUpload()
        }}
      />

      <FullPageWarning
        label={'Gagal saat memuat data laporan, silakan coba kembali !!!'}
        displayed={isError}
      />
    </>
  )
}

export default LaporanPage
