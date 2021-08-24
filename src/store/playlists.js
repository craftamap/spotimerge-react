import Spotify from 'spotify-web-api-js'
import { range } from '../utils/range'

const playlists = (set, get) => ({
  fetchedPlaylists: {},
  fetchPlaylist: async (playlistId) => {
    if (get()?.fetchedPlaylists?.[playlistId]?.loading) {
      return
    }
    const token = get().auth.token
    const client = new Spotify()
    client.setAccessToken(token)

    set(() => {
      return {
        fetchedPlaylists: {
          ...get().fetchedPlaylists,
          [playlistId]: { ...get().fetchedPlaylists[playlistId], loading: true },
        },
      }
    })

    const playlistResponse = await client.getPlaylist(playlistId)
    set(() => {
      return {
        fetchedPlaylists: {
          ...get().fetchedPlaylists,
          [playlistResponse.id]:
            { ...get().fetchedPlaylists[playlistResponse.id], loading: false, information: playlistResponse },
        },
      }
    })
  },
  fetchPlaylistTracks: async (playlistId) => {
    const token = get().auth.token
    const client = new Spotify()
    client.setAccessToken(token)

    const playlistInformation = get().fetchedPlaylists[playlistId].information
    const totalTracks = playlistInformation.tracks.total

    const numberOfRequests = Math.ceil(totalTracks / 100)

    const tracks = await Promise.all(range(numberOfRequests).map((i) => {
      return client.getPlaylistTracks(playlistId, {
        limit: 100,
        offset: i * 100,
      })
    }))
    // console.log(tracks)

    const flattenedTracks = tracks.map(t => { return t.items }).flat(2).map((track) => {
      return {
        uri: track?.track?.uri,
        name: track?.track?.name,
        artist: track?.track?.artists[0],
        duration: track?.track?.duration_ms,
      }
    })

    // console.log(flattenedTracks)

    set((state) => ({
      fetchedPlaylists: {
        ...state.fetchedPlaylists,
        [playlistId]: {
          ...state.fetchedPlaylists[playlistId],
          tracks: flattenedTracks,
        },
      },
    }))
  },
  createPlaylist: async (playlistName) => {
    const token = get().auth.token
    const client = new Spotify()
    client.setAccessToken(token)

    // TODO: store this is state
    const me = await client.getMe()

    return await client.createPlaylist(me.id, {
      name: `${playlistName} #SpotiMerge`,
      description: JSON.stringify({ p: [] }),
    })
  },
  addTracksToPlaylist: async (playlistId, trackIds) => {
    const token = get().auth.token
    const client = new Spotify()
    client.setAccessToken(token)

    const nrOfRequests = Math.ceil(trackIds.length / 50)
    // Using Promise.all is too fast for spotify?
    for (let n = 0; n < nrOfRequests; n++) {
      await client.addTracksToPlaylist(playlistId, trackIds.slice(n * 50, n * 50 + 50))
    }
  },
  removeTracksFromPlaylist: async (playlistId, trackIds) => {
    const token = get().auth.token
    const client = new Spotify()
    client.setAccessToken(token)

    const nrOfRequests = Math.ceil(trackIds.length / 100)

    for (let n = 0; n < nrOfRequests; n++) {
      await client.removeTracksFromPlaylist(playlistId, trackIds.slice(n * 100, n * 100 + 100))
    }
  },
})

export default playlists
