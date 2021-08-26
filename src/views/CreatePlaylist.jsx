import React, { useState } from 'react'
import Button from '../components/form/Button'
import Input from '../components/form/Input'
import useStore from '../store'

export default function CreatePlaylist () {
  const createPlaylistAndSwitchToEditPlaylist = useStore((store) => store.createPlaylistAndSwitchToEditPlaylist)

  const [name, setName] = useState('')

  return (<div>
    <label htmlFor="playlistName">
      <p>Enter a name for your new playlist:</p>
      <Input id="playlistName" value={name} onChange={(e) => {
        setName(e.target.value)
      }}/>
      <Button onClick={() => { createPlaylistAndSwitchToEditPlaylist(name) }}>Create Playlist</Button>
    </label>
  </div>)
}
