import React, { useState } from 'react'
import useStore from '../../store/index'

export default function CreatePlaylistEntry () {
  const [text, setText] = useState('')
  const addPlaylistToEditForm = useStore((state) => state.addPlaylistToEditForm)

  return (
    <div><input name="newPlaylistId" value={text} onChange={(e) => { setText(e.target.value) }} /><button onClick={() => {
      addPlaylistToEditForm(text)
      setText('')
    }}>Add</button></div>
  )
}
