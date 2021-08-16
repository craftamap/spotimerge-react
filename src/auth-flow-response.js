const hash = window.location.hash
const values = new URLSearchParams(hash.substring(1))

window.opener.postMessage({
  type: 'setToken',
  token: values.get('access_token'),
  expiresAt: new Date(new Date().getTime() + ((values.get('expires_in') - 30) * 1000)),
})
