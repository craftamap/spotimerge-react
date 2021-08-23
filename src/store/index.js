import create from 'zustand'
import { devtools } from 'zustand/middleware'
import Spotify from 'spotify-web-api-js'
import { getPlaylistIdFromString } from '../utils/spotify'
import { difference } from '../utils/set.js'

const range = (n) => Array.from(new Array(n), (_, i) => i)

const htmlDecode = (input) => {
  const doc = new DOMParser().parseFromString(input, 'text/html')
  return doc.documentElement.textContent
}

export const Stages = {
  SELECT_PATH: 'SELECT_PATH',
  SELECT_PLAYLIST: 'SELECT_PLAYLIST',
  CREATE_PLAYLIST: 'CREATE_PLAYLIST',
  EDIT_PLAYLIST: 'EDIT_PLAYLIST',
}

let flagId = 1

const useStore = create(devtools((set, get) => ({
  auth: {
    isLoggedIn: false,
    username: '',
    id: '',
    token: '',
  },
  spotimergePlaylists: {},
  fetchedPlaylists: {},
  isLoading: false,
  isRebuilding: false,
  currentStage: Stages.SELECT_PATH,
  selectedPlaylist: '',
  editPlaylistForm: {
    playlistIds: [],
  },
  flags: [],
  addFlag: (flagData) => {
    const fId = flagId++
    set(() => ({
      flags: [{ ...flagData, id: fId }, ...get().flags],
    }))
    setTimeout(() => {
      get().removeFlag(fId)
    }, 5000)
  },
  removeFlag: (flagId) => {
    set(() => ({
      flags: get().flags.filter((f) => f.id !== flagId),
    }))
  },
  switchToSelectPlaylist: async () => {
    set(() => ({
      isLoading: true,
    }))
    await get().fetchExistingPlaylists()
    set(() => ({
      currentStage: Stages.SELECT_PLAYLIST,
    }))
    set(() => ({
      isLoading: false,
    }))
  },
  switchToCreatePlaylist: async () => {
    set(() => ({
      currentStage: Stages.CREATE_PLAYLIST,
    }))
  },
  createPlaylistAndSwitchToEditPlaylist: async (playlistName) => {
    set(() => ({
      isLoading: true,
    }))

    const playlistInfo = await get().createPlaylist(playlistName)
    get().switchToEditPlaylist(playlistInfo.id)
  },
  switchToEditPlaylist: async (playlistId) => {
    set(() => ({
      isLoading: true,
      selectedPlaylist: playlistId,
    }))
    await get().fetchPlaylist(playlistId)
    get().decodePlaylistDescriptionOfSelectedPlaylist()
    await get().fetchPlaylistTracks(get().selectedPlaylist)
    set(() => ({
      currentStage: Stages.EDIT_PLAYLIST,
    }))
    set(() => ({
      isLoading: false,
    }))
  },
  decodePlaylistDescriptionOfSelectedPlaylist: () => {
    const playlistsInDescription = JSON.parse(htmlDecode(htmlDecode(get().fetchedPlaylists[get().selectedPlaylist].information.description)))?.p || []
    // Let's make them unique here, as we do not allow doubled ids
    set(() => ({
      editPlaylistForm: {
        ...get().editPlaylistForm,
        playlistIds: [...new Set(playlistsInDescription)],
      },
    }))
  },
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
    console.log(tracks)

    const flattenedTracks = tracks.map(t => { return t.items }).flat(2).map((track) => {
      return {
        uri: track?.track?.uri,
        name: track?.track?.name,
        artist: track?.track?.artists[0],
        duration: track?.track?.duration_ms,
      }
    })

    console.log(flattenedTracks)

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
  setIsLoading: (isLoading) => {
    return set(() => ({
      isLoading,
    }))
  },
  addPlaylistToEditForm: async (idOrUrl) => {
    // TODO: validate url or id
    const playlistId = getPlaylistIdFromString(idOrUrl)
    // This is to validate if it's a valid playlist
    await get().fetchPlaylist(playlistId)
    set(() => ({
      editPlaylistForm: {
        ...get().editPlaylistForm,
        playlistIds: [...new Set([
          ...get().editPlaylistForm.playlistIds,
          playlistId,
        ])],
      },
    }))
  },
  removePlaylistFromEditForm: (id) => {
    set(() => ({
      editPlaylistForm: {
        ...get().editPlaylistForm,
        playlistIds: get().editPlaylistForm.playlistIds.filter(item => item !== id),
      },
    }))
  },
  /**
  * @param playlistId {string}
  * @param trackIds {string[]}
  */
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
  updatePlaylistDescription: async () => {
    const token = get().auth.token
    const client = new Spotify()
    client.setAccessToken(token)

    const playlistId = get().selectedPlaylist

    await client.changePlaylistDetails(playlistId, {
      description: JSON.stringify({ p: get().editPlaylistForm.playlistIds }),
    })
  },
  rebuildSelectedPlaylist: async () => {
    set(() => ({ isRebuilding: true }))
    await Promise.all(get().editPlaylistForm.playlistIds.map((id) => {
      return get().fetchPlaylistTracks(id)
    }))
    const rebuiltTrackIds = new Set(get().editPlaylistForm.playlistIds.map((id) => {
      return get().fetchedPlaylists[id].tracks
    }).flat(2).map((track) => track.uri))

    const currentTrackIds = new Set(get().fetchedPlaylists[get().selectedPlaylist].tracks.map(t => t.uri))

    console.log(rebuiltTrackIds, currentTrackIds)

    const newSongs = difference(rebuiltTrackIds, currentTrackIds).filter((track) => !track.startsWith('spotify:local'))
    console.log(newSongs)
    const songsToDelete = difference(currentTrackIds, rebuiltTrackIds)
    console.log(songsToDelete)
    if (newSongs.length > 0) {
      await get().addTracksToPlaylist(get().selectedPlaylist, newSongs)
    }
    if (songsToDelete.length > 0) {
      await get().removeTracksFromPlaylist(get().selectedPlaylist, songsToDelete)
    }
    // We need to do both here, since we need to update the total length
    // TODO: maybe don't do this?
    await get().fetchPlaylist(get().selectedPlaylist)
    await get().fetchPlaylistTracks(get().selectedPlaylist)
    set(() => ({ isRebuilding: false }))
    get().addFlag({ title: 'Sucessfully rebuilt track list', content: `${newSongs.length} new songs got added, and ${songsToDelete.length} songs got removed.` })
  },
})))

// TODO: maybe extract this to a different place
window.addEventListener('message', (event) => {
  const payload = event.data
  if (payload?.type === 'setToken') {
    console.log(useStore)
    useStore.getState().setToken(payload.token, payload.expiresAt)
  }
})

export default useStore
