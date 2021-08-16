import React, { useState } from 'react'
import useStore from '../store'

export default function CreatePlaylist () {
  const createPlaylistAndSwitchToEditPlaylist = useStore((store) => store.createPlaylistAndSwitchToEditPlaylist)

  const [name, setName] = useState('')

  return (<div>
    <label htmlFor="playlistName">
      <span> Enter a name for your new playlist:</span>
      <input id="playlistName" value={name} onChange={(e) => {
        setName(e.target.value)
      }}/>
      <button onClick={() => { createPlaylistAndSwitchToEditPlaylist(name) }}></button>
    </label>
  </div>)
}
