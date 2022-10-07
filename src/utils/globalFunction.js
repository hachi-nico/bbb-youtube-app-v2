export const setHtmlTitle = (title = '') => {
  return (document.title = title)
}

export const getLocalToken = () => {
  return JSON.parse(localStorage.getItem('token'))
}
