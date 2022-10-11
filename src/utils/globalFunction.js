export const setHtmlTitle = (title = '') => {
  return (document.title = title)
}

export const getLocalToken = () => {
  return JSON.parse(localStorage.getItem('token'))
}

export const isSessionExp = (status, history) => {
  if (status == 5) {
    localStorage.removeItem('token')
    history.push('/login')
  } else {
    return false
  }
}
