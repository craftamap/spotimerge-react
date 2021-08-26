import Spotify from 'spotify-web-api-js'

const auth = (set, get) => {
  return {
    profile: {
      displayName: null,
      image: null,
      loading: false,
      show: false,
    },
    fetchUserInformation: async () => {
      set(() => ({
        profile: {
          ...get().profile,
          loading: true,
        },
      }))
      const token = get().auth.token
      const client = new Spotify()
      client.setAccessToken(token)

      const userInformation = await client.getMe()
      set(() => ({
        profile: {
          ...get().profile,
          loading: false,
          displayName: userInformation.display_name,
          image: userInformation.images[0].url,
        },
      }))
    },
    showUserInformation: (withShow) => {
      if (withShow) {
        get().fetchUserInformation()
      }
      set(() => ({
        profile: {
          ...get().profile,
          show: withShow,
        },
      }))
    },
  }
}

export default auth
