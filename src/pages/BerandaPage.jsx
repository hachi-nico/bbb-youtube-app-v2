import React, {useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import useSWR from 'swr'
import axios from 'axios'

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
import SwitchButton from '../components/Switch'

const Beranda = () => {
  dayjs.locale('id')
  const autoRefreshSetting = JSON.parse(
    localStorage.getItem('autoRefreshSetting')
  )
  const history = useHistory()
  const firstRender = useRef(true)
  const [noMoreDataLabel, setNoMoreDataLabel] = useState(false)
  const [fetchMoreLoad, setFetchMoreLoad] = useState(false)
  const [checked, setChecked] = useState(autoRefreshSetting?.setting ?? false)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      document.title = 'Antrian'
    }

    mutateAntrian()
  }, [])

  const formatData = val => {
    if (!val || !val.length > 0) return []
    const firstIndex = val.filter(item => item.status == 2)
    const nextIndex = val.filter(item => item.status !== 2)
    return [...firstIndex, ...nextIndex]
  }

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
        refreshInterval: checked ? 5000 : false,
      }
    )

    const formattedData = formatData(data?.antrian)
    return {
      data: {count: data?.count, antrian: formattedData},
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
        const formattedData = formatData([
          ...prevData.antrian,
          ...nextData.antrian,
        ])
        return {
          status: nextData.status,
          antrian: formattedData,
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
            <SwitchButton
              label="Refresh Otomatis"
              checked={checked}
              onChange={() => {
                localStorage.setItem(
                  'autoRefreshSetting',
                  JSON.stringify({setting: !checked})
                )
                setChecked(s => !s)
              }}
            />
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
                {item.status == 2 ? (
                  <LinearProgress sx={{mt: 3}} variant="indeterminate" />
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
        label={'Gagal saat memuat data antrian, silakan coba kembali !!!'}
        displayed={isError}
      />
    </>
  )
}

export default Beranda
