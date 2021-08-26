import React, { useMemo, useState } from 'react'
import useStore from '../store'
import PlaylistEntry from '../components/form/PlaylistEntry'
import Button from '../components/form/Button'
import CreatePlaylistEntry from '../components/form/CreatePlaylistEntry'
import styled from '@emotion/styled'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'

const Songs = styled.ul`
  padding-left: 0; 
  list-style-type: none;

  li {
    padding-bottom: 0.5em;
    display: grid;
    grid-template-columns: 1fr 1fr; 
    grid-template-rows: 1fr 1fr; 
    gap: 0px 0px; 
    grid-template-areas: 
      ". ."
      "artist artist"; 
  }
  li>div:nth-child(2) {
    justify-self:end;
    
  }
  li>div:last-child {
    grid-area: artist;
    color: hsl(0,0%,40%);
  }
`

export default function EditPlaylist () {
  const selectedPlaylistTitle = useStore((state) => { return state.fetchedPlaylists[state.editPlaylistForm.selectedPlaylist].information.name })
  const rebuildSelectedPlaylist = useStore((state) => { return state.rebuildSelectedPlaylist })
  const playlistTracks = useStore((state) => { return state.fetchedPlaylists[state.editPlaylistForm.selectedPlaylist].tracks })
  const updatePlaylistDescription = useStore((state) => { return state.updatePlaylistDescription })
  const isRebuilding = useStore((state) => { return state.editPlaylistForm.isRebuilding })
  const playlistIds = useStore((state) => { return state.editPlaylistForm.playlistIds })
  const [showSongs, setShowSongs] = useState(false)

  const rows = useMemo(() => playlistTracks.map((row) => {
    return (
      <li key={row.uri}>
        <div>{row.name}</div><div>{Math.floor(row.duration / 1000 / 60)}min {Math.floor(row.duration / 1000 % 60)}s</div>
        <div>{row.artist.name}</div>
      </li>
    )
  }), [playlistTracks])

  const playlistRows = useMemo(() =>
    playlistIds.map((p) => <PlaylistEntry playlistId={p} key={p}/>),
  [playlistIds])

  return (
    <>
      <h2>{selectedPlaylistTitle}</h2>
      <div>
        <h3>Merged Playlists</h3>
        <div>
          <div>
            {playlistRows}
          </div>
          <CreatePlaylistEntry/>
        </div>
        <Button onClick={updatePlaylistDescription}>Save merged playlists</Button>
        <Button onClick={rebuildSelectedPlaylist} loading={isRebuilding}>Rebuild track list</Button>
        <h3>Preview your new playlist</h3>
        <Button onClick={() => {
          setShowSongs(!showSongs)
        }}>{showSongs ? <><ChevronUpIcon width="16px"/>hide</> : <><ChevronDownIcon width="16px"/>show</>} songs</Button>
        <Songs>
          {showSongs && rows}
        </Songs>
      </div>
    </>
  )
}
