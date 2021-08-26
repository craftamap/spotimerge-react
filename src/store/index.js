import create from 'zustand'
import { devtools } from 'zustand/middleware'

import Auth from './auth'
import Flags from './flags'
import Stages from './stages'
import Playlists from './playlists'
import EditPlaylistForm from './editPlaylistForm'
import SelectPlaylist from './selectPlaylist'
import Profile from './profile'

/**
* @typedef {ReturnType<store>} StoreShape
*/

/**
* @param {import('zustand').GetState<StoreShape>} get
*/
const store =
  (set, get) => ({
    ...Auth(set, get),
    ...Flags(set, get),
    ...Stages(set, get),
    ...Playlists(set, get),
    ...EditPlaylistForm(set, get),
    ...SelectPlaylist(set, get),
    ...Profile(set, get),
    isLoading: false,
    setIsLoading: (isLoading) => {
      return set(() => ({
        isLoading,
      }))
    },
  })

/**
 * @type {import('zustand').UseStore<StoreShape>}
 */
const useStore = create(devtools(store))

// TODO: maybe extract this to a different place
window.addEventListener('message', (event) => {
  const payload = event.data
  if (payload?.type === 'setToken') {
    console.log(useStore)
    useStore.getState().setToken(payload.token, payload.expiresAt)
  }
})

export default useStore
