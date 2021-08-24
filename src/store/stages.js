import { Stages } from '../constants'

/**
* @param set {import('zustand').SetState<StoreShape>}
* @param get {import('zustand').GetState<StoreShape>}
*/
const stages = (set, get) => ({
  currentStage: Stages.SELECT_PATH,
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
  switchToEditPlaylist: async (playlistId) => {
    set(() => ({
      isLoading: true,
      editPlaylistForm: {
        ...get().editPlaylistForm,
        selectedPlaylist: playlistId,
      },
    }))
    await get().fetchPlaylist(playlistId)
    get().decodePlaylistDescriptionOfSelectedPlaylist()
    await get().fetchPlaylistTracks(get().editPlaylistForm.selectedPlaylist)
    set(() => ({
      currentStage: Stages.EDIT_PLAYLIST,
    }))
    set(() => ({
      isLoading: false,
    }))
  },
  createPlaylistAndSwitchToEditPlaylist: async (playlistName) => {
    set(() => ({
      isLoading: true,
    }))

    const playlistInfo = await get().createPlaylist(playlistName)
    get().switchToEditPlaylist(playlistInfo.id)
  },
})

export default stages
