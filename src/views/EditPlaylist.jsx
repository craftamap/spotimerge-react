import React from 'react'
import useStore from '../store'
import PlaylistEntry from '../components/form/PlaylistEntry'
import Button from '../components/form/Button'
import CreatePlaylistEntry from '../components/form/CreatePlaylistEntry'
import styled from '@emotion/styled'

export default function EditPlaylist () {
  const rebuildSelectedPlaylist = useStore((state) => { return state.rebuildSelectedPlaylist })
  const playlistTracks = useStore((state) => { return state.fetchedPlaylists[state.selectedPlaylist].tracks })
  const updatePlaylistDescription = useStore((state) => { return state.updatePlaylistDescription })

  const rows = playlistTracks.map((row) => {
    return <li key={row.uri}>{row.name} - {row.artist.name}</li>
  })
  const playlistForm = useStore((state) => { return state.editPlaylistForm })
  return (
    <div>
      <div>
        {playlistForm.playlistIds.map((p) => <PlaylistEntry playlistId={p} key={p}/>)}
        <CreatePlaylistEntry/>
      </div>
      <Button onClick={updatePlaylistDescription}>Update</Button>
      <Button onClick={rebuildSelectedPlaylist}>Rebuild</Button>
      {rows}
    </div>
  )
}
