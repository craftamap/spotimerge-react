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
  backToSelectPath: () => {
    set(() => ({
      currentStage: Stages.SELECT_PATH,
    }))
  },
  backToSelectPlaylist: () => {
    // TODO: add dirty check to allow navigation only with confirmation, if the user made any changes
    set(() => ({
      currentStage: Stages.SELECT_PLAYLIST,
    }))
  },
})

export default stages
