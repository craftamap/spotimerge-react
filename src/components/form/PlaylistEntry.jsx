import React, { useEffect } from 'react'
import useStore from '../../store'

export default function PlaylistEntry ({ playlistId }) {
  const [playlists, fetchPlaylist, removePlaylistFromEditForm] = useStore((state) => [state.fetchedPlaylists, state.fetchPlaylist, state.removePlaylistFromEditForm])
  useEffect(() => {
    fetchPlaylist(playlistId)
  }, [])

  return (
    <div>
      <span>{playlists[playlistId]?.information?.name ?? playlistId}</span><button onClick={() => { removePlaylistFromEditForm(playlistId) }}>delete</button>
    </div>
  )
}
