import create from 'zustand'
import Spotify from 'spotify-web-api-js'

const useStore = create((set, get) => ({
  auth: {
    isLoggedIn: false,
    username: '',
    id: '',
    token: ''
  },
  spotimergePlaylists: [],
  isLoading: false,

  fetchExistingPlaylists: async () => {
    const token = get().auth.token
    const client = new Spotify()
    client.setAccessToken(token)

    const playlists = await client.getUserPlaylists()
    const relevantPlaylists = playlists.filter((playlist) => {
      return playlist.name.contains('#SpotiMerge')
    })
    return set(() => {
      return {
        spotimergePlaylists: relevantPlaylists
      }
    })
  },
  setToken: (token) => {
    return set(state => ({
      auth: {
        token,
        isLoggedIn: true
      }
    }))
  },
  setIsLoading: (isLoading) => {
    return set(state => ({
      isLoading
    }))
  }
}))

window.addEventListener('message', (event) => {
  console.log(event)
  const payload = event.data
  if (payload?.type === 'setToken') {
    console.log(useStore)
    useStore.getState().setToken(payload.token)
  }
})

export default useStore
