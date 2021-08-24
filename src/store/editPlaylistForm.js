import Spotify from 'spotify-web-api-js'
import { htmlDecode } from '../utils/decode'
import { difference } from '../utils/set'
import { getPlaylistIdFromString } from '../utils/spotify'

const editPlaylistForm = (set, get) => ({
  editPlaylistForm: {
    playlistIds: [],
    selectedPlaylist: '',
    isRebuilding: false,
  },
  decodePlaylistDescriptionOfSelectedPlaylist: () => {
    const playlistsInDescription = JSON.parse(htmlDecode(htmlDecode(get().fetchedPlaylists[get().editPlaylistForm.selectedPlaylist].information.description)))?.p || []
    // Let's make them unique here, as we do not allow doubled ids
    set(() => ({
      editPlaylistForm: {
        ...get().editPlaylistForm,
        playlistIds: [...new Set(playlistsInDescription)],
      },
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
  updatePlaylistDescription: async () => {
    const token = get().auth.token
    const client = new Spotify()
    client.setAccessToken(token)

    const playlistId = get().editPlaylistForm.selectedPlaylist

    await client.changePlaylistDetails(playlistId, {
      description: JSON.stringify({ p: get().editPlaylistForm.playlistIds }),
    })
  },
  rebuildSelectedPlaylist: async () => {
    set(() => ({ editPlaylistForm: { ...get().editPlaylistForm, isRebuilding: true } }))
    await Promise.all(get().editPlaylistForm.playlistIds.map((id) => {
      return get().fetchPlaylistTracks(id)
    }))
    const rebuiltTrackIds = new Set(get().editPlaylistForm.playlistIds.map((id) => {
      return get().fetchedPlaylists[id].tracks
    }).flat(2).map((track) => track.uri))

    const currentTrackIds = new Set(get().fetchedPlaylists[get().editPlaylistForm.selectedPlaylist].tracks.map(t => t.uri))

    console.log(rebuiltTrackIds, currentTrackIds)

    const newSongs = difference(rebuiltTrackIds, currentTrackIds).filter((track) => !track.startsWith('spotify:local'))
    console.log(newSongs)
    const songsToDelete = difference(currentTrackIds, rebuiltTrackIds)
    console.log(songsToDelete)
    if (newSongs.length > 0) {
      await get().addTracksToPlaylist(get().editPlaylistForm.selectedPlaylist, newSongs)
    }
    if (songsToDelete.length > 0) {
      await get().removeTracksFromPlaylist(get().editPlaylistForm.selectedPlaylist, songsToDelete)
    }
    // We need to do both here, since we need to update the total length
    // TODO: maybe don't do this?
    await get().fetchPlaylist(get().editPlaylistForm.selectedPlaylist)
    await get().fetchPlaylistTracks(get().editPlaylistForm.selectedPlaylist)
    set(() => ({ editPlaylistForm: { ...get().editPlaylistForm, isRebuilding: false } }))
    get().addFlag({ title: 'Sucessfully rebuilt track list', content: `${newSongs.length} new songs got added, and ${songsToDelete.length} songs got removed.` })
  },
})

export default editPlaylistForm
