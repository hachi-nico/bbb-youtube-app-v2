// import React, {useEffect} from 'react'
// import CardContainer from '../components/CardContainer'

// import PlainCard from '../components/PlainCard'
// import InnerLayout from '../layouts/InnerLayout'
// import SwitchButton from '../components/Switch'
// import {useState} from 'react'

// export default function PengaturanPage() {
//   const notificationSetting = JSON.parse(
//     localStorage.getItem('notificationSetting')
//   )
//   const [checked, setChecked] = useState(notificationSetting?.setting ?? false)

//   useEffect(() => {
//     document.title = 'Pengaturan'
//   }, [])

//   const handleNotification = async () => {
//     Notification.requestPermission().then(() => {
//       if (Notification.permission === 'denied') {
//         Notification.requestPermission()
//       }
//     })
//   }

//   return (
//     <>
//       <PlainCard label="Pengaturan" />
//       <InnerLayout>
//         <CardContainer>
//           <SwitchButton
//             label="Aktifkan notifikasi"
//             checked={checked}
//             onChange={async () => {
//               await handleNotification()
//               localStorage.setItem(
//                 'notificationSetting',
//                 JSON.stringify({setting: !checked})
//               )
//               setChecked(s => !s)
//             }}
//           />
//         </CardContainer>
//       </InnerLayout>
//     </>
//   )
// }
