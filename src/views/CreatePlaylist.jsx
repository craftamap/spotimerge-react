import React, { useState } from 'react'
import Button from '../components/form/Button'
import Input from '../components/form/Input'
import useStore from '../store'
import { ArrowCircleLeftIcon } from '@heroicons/react/outline'

export default function CreatePlaylist () {
  const [createPlaylistAndSwitchToEditPlaylist, backToSelectPath] = useStore((store) => [store.createPlaylistAndSwitchToEditPlaylist, store.backToSelectPath])

  const [name, setName] = useState('')

  return (
    <>
      <ArrowCircleLeftIcon height={'24px'} onClick={() => {
        backToSelectPath()
      }}/>
      <h2>Create a new Playlist</h2>
      <label htmlFor="playlistName">
        <p>Enter a name for your new playlist:</p>
        <Input id="playlistName" value={name} onChange={(e) => {
          setName(e.target.value)
        }}/>
        <Button onClick={() => { createPlaylistAndSwitchToEditPlaylist(name) }}>Create Playlist</Button>
      </label>
    </>
  )
}
