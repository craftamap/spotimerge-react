import Spotify from 'spotify-web-api-js'

const selectPlaylist = (set, get) => ({
  spotimergePlaylists: {},
  fetchExistingPlaylists: async () => {
    const LIMIT = 50

    const token = get().auth.token
    const client = new Spotify()
    client.setAccessToken(token)

    const playlistsResponse = await client.getUserPlaylists({ limit: LIMIT })
    const playlists = playlistsResponse.items
    if (playlistsResponse.total > LIMIT) {
      const nrOfRequests = Math.ceil(playlistsResponse.total / LIMIT) - 1
      // TODO: Pretty sure we could also do this with Promise.all
      for (let i = 1; i <= nrOfRequests; i++) {
        const playlistsResponse = await client.getUserPlaylists({ limit: LIMIT, offset: LIMIT * i })
        playlists.push(...playlistsResponse.items)
      }
    }
    const relevantPlaylists = playlists.filter((playlist) => {
      return playlist.name.includes('#SpotiMerge')
    })
    return set(() => {
      return {
        spotimergePlaylists: Object.fromEntries(relevantPlaylists.map(playlist => {
          return [playlist.id, playlist]
        })),
      }
    })
  },
})

export default selectPlaylist
