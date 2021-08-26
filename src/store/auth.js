/**
* @typedef {import("zustand").SetState} SetState
* @typedef {import("zustand").GetState} GetState
*
* @param set {SetState}
* @param get {GetState}
*/
const auth = (set, get) => {
  return {
    auth: {
      isLoggedIn: false,
      expiresAt: null,
      token: '',
    },
    setToken: (token, expiresAt) => {
      set(() => ({
        auth: {
          token,
          expiresAt,
          isLoggedIn: true,
        },
      }))
      get().storeTokenToStorage()
    },
    // TODO: use consts here
    storeTokenToStorage: () => {
      localStorage.setItem('spotimerge_token', get().auth.token)
      localStorage.setItem('spotimerge_token_expires_at', get().auth.expiresAt)
    },
    loadTokenFromStorage: () => {
      const token = localStorage.getItem('spotimerge_token')
      const expiresAt = localStorage.getItem('spotimerge_token_expires_at')
      if (new Date().getTime() - new Date(expiresAt).getTime() < 0) {
        get().setToken(token, expiresAt)
      }
    },
    removeTokenFromStorage: () => {
      localStorage.removeItem('spotimerge_token')
      localStorage.removeItem('spotimerge_token_expires_at')
    },
  }
}

export default auth
