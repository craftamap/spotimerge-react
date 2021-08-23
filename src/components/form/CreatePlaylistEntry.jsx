import React, { useState } from 'react'
import useStore from '../../store/index'
import Button from './Button'
import Input from './Input'

export default function CreatePlaylistEntry () {
  const [text, setText] = useState('')
  const addPlaylistToEditForm = useStore((state) => state.addPlaylistToEditForm)

  return (
    <div>
      <Input name="newPlaylistId" value={text} onChange={(e) => { setText(e.target.value) }} />
      <Button onClick={() => {
        addPlaylistToEditForm(text)
        setText('')
      }}>Add</Button>
    </div>
  )
}
