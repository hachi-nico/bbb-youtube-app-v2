import React, {useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import useSWR from 'swr'
import axios from 'axios'
import {io} from 'socket.io-client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'

import PlainCard from '../components/PlainCard'
import InnerLayout from '../layouts/InnerLayout'
import FullScreenLoader from '../components/FullScreenLoader'
import FullPageWarning from '../components/FullPageWarning'
import MainFloatingButton from '../components/FloatingActionButton'
import FetchMoreButton from '../components/FetchMoreButton'
import {getLocalToken, isSessionExp, scrollToTop} from '../utils/globalFunction'
import {mainDateTimeFormat} from '../config/globalvar'
import {baseUrl} from '../config/api'
import {green, blue, yellow, grey, red} from '../config/color'

const socket = io(baseUrl)

const Beranda = () => {
  dayjs.locale('id')
  const history = useHistory()
  const firstRender = useRef(true)
  const [noMoreDataLabel, setNoMoreDataLabel] = useState(false)
  const [fetchMoreLoad, setFetchMoreLoad] = useState(false)
  const [progress, setProgress] = useState(0)
  const [connect, setConnect] = useState(socket.connected)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      document.title = 'Manajemen User'
    }

    socket.on('status', status => {
      setConnect(status)
    })

    socket.on('uploadProgress', val => {
      setProgress(val)
    })

    mutateAntrian()
    return () => {
      socket.off('status')
      socket.off('uploadProgress')
    }
  }, [])

  const fetchApi = async args => {
    try {
      const resData = await Promise.all([
        axios.post(baseUrl + args.url[0], args.args, {
          headers: {
            authorization: getLocalToken(),
          },
        }),
        axios.post(
          baseUrl + args.url[1],
          {},
          {
            headers: {
              authorization: getLocalToken(),
            },
          }
        ),
      ])

      return {
        count: resData[1].data.count,
        antrian: resData[0].data.antrian,
      }
    } catch (e) {
      isSessionExp(e?.response.data.status, history)
      throw e
    }
  }

  const useAntrian = () => {
    const {data, error, isValidating, mutate} = useSWR(
      {
        url: ['antrian', 'count-antrian'],
        args: {offset: 0},
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
      mutateAntrian: mutate,
    }
  }
  const {data, isError, isLoading, isValidating, mutateAntrian} = useAntrian()

  if (isLoading || isValidating) return <FullScreenLoader />

  const fethMoreAntrian = async () => {
    await mutateAntrian(
      async prevData => {
        const nextData = await fetchApi({
          url: ['antrian', 'count-antrian'],
          args: {offset: data?.antrian.length},
        })

        if (nextData.antrian.length <= 0) setNoMoreDataLabel(true)
        return {
          antrian: [...prevData.antrian, ...nextData.antrian],
          count: nextData.count,
        }
      },
      {revalidate: false}
    )
  }

  const resetState = () => {
    setNoMoreDataLabel(false)
  }

  return (
    <>
      <PlainCard label="Antrian Upload Recording BigBlueButton" />
      {data && !isError ? (
        <InnerLayout>
          <Card sx={{p: 2}}>
            <Typography color={connect ? green : red}>{`Status Data Realtime: ${
              connect ? 'Terhubung' : 'Tidak Terhubung'
            }`}</Typography>
            <Typography>{`Total Antrian: ${data.count}`}</Typography>
          </Card>
          {data.antrian.map((item, i) => (
            <Card sx={{my: 2}} key={i}>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography sx={{fontWeight: 'bold'}}>
                    {dayjs(item.tgl_upload).format(mainDateTimeFormat)}
                  </Typography>
                  <Typography color={item.status == 2 ? blue : grey}>
                    {item.status == 2
                      ? 'proses upload ke youtube'
                      : 'dalam antrian'}
                  </Typography>
                </Box>
                <Typography>{`Internal Meeting ID ${item.judul}`}</Typography>
                <Typography>{`Meeting ID ${item.deskripsi}`}</Typography>
                {item.status != 2 ? (
                  <LinearProgress
                    sx={{mt: 3}}
                    variant={progress > 0 ? 'determinate' : 'indeterminate'}
                    value={progress}
                  />
                ) : null}
              </CardContent>
            </Card>
          ))}
          {data.antrian.length > 0 ? (
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
                  await fethMoreAntrian()
                  setFetchMoreLoad(false)
                }}
                moreData={fetchMoreLoad}
                noMoreDataLabel={noMoreDataLabel}
              />
            </div>
          ) : null}
        </InnerLayout>
      ) : null}
      <MainFloatingButton
        scrollToTop={scrollToTop}
        refreshPage={() => {
          resetState()
          mutateAntrian()
        }}
      />

      <FullPageWarning
        label="Gagal saat memuat data user, silakan coba kembali !!!"
        displayed={isError}
      />
    </>
  )
}

export default Beranda
