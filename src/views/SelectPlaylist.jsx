import React, { useState } from 'react'
import Select from 'react-select'
import Button from '../components/form/Button'
import useStore from '../store'

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
  const [playlists, switchToEditPlaylist] = useStore((state) => [state.spotimergePlaylists, state.switchToEditPlaylist])
  const options = getOptions(playlists)

  const [selected, setSelected] = useState(null)

  return (
    <div>
      <Select options={options} value={selected} onChange={(option) => { setSelected(option) }}/>
      <Button onClick={() => { if (selected !== null) { switchToEditPlaylist(selected.value) } }}>select</Button>
    </div>
  )
}
