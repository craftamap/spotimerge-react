import React, { useState } from 'react'
import Select from 'react-select'
import Button from '../components/form/Button'
import useStore from '../store'
import { ArrowCircleLeftIcon } from '@heroicons/react/outline'

function getOptions (playlists) {
  return Object.values(playlists).map((playlist) => {
    return (
      {
        value: playlist.id,
        label: playlist.name,
      }
    )
  })
}

export default function SelectPlaylist () {
  const [playlists, switchToEditPlaylist, backToSelectPath] = useStore(
    (state) => [state.spotimergePlaylists, state.switchToEditPlaylist, state.backToSelectPath],
  )
  const options = getOptions(playlists)

  const [selected, setSelected] = useState(null)

  return (
    <>
      <ArrowCircleLeftIcon height={'24px'} onClick={() => {
        backToSelectPath()
      }}/>
      <h2>Which Playlist Do you want to edit?</h2>
      <div>
        <Select options={options} value={selected} onChange={(option) => { setSelected(option) }}/>
        <Button onClick={() => { if (selected !== null) { switchToEditPlaylist(selected.value) } }}>select</Button>
      </div>
    </>
  )
}
